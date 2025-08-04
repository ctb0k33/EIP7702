// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @dev Separating nonce storage from EIP-7702 accounts mitigates other arbitrary delegates from unexpectedly reversing state
contract NonceTracker {
    /// @notice Track nonces per-account to mitigate signature replayability
    mapping(address account => uint256 nonce) public nonces;

    /// @notice An account's nonce has been used
    event NonceUsed(address indexed account, uint256 nonce);

    /// @notice Consume a nonce for the caller
    ///
    /// @return nonce The nonce just used
    function useNonce() external returns (uint256 nonce) {
        nonce = nonces[msg.sender]++;
        emit NonceUsed(msg.sender, nonce);
    }

    function getNextNonce(address account) external view returns (uint256) {
        return nonces[account];
    }
}