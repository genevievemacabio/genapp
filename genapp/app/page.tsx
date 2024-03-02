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
    const tokenAddress = "0x7d3D5d34e95AD272214d1047DC0fd2e0fFC02D09"; //contract add
    const tokenSymbol = "GN";
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
    <main style={{ background: 'linear-gradient(135deg, #a855f7, #f472b6)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', fontFamily: '"Comic Neue", cursive' }}>
      <header style={{ textAlign: 'center', marginTop: '20px' }}>
        <h1 style={{ color: '#ffffff', fontSize: '48px', fontWeight: 'bold', fontFamily: '"Permanent Marker", cursive',animation: 'changeColor 5s infinite' }}>
          Gen Token Minting and Staking Hub
        </h1>
        <p style={{ color: '#ffffff', fontSize: '20px', fontFamily: '"Roboto", sans-serif' }}>
          Mint, Stake, and Have a Nice Day!
        </p>
      </header>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
        {/* Minting input and button */}
        <div>
          {/* Input for minting amount */}
          <label style={{ color: '#ffffff' }}>Input Amount To Mint</label>
          <br />
          <input
            type="number"
            value={mintingAmount}
            onChange={(e) => mintAmountChange(e)}
            style={{ marginRight: '10px' }}
          />
          {/* Button to mint tokens */}
          <button
            onClick={() => { mintCoin(); }}
            style={{ padding: '10px', backgroundColor: '#4ade80', color: '#000000', borderRadius: '5px', cursor: 'pointer' }}>
            Mint Token
          </button>
        </div>

        {/* Staking input and button */}
        <div>
          {/* Input for staking amount */}
          <label style={{ color: '#ffffff' }}>Input Amount To Stake</label>
          <br />
          <input
            type="number"
            value={stakingAmount}
            onChange={(e) => stakeAmountChange(e)}
            style={{ marginRight: '10px' }}
          />
          {/* Button to stake tokens */}
          <button
            onClick={stakeCoin}
            style={{ padding: '10px', backgroundColor: '#4ade80', color: '#000000', borderRadius: '5px', cursor: 'pointer' }}>
            Stake It
          </button>
        </div>
      </div>

      <footer style={{ textAlign: 'center', marginBottom: '20px' }}>
        <label style={{ color: '#ffffff', fontSize: '18px', fontFamily: '"Roboto", sans-serif' }}>
          Wait for At least 1 min before Withdrawing
        </label>
        <br />
        <button
          onClick={withdrawCoin}
          style={{ padding: '10px', backgroundColor: '#fb7185', color: '#ffffff', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
          Withdraw
        </button>
      </footer>
      </main>

  );
}