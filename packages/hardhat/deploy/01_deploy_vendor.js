// deploy/01_deploy_vendor.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const yourToken = await ethers.getContract("YourToken", deployer);

  await deploy("Vendor", {
    from: deployer,
    args: [yourToken.address],
    log: true,
  });

  const vendor = await ethers.getContract("Vendor", deployer);

  console.log("\n 🏵  Sending all 1000 tokens to the vendor...\n");

  const transferTransaction = await yourToken.transfer(
    vendor.address,
    ethers.utils.parseEther("1000")
  );

  console.log("\n    ✅ confirming...\n");
  await sleep(5000); // wait 5 seconds for transaction to propagate

  console.log("\n 🤹  Sending ownership to frontend address...\n");
  const ownershipTransaction = await vendor.transferOwnership(
    "0x047821Dc2b13F680FeD9B006F0868bE43AcF4fe6"
  );
  console.log("\n    ✅ confirming...\n");
  const ownershipResult = await ownershipTransaction.wait();

  if (chainId !== "31337") {
    try {
      console.log(" 🎫 Verifing Contract on Etherscan... ");
      await sleep(5000); // wait 5 seconds for deployment to propagate
      await run("verify:verify", {
        address: vendor.address,
        contract: "contracts/Vendor.sol:Vendor",
        constructorArguments: [yourToken.address],
      });
    } catch (e) {
      console.log(" ⚠️ Failed to verify contract on Etherscan ");
    }
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports.tags = ["Vendor"];
