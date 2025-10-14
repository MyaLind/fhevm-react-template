const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 Starting deployment of ConfidentialWeatherAggregator...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy the contract
  console.log("📦 Deploying ConfidentialWeatherAggregator...");
  const ConfidentialWeatherAggregator = await hre.ethers.getContractFactory("ConfidentialWeatherAggregator");
  const weatherAggregator = await ConfidentialWeatherAggregator.deploy();

  await weatherAggregator.waitForDeployment();
  const contractAddress = await weatherAggregator.getAddress();

  console.log("✅ ConfidentialWeatherAggregator deployed to:", contractAddress);
  console.log("👤 Contract owner:", await weatherAggregator.owner());

  // Display gateway configuration info
  console.log("\n" + "=".repeat(60));
  console.log("⚙️  GATEWAY CONFIGURATION NOTES");
  console.log("=".repeat(60));
  console.log("\n📌 New Gateway API Updates:");
  console.log("   • Transaction inputs are now re-randomized for sIND-CPAD security");
  console.log("   • Decryption responses are no longer aggregated on-chain");
  console.log("   • Each KMS sends individual events with encrypted shares");
  console.log("   • check...() functions replaced with is...() functions");

  console.log("\n🔧 Required Environment Variables:");
  console.log("   NUM_PAUSERS: Number of pauser addresses (n_kms + n_copro)");
  console.log("   PAUSER_ADDRESS_0, PAUSER_ADDRESS_1, ...: Individual pauser addresses");

  console.log("\n⚠️  Deprecated Variables:");
  console.log("   PAUSER_ADDRESS (single) - Use indexed PAUSER_ADDRESS_[0-N] instead");

  // Read pauser configuration from environment
  const NUM_PAUSERS = parseInt(process.env.NUM_PAUSERS || "0");

  if (NUM_PAUSERS > 0) {
    console.log("\n📋 Configured Pausers:");
    for (let i = 0; i < NUM_PAUSERS; i++) {
      const pauserAddress = process.env[`PAUSER_ADDRESS_${i}`];
      if (pauserAddress) {
        console.log(`   [${i}] ${pauserAddress}`);
      } else {
        console.log(`   [${i}] ⚠️  Not configured`);
      }
    }
  } else {
    console.log("\n⚠️  No pausers configured. Set NUM_PAUSERS and PAUSER_ADDRESS_[0-N] in .env");
  }

  console.log("\n" + "=".repeat(60));
  console.log("📄 Update your frontend with this contract address:");
  console.log("   CONTRACT_ADDRESS =", `"${contractAddress}"`);
  console.log("=".repeat(60) + "\n");

  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    network: hre.network.name,
    gatewayVersion: "new-api-migrated",
    notes: {
      transactionReRandomization: "enabled",
      decryptionResponseAggregation: "disabled-uses-events",
      checkFunctionsReplaced: "is-functions",
      kmsManagementRenamed: "kmsGeneration"
    }
  };

  console.log("\n💾 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  console.log("\n✨ Deployment completed successfully!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
