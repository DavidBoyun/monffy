import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

const privateKey = generatePrivateKey();
const account = privateKeyToAccount(privateKey);

const masked = `${privateKey.slice(0, 10)}...${privateKey.slice(-6)}`;

console.log("=== MONFFY Claw Agent Wallet ===");
console.log(`Address:     ${account.address}`);
console.log(`Private Key: ${masked}`);
console.log("");
console.log("Full key written to stdout below (copy to .env):");
console.log(`AGENT_PRIVATE_KEY=${privateKey}`);
console.log("");
console.log("WARNING: Keep this key secure. Never commit to git.");
