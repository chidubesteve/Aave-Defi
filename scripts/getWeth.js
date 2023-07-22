const { getNamedAccounts, ethers, network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");

const AMOUNT = ethers.utils.parseEther("0.02");

async function getWeth() {
  const { deployer } = await getNamedAccounts();
  // we need to call the "deposit" function on the weth contract and for that we'll need the abi and address
  const iWeth = await ethers.getContractAt(
    "IWeth",
    networkConfig[network.config.chainId].wethToken,
    deployer
  );
  const tx = await iWeth.deposit({ value: AMOUNT });
  await tx.wait(1);
  const wethBalance = await iWeth.balanceOf(deployer);
  console.log(`Got ${wethBalance.toString()} WETH`);
}

module.exports = { getWeth, AMOUNT };
