const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  try {
    console.log("Starting deployment to Polygon Amoy Testnet...\n");

    // Get USDC address from environment
    const usdcAddress = process.env.USDC_ADDRESS;
    if (!usdcAddress) {
      throw new Error("USDC_ADDRESS not found in environment variables");
    }

    // Deploy PolicyRegistry
    console.log("Deploying PolicyRegistry...");
    const PolicyRegistry = await hre.ethers.getContractFactory("PolicyRegistry");
    const policyRegistry = await PolicyRegistry.deploy();
    await policyRegistry.waitForDeployment();
    const policyRegistryAddress = await policyRegistry.getAddress();
    console.log(`PolicyRegistry deployed to: ${policyRegistryAddress}`);

    // Deploy AgentVault
    console.log("\nDeploying AgentVault...");
    const AgentVault = await hre.ethers.getContractFactory("AgentVault");
    const agentVault = await AgentVault.deploy(usdcAddress, policyRegistryAddress);
    await agentVault.waitForDeployment();
    const agentVaultAddress = await agentVault.getAddress();
    console.log(`AgentVault deployed to: ${agentVaultAddress}`);

    // Print summary
    console.log("\n=== Deployment Summary ===");
    console.log(`PolicyRegistry deployed to: ${policyRegistryAddress}`);
    console.log(`AgentVault deployed to: ${agentVaultAddress}`);
    console.log(`USDC Token (Amoy Testnet): ${usdcAddress}`);
    console.log(`Network: Polygon Amoy Testnet`);

    // Save deployed addresses to JSON file
    const deploymentData = {
      network: "polygon-amoy",
      PolicyRegistry: policyRegistryAddress,
      AgentVault: agentVaultAddress,
      USDC: usdcAddress,
      deployedAt: new Date().toISOString()
    };

    const outputPath = path.join(__dirname, "..", "deployed-addresses.json");
    fs.writeFileSync(outputPath, JSON.stringify(deploymentData, null, 2));
    console.log(`\nDeployment addresses saved to: deployed-addresses.json`);

  } catch (error) {
    console.error("\n❌ Deployment failed:");
    console.error(error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
