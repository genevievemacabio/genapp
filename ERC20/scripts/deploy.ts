import { ethers } from "hardhat";

async function main() {
  const lock = await ethers.deployContract("Gen", ["0xA646C53BaB17b9a905ce1f7f6B61427547A790Eb"]);

  await lock.waitForDeployment();

  console.log(
    `Token deployed to ${lock.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});