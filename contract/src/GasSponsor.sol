// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {NonceTracker} from "./NonceTracker.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract GasSponsor is ReentrancyGuard {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // replace with actual token address
    address public constant TEST_TOKEN =
        0x0000000000000000000000000000000000000000;
    uint256 public constant TEST_TOKEN_PER_TRANSACTION = 1 ether;

    // replace with actual nonce tracker address
    address public constant NONCE_TRACKER =
        0x0000000000000000000000000000000000000000;

    error GasSponsor__InvalidSigner();
    error GasSponsor__InsufficientTestTokenBalance();
    error GasSponsor__InsufficientETHBalance();
    error GasSponsor__TestTokenTransferFailed();
    error GasSponsor__ExternalCallFailed();
    error GasSponsor__NotAuthorized();
    error GasSponsor__RefundedFailed();

    event TransactionSponsored(
        address indexed eoa,
        address indexed sponsor,
        uint256 nonce,
        uint256 testTokenPaid,
        address callTo,
        uint256 callValue
    );

    struct Call {
        bytes data;
        address to;
        uint256 value;
    }

    // gas sponsor for a single transaction
    function execute(
        Call memory userCall,
        address sponsor,
        bytes calldata signature
    ) external payable nonReentrant {
        uint256 nonce = NonceTracker(NONCE_TRACKER).useNonce();

        bytes32 digest = keccak256(
            abi.encodePacked(
                block.chainid,
                userCall.to,
                userCall.value,
                keccak256(userCall.data),
                sponsor,
                nonce
            )
        );

        address recovered = digest.toEthSignedMessageHash().recover(signature);
        // in EIP7702- address this is the EOA
        if (recovered != address(this)) revert GasSponsor__InvalidSigner();

        if (address(this).balance < userCall.value)
            revert GasSponsor__InsufficientETHBalance();

        IERC20 testToken = IERC20(TEST_TOKEN);

        if (testToken.balanceOf(address(this)) < TEST_TOKEN_PER_TRANSACTION)
            revert GasSponsor__InsufficientTestTokenBalance();

        bool testTokenTransferSuccess = testToken.transfer(
            sponsor,
            TEST_TOKEN_PER_TRANSACTION
        );
        if (!testTokenTransferSuccess)
            revert GasSponsor__TestTokenTransferFailed();

        (bool callSuccess, ) = userCall.to.call{value: userCall.value}(
            userCall.data
        );
        if (!callSuccess) revert GasSponsor__ExternalCallFailed();

        // return ETH sent by sponsor (sponsor pays for gas)
        if (msg.value > 0) {
            (bool refunded, ) = msg.sender.call{value: msg.value}("");
            if (!refunded) revert GasSponsor__RefundedFailed();
        }

        emit TransactionSponsored(
            address(this),
            sponsor,
            nonce,
            TEST_TOKEN_PER_TRANSACTION,
            userCall.to,
            userCall.value
        );
    }

    // batch transactions
    function execute(Call[] calldata calls) external payable {
        if (msg.sender != address(this)) revert GasSponsor__NotAuthorized();

        for (uint256 i = 0; i < calls.length; i++) {
            (bool success, ) = calls[i].to.call{value: calls[i].value}(
                calls[i].data
            );
            if (!success) revert GasSponsor__ExternalCallFailed();
        }
    }

    function getEOATestTokenBalance() external view returns (uint256) {
        return IERC20(TEST_TOKEN).balanceOf(msg.sender);
    }

    function getEOAETHBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    receive() external payable {}
}
