"use client";
import { BrowserProvider } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getContract } from "../config";

export default function Home() {
  const [walletKey, setwalletKey] = useState("");
  const [currentData, setcurrentData] = useState("");

  const connectWallet = async () => {
    const { ethereum } = window as any;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    setwalletKey(accounts[0]);
  };
  //<Minting>
  const [mintingAmount, setMintingAmount] = useState<number>();
  const [submitted, setSubmitted] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  
  const mintCoin = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const tx = await contract.mint(signer, mintingAmount);
      await tx.wait();
      setSubmitted(true);
      setTransactionHash(tx.hash);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Minting failed: ${decodedError?.args}`);
    }
  };
  const mintAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!isNaN(Number(inputValue))) {
      setMintingAmount(Number(inputValue));
      console.log(inputValue);
    } else {
      setMintingAmount(0);
    }
  };
  //</Minting>

  //<Staking>
  const [stakingAmount, setStakingAmount] = useState<number>();
  const stakeCoin = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const tx = await contract.stake(stakingAmount);
      await tx.wait();
      setSubmitted(true);
      setTransactionHash(tx.hash);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Minting failed: ${decodedError?.args}`);
    }
  };
  const stakeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!isNaN(Number(inputValue))) {
      setStakingAmount(Number(inputValue));
      console.log(inputValue);
    } else {
      setStakingAmount(0);
    }
  };
  //</Staking>
 
  //<Withdraw>
  const withdrawCoin = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const tx = await contract.withdraw();
      await tx.wait();
      setSubmitted(true);
      setTransactionHash(tx.hash);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Minting failed: ${decodedError?.args}`);
    }
  };
  //</Withdraw>
  //<Import Token>
  const importToken = async() => {
    const {ethereum} = window as any;
    const tokenAddress = "0xA646C53BaB17b9a905ce1f7f6B61427547A790Eb"; //contract add
    const tokenSymbol = "Gen";
    const tokenDecimal = 18;

    try{
      const wasAdded = await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimal,
          },
        },
      });
    }
    catch(error){
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="text-white bg-gradient-to-r from-black to-pink-500 p-6">
        <h1 className="text-4xl text-center font-bold">Gen Token Minting and Staking Hub</h1>
        <p className="text-xl text-center mt-4">Mint, Stake, and Have a Nice Day!</p>
      </header>
      
      <main className="flex-1 overflow-y-auto">
        <section className="flex items-center justify-between p-10">
          <div className="flex flex-col items-center space-y-4">
            <button onClick={connectWallet} className="bg-pink-500 text-white px-4 py-2 rounded">
              {walletKey !== "" ? walletKey : "Connect Wallet"}
            </button>
            <button onClick={importToken} className="bg-pink-500 text-white px-4 py-2 rounded">
              Import Token
            </button>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div>
              <label className="block mb-2 text-white">Indicate Minting Amount</label>
              <input
                type="number"
                value={mintingAmount}
                onChange={mintAmountChange}
                className="mb-4 px-3 py-2 rounded"
              />
              <button onClick={mintCoin} className="bg-pink-500 text-white px-4 py-2 rounded">
                Mint Token
              </button>
            </div>

            <div>
              <label className="block mb-2 text-white">Indicate Staking Amount</label>
              <input
                type="number"
                value={stakingAmount}
                onChange={stakeAmountChange}
                className="mb-4 px-3 py-2 rounded"
              />
              <button onClick={stakeCoin} className="bg-pink-500 text-white px-4 py-2 rounded">
                Stake It
              </button>
            </div>

            <div className="mt-6">
              <p className="text-white mb-4">Allow at least 1 minute before Withdrawing</p>
              <button onClick={withdrawCoin} className="bg-pink-500 text-white px-4 py-2 rounded">
                Withdraw
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}