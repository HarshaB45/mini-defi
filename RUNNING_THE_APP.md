# Running the Mini DeFi App

This guide provides step-by-step instructions to run the Mini DeFi lending pool application.

## Prerequisites

- Node.js (v20 or higher recommended)
- MetaMask browser extension
- Terminal/Command Prompt

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Tests (Optional but Recommended)

```bash
npm test
```

You should see:
```
✓ 12 passing tests
```

### 3. Start Local Blockchain

Open a terminal and run:

```bash
npx hardhat node
```

**Important:** Keep this terminal running! You'll see output like:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
...
```

Save one of the private keys - you'll need it for MetaMask.

### 4. Deploy Contracts

Open a **new terminal** and run:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

You'll see:
```
🚀 Starting DeFi Lending Pool deployment...
✅ MockERC20 deployed to: 0x...
✅ KinkInterestRateModel deployed to: 0x...
✅ LendingPool deployed to: 0x...
💾 Contract addresses saved to frontend/deployed-contracts.json
```

### 5. Configure MetaMask

1. Open MetaMask browser extension
2. Click on the network dropdown (top)
3. Click "Add Network" → "Add a network manually"
4. Enter the following:
   - **Network Name:** Hardhat Local
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency Symbol:** ETH
5. Click "Save"
6. Switch to the "Hardhat Local" network
7. Click on account icon → "Import Account"
8. Paste one of the private keys from Step 3
9. Click "Import"

### 6. Open the Frontend

#### Option A: Using VS Code Live Server (Recommended)
1. Open `frontend/index.html` in VS Code
2. Right-click and select "Open with Live Server"
3. Your browser will open to `http://127.0.0.1:5500/frontend/index.html`

#### Option B: Direct File Open
1. Navigate to the `frontend` folder
2. Double-click `index.html`
3. It should open in your default browser

### 7. Connect and Interact

1. Click **"Connect Wallet"** button
2. Approve the connection in MetaMask
3. The contract addresses should auto-load from `deployed-contracts.json`
4. If not, paste them manually from the deployment output (Step 4)
5. Click **"Load Stats"** to see pool information

### 8. Using the DeFi Protocol

#### Import the Token to MetaMask (First Time Only)
1. In MetaMask, click "Import tokens"
2. Paste the Token Contract Address (from deployment)
3. Token Symbol: TEST
4. Click "Add Custom Token"
5. You should see 1,000,000 TEST tokens (if you imported the deployer account)

#### Deposit
1. Enter amount in "Deposit" section
2. Click "Deposit"
3. Approve in MetaMask
4. You'll receive shares representing your deposit

#### Withdraw
1. Enter amount of shares to burn
2. Click "Withdraw"
3. Approve in MetaMask
4. You'll receive tokens + any earned interest

#### Borrow
1. First deposit some collateral
2. Enter borrow amount (max 66.67% of your collateral)
3. Click "Borrow"
4. Approve in MetaMask
5. Tokens will be sent to your wallet

#### Repay
1. Enter repayment amount
2. Click "Repay"
3. Approve in MetaMask
4. Your debt will be reduced

#### Liquidate
1. Find an unhealthy position (debt > 66.67% of collateral)
2. Enter the borrower's address and amount
3. Click "Liquidate"
4. Approve in MetaMask
5. You'll repay their debt and seize collateral with 5% bonus

## Troubleshooting

### "Transaction Failed" or "Insufficient Funds"
- Make sure you're connected to "Hardhat Local" network (Chain ID 31337)
- Ensure you imported an account with ETH (from Step 3)
- Check that you have TEST tokens for operations

### "Contract not found" errors
- Ensure the Hardhat node is still running (Step 3)
- Verify you deployed to `--network localhost` (Step 4)
- Check that the contract addresses are correct

### Frontend shows "Connect Wallet"
- Click the button and approve in MetaMask
- Make sure MetaMask is on the Hardhat Local network

### Can't see TEST tokens in MetaMask
- Import the token using the Token Contract Address
- If you didn't import the deployer account, you'll need to get tokens from someone who has them

## Testing Different Scenarios

### Test Interest Accrual
1. Account A deposits 1000 tokens
2. Account B deposits 200 tokens and borrows 100
3. Wait or advance time in Hardhat
4. Account A withdraws - should have more than 1000!

### Test Liquidation
1. Account A deposits liquidity
2. Account B deposits 200 and borrows ~126 (95% of max)
3. Accrue interest over time
4. Position becomes unhealthy (debt > collateral limit)
5. Account C liquidates B's position, gets bonus

## Stopping the App

1. Close the browser/frontend
2. In the deployment terminal, press `Ctrl+C`
3. In the Hardhat node terminal, press `Ctrl+C`

## Next Steps

- Experiment with different interest rate models
- Try the governance features (see `docs/governance-tooling.md`)
- Deploy to a testnet (modify hardhat.config.js)

## Need Help?

- Check the test files in `test/` for usage examples
- Read the smart contract comments in `contracts/`
- Review the main README.md for architecture details
