import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "../utils/constants";

export const TransactionContext = createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractAbi,
    signer
  );

  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });

  const checkIfNetworkRopsten = async () => {
    if (!window.ethereum) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const networkName = await provider.getNetwork();
    console.log(networkName);
    if (networkName.name !== "ropsten") setIsWrongNetwork(true);
  };

  const switchToRopsten = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x3" }],
      });

      setIsWrongNetwork(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e, name) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: e.target.value,
    }));
  };

  const getAllTransactions = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask!");

      const transactionContract = getEthereumContract();
      const availableTransactions =
        await transactionContract.getAllTransactions();

      const structuredTransactions = availableTransactions.map(
        (transaction) => ({
          addressTo: transaction.reciever,
          addressFrom: transaction.sender,
          timestamp: new Date(
            transaction.timestamp.toNumber() * 1000
          ).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / 10 ** 18,
        })
      );

      setTransactions(structuredTransactions);
    } catch (err) {
      console.error(err);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask!");

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
      } else {
        console.log("No accounts found!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkIfTransactionsExits = async () => {
    try {
      const transactionContract = getEthereumContract();
      const transactionCount = await transactionContract.getTransactionCount();

      window.localStorage.setItem("transactionCount", transactionCount);
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask!");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.error(err);
      throw new Error("No ethereum object!");
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask!");

      const { addressTo, amount, keyword, message } = formData;

      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", // 21000 GWEI
            value: parsedAmount._hex,
          },
        ],
      });

      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );

      setIsLoading(true);

      await transactionHash.wait();

      setIsLoading(false);

      const transactionCount = await transactionContract.getTransactionCount();

      setTransactionCount(transactionCount.toNumber());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkIfNetworkRopsten();
  }, [isWrongNetwork]);

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExits();
  }, [transactions]);

  return (
    <TransactionContext.Provider
      value={{
        handleChange,
        connectWallet,
        setFormData,
        sendTransaction,
        switchToRopsten,
        isWrongNetwork,
        isLoading,
        currentAccount,
        formData,
        transactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
