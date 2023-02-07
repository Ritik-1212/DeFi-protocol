const { getWeth, AMOUNT } = require("./getWeth");
const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  await getWeth();

  const { deployer } = await getNamedAccounts();

  const LendingPool = await getLendingPool(deployer);

  const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  await approveErc20(wethAddress, LendingPool.address, AMOUNT, deployer);

  await LendingPool.deposit(wethAddress, AMOUNT, deployer, 0);

  let { totalDebtEth, availableBorrowsETH } = await getUserData(
    LendingPool,
    deployer
  );
  const daiPrice = await getDaiValue();
  const amountDaiToBorrow =
    availableBorrowsETH.toString() * 0.95 * (1 / daiPrice.toNumber());
  const amountDaiToBorrowWei = ethers.utils.parseEther(
    amountDaiToBorrow.toString()
  );
  console.log(`You can borrow ${amountDaiToBorrow.toString()} DAI`);
  await borrowDai(
    "0x6b175474e89094c44da98b954eedeac495271d0f",
    LendingPool,
    amountDaiToBorrowWei,
    deployer
  );
  await getBorrowUserData(LendingPool, deployer);
  await repay(
    amountDaiToBorrowWei,
    "0x6b175474e89094c44da98b954eedeac495271d0f",
    LendingPool,
    deployer
  );
  await getBorrowUserData(LendingPool, deployer);
}

async function getDaiValue() {
  const DaiToEth = await ethers.getContractAt(
    "AggregatorV3Interface",
    "0x773616E4d11A78F511299002da57A0a94577F1f4"
  );

  const price = (await DaiToEth.latestRoundData())[1];
  return price;
}

async function approveErc20(erc20address, spenderAddress, Amount, account) {
  const approveErc20 = await ethers.getContractAt(
    "IERC20",
    erc20address,
    account
  );

  const tx = await approveErc20.approve(spenderAddress, Amount);

  await tx.wait(1);
}

async function borrowDai(
  daiAddress,
  lendingPool,
  amountDaiToBorrowWei,
  account
) {
  const borrowTx = await lendingPool.borrow(
    daiAddress,
    amountDaiToBorrow,
    1,
    0,
    account
  );
  await borrowTx.wait(1);
}

async function repay(daiAddress, lendingPool, amountDaiToBorrowWei, account) {
  await approveErc20(
    daiAddress,
    lendingPool.address,
    amountDaiToBorrowWei,
    account
  );
  const repay = await lendingPool.repay(
    daiAddress,
    amountDaiToBorrow,
    1,
    0,
    account
  );
  await repay.wait(1);
}

async function getLendingPool(account) {
  const ILendingPoolAddressesProvider = await ethers.getContractAt(
    "ILendingPoolAddressesProvider",
    "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
    account
  );

  const ILendingPoolAddress =
    await ILendingPoolAddressesProvider.getLendingPool();

  const ILendingPool = await ethers.getContractAt(
    "ILendingPool",
    ILendingPoolAddress,
    account
  );
  return ILendingPool;
}

async function getUserData(lendingPool, account) {
  const { totalCollateralETH, totalDebtEth, availableBorrowsETH } =
    await lendingPool.getUserAccountData(account);

  console.log(totalCollateralETH);
  console.log(totalDebtEth);
  console.log(availableBorrowsETH);
  return { totalDebtEth, availableBorrowsETH };
}

main()
  .then(process.exit(0))
  .catch((error) => {
    process.exit(1);
    console.error(error);
  });
