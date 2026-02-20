const { ethers } = require("hardhat");
const deployed = require("../deployed-addresses.json");

async function main() {
  const registry = await ethers.getContractAt("PolicyRegistry", deployed.PolicyRegistry);
  const agentId = ethers.encodeBytes32String("weather_agent");
  const recipient = "0x61254AEcF84eEdb890f07dD29f7F3cd3b8Eb2CBe";
  
  console.log("Registering agent...");
  const tx1 = await registry.registerAgent(
    agentId,
    ethers.parseUnits("1", 6),
    ethers.parseUnits("5", 6),
    [recipient]
  );
  await tx1.wait();
  console.log("Agent registered:", tx1.hash);
}

main().catch(console.error);
