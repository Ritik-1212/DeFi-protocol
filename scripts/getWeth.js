const { getNamedAccounts, ethers } = require("hardhat");

const AMOUNT = ethers.utils.parseEther("1");

async function getWeth() {
  const { deployer } = await getNamedAccounts();

  const IWeth = await ethers.getContractAt(
    "IWeth",
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    deployer
  );

  const ethDeposit = await IWeth.deposit({ value: AMOUNT });

  await ethDeposit.wait(1);

  const IWethAmount = await IWeth.balanceOf(deployer);
}

module.exports = { getWeth , AMOUNT};
