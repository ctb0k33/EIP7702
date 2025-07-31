-include .env

# Default chain
CHAIN ?= sepolia 

# Conditional assignment based on the CHAIN variable
ifeq ($(CHAIN),sepolia)
RPC_URL = $(SEPOLIA_RPC_URL)
else ifeq ($(CHAIN),ethereum)
RPC_URL = $(MAINNET_RPC_URL)
else ifeq ($(CHAIN),fuji)
RPC_URL = $(FUJI_RPC_URL)
else ifeq ($(CHAIN),base)
RPC_URL = $(BASE_RPC_URL)
endif

deployGasSponsor:
	forge script script/DeployGasSponsor.s.sol:DeployGasSponsor --rpc-url $(RPC_URL) --account defaultKey --sender $(WALLET_ADDRESS) --broadcast
