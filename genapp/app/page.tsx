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
      alert(`Staking failed: ${decodedError?.args}`);
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
      alert(`Withdrawal failed: ${decodedError?.args}`);
    }
  };

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
    <div className="animated-background flex flex-col h-screen">
      <h1 className="text-white text-4xl font-bold text-center animate-slide-in">Gen Token Minting and Staking Hub</h1>
      <div className="flex-grow-0 pt-6 pb-8 px-8 bg-gradient-to-r from-black to-pink-500">
        <p className="text-white text-lg text-center mt-2">Mint, Stake, and Have a Nice Day!</p>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center px-8 bg-gradient-to-b from-pink-300 to-pink-500">
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <button onClick={connectWallet} className="bg-blue-300 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">
            {walletKey !== "" ? "Wallet Connected" : "Connect Wallet"}
          </button>
          <button onClick={importToken} className="bg-blue-300 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">
            Import Token
          </button>
        </div>
        <div className="w-full max-w-xs mb-8">
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="minting-amount">
              Indicate Minting Amount
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="minting-amount" type="number" placeholder="0" onChange={(e) => mintAmountChange(e)}/>
          </div>
          <button onClick={mintCoin} className="bg-purple-300 hover:bg-purple-400 text-white font-bold py-2 px-4 rounded w-full">
            Mint Token
          </button>
        </div>
        <div className="w-full max-w-xs mb-8">
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="staking-amount">
              Indicate Staking Amount
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="staking-amount" type="number" placeholder="0" onChange={(e) => stakeAmountChange(e)}/>
          </div>
          <button onClick={stakeCoin} className="bg-purple-300 hover:bg-purple-400 text-white font-bold py-2 px-4 rounded w-full">
            Stake It
          </button>
        </div>
        <div className="w-full max-w-xs">
          <p className="text-white text-sm mb-2">Allow at least 1 minute before Withdrawing</p>
          <button onClick={withdrawCoin} className="bg-green-300 hover:bg-green-400 text-white font-bold py-2 px-4 rounded w-full">
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}
