const { getNamedAccounts,ethers, network } = require("hardhat");
const { getWeth, AMOUNT } = require("../scripts/getWeth");
const { networkConfig } = require("../helper-hardhat-config");


async function main() {

  // this is for depositing collateral
  await getWeth();

  const { deployer } = await getNamedAccounts();
  // lendingPoolProvider => 0xb53c1a33016b2dc2ff3653530bff1848a515c8c5
  const lendingPool = await getLendingPool(deployer);
  console.log(`Lending Pool address: ${lendingPool.address}`);

    // depositing
  const wethTokenAddress = networkConfig[network.config.chainId].wethToken;
  // Approving
  await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, deployer)
  console.log("Depositing...")
  await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0)
  console.log("Deposited")

  let { availableBorrowsETH, totalDebtETH} = await getBorrowUserData(lendingPool, deployer)

  const daiPrice = await getDaiPrice()

  // converting the amount that we can borrow in eth to dia
  const amountDaiToBorrow  = availableBorrowsETH.toString() * 0.95 * (1 / daiPrice.toNumber())
  console.log(`you can borrow ${amountDaiToBorrow} DAI`)
  const amountDaiToBorrowInWei = ethers.utils.parseEther(amountDaiToBorrow.toString())
  // Borrowing from AAVE
  // we want to know how much we have borrowed, how much is in collateral, how much we can borrow

  await borrowDai(
    networkConfig[network.config.chainId].daiToken,
    lendingPool,
    amountDaiToBorrowInWei,
    deployer
  )
  await getBorrowUserData(lendingPool, deployer)

  await repay(amountDaiToBorrowInWei, networkConfig[network.config.chainId].daiToken, lendingPool, deployer)
  await getBorrowUserData(lendingPool, deployer)
}


  async function repay(amount, daiAddress, lendingPool, account) {
    await approveErc20(daiAddress, lendingPool.address, amount, account)
    const repayTx = await lendingPool.repay(daiAddress, amount, 1, account)
    await repayTx.wait(1)
    console.log("Repaid!")
  }

  async function borrowDai(
    daiAddress,
    lendingPool,
    amountDaiToBorrow,
    account

  ) {
    const borrowTx = await lendingPool.borrow(
      daiAddress,
      amountDaiToBorrow,
      1,
      0,
      account
    )
    await borrowTx.wait(1)
    console.log("You've borrowed")
  }
// we need to know the conversion rate of Dia, that is the amount of dia our disposable eth can buy
async function getDaiPrice() {
  const daiEthPriceFeed = await ethers.getContractAt("AggregatorV3Interface",
  networkConfig[network.config.chainId].daiEthPriceFeed)
  const price = (await daiEthPriceFeed.latestRoundData())[1]
  console.log(`The DAI/ETH price is ${price.toString()}`)
  return price
}

async function getBorrowUserData(lendingPool, account) {
  const { totalCollateralETH, totalDebtETH, availableBorrowsETH} = await lendingPool.getUserAccountData(account)

  console.log(`You have ${totalCollateralETH} worth of ETH deposited`)
  console.log(`You have ${totalDebtETH} worth of ETH borrowed.`)
  console.log(`You can borrow ${availableBorrowsETH} worth of ETH`)
  return { availableBorrowsETH, totalDebtETH}
  }

async function getLendingPool(account) {
  const lendingPoolAddressesProvider = await ethers.getContractAt(
    "ILendingPoolAddressesProvider",
    "0xb53c1a33016b2dc2ff3653530bff1848a515c8c5",
    account
  );
  const lendingPoolAddress = 
    await lendingPoolAddressesProvider.getLendingPool();
  const lendingPool = await ethers.getContractAt(
    "ILendingPool",
    lendingPoolAddress,
    account
  );
  return lendingPool;
}

async function approveErc20(
  erc20Address,
  spenderAddress,
  amountToSpend,
  account
) {
  const erc20Token = await ethers.getContractAt(
    "IERC20",
    erc20Address,
    account
  );
  const tx = await erc20Token.approve(spenderAddress, amountToSpend)
  await tx.wait(1)
  console.log("Approved!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })