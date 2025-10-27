// Check contract owner on Sepolia
const { ethers } = require("hardhat");

async function main() {
    const contractAddress = "0x291B77969Bb18710609C35d263adCb0848a3f82F";

    // Get contract instance
    const contract = await ethers.getContractAt(
        "ConfidentialWeatherAggregator",
        contractAddress
    );

    console.log("\n📝 Checking Contract Owner...\n");
    console.log("Contract Address:", contractAddress);

    try {
        const owner = await contract.owner();
        console.log("Owner Address:", owner);

        const timeWindowEnabled = await contract.timeWindowEnabled();
        console.log("Time Window Enabled:", timeWindowEnabled);

        const stationCount = await contract.stationCount();
        console.log("Station Count:", stationCount.toString());

        console.log("\n✅ Contract info retrieved successfully\n");
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
