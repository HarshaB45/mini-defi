const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    const [owner, lender, borrower, liquidator] = await ethers.getSigners();

    // Deploy the asset token
    const AssetToken = await hre.ethers.getContractFactory("MockERC20");
    const assetToken = await AssetToken.deploy("Test Token", "TST");

    const InterestRateModel = await hre.ethers.getContractFactory(
        "TimeWeightedInterestRateModel"
    );
    const irm = await InterestRateModel.deploy(
        10000000000000000n, // 1%
        100000000000000000n, // 10%
        20000000000000000n, // 2%
        1000000000000000n, // 0.1%
        600000000000000000n, // 60%
        800000000000000000n, // 80%
        owner.address
    );

    // Deploy the LendingPool
    const LendingPool = await hre.ethers.getContractFactory("LendingPool");
    const pool = await LendingPool.deploy(assetToken.target);
    await pool.setIRM(irm.target);

    // Set a high interest rate
    await irm.connect(owner).setParameters(
        10000000000000000n, // 1%
        500000000000000000n, // 50%
        100000000000000000n, // 10%
        1000000000000000n, // 0.1%
        600000000000000000n, // 60%
        800000000000000000n // 80%
    );
    await irm.connect(owner).setPool(pool.target);

    const DEPOSIT_AMOUNT = 1000;
    const COLLATERAL_AMOUNT = 200;
    const BORROW_AMOUNT = 50;

    // Lender deposits
    await assetToken.connect(owner).mint(lender.address, DEPOSIT_AMOUNT);
    await assetToken.connect(lender).approve(pool.target, DEPOSIT_AMOUNT);
    await pool.connect(lender).deposit(DEPOSIT_AMOUNT);

    // Borrower deposits collateral and borrows
    await assetToken.connect(owner).mint(borrower.address, COLLATERAL_AMOUNT);
    await assetToken.connect(borrower).approve(pool.target, COLLATERAL_AMOUNT);
    await pool.connect(borrower).deposit(COLLATERAL_AMOUNT);
    
    console.log("Borrower collateral:", COLLATERAL_AMOUNT);
    console.log("Max borrowable:", await pool.maxBorrowable(borrower.address));
    
    await pool.connect(borrower).borrow(BORROW_AMOUNT);
    
    console.log("Borrowed:", BORROW_AMOUNT);
    console.log("Debt before time:", (await pool.borrows(borrower.address)).principal);
    
    // Interest accrues
    await hre.ethers.provider.send("evm_increaseTime", [3600 * 24 * 365 * 10]); // 10 years
    await hre.ethers.provider.send("evm_mine");
    await pool.accrueInterest(borrower.address);
    
    const debtAfter = (await pool.borrows(borrower.address)).principal;
    console.log("Debt after 10 years:", debtAfter.toString());
    
    const borrowerShares = await pool.shares(borrower.address);
    console.log("Borrower shares:", borrowerShares.toString());
    
    const collateralValue = await pool.getAmountForShares(borrowerShares);
    console.log("Collateral value:", collateralValue.toString());
    
    const borrowLimit = (collateralValue * 666666666666666667n) / 1000000000000000000n;
    console.log("Borrow limit (66.67% of collateral):", borrowLimit.toString());
    
    console.log("Is position healthy?:", await pool.isHealthy(borrower.address));
    console.log("Should be unhealthy if debt > borrow limit");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
