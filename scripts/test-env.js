require('dotenv').config();

console.log("🔐 Testing Environment Variables...");
console.log("==================================");

// Test Private Key
if (process.env.PRIVATE_KEY) {
  console.log("✅ Private Key Found!");
  console.log("   Length:", process.env.PRIVATE_KEY.length, "characters");
  console.log("   Starts with 0x:", process.env.PRIVATE_KEY.startsWith('0x'));
  console.log("   First 10 chars:", process.env.PRIVATE_KEY.substring(0, 10) + "...");
} else {
  console.log("❌ Private Key NOT FOUND!");
}

// Test RPC URL
if (process.env.POLYGON_RPC_URL) {
  console.log("✅ RPC URL Found!");
  console.log("   URL:", process.env.POLYGON_RPC_URL);
} else {
  console.log("❌ RPC URL NOT FOUND!");
}

console.log("==================================");
console.log("If you see ✅ above, your .env is working!");