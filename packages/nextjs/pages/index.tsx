import { useState } from "react";
import type { NextPage } from "next";
import { ContractUI } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const [contractAddress, setContractAddress] = useState<string>("");
  const [contractAbi, setContractAbi] = useState<string>("");

  const getAbi = async () => {
    try {
      const response = await fetch(`http://localhost:8080/generate-abi/${contractAddress}`);
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const abi = await response.json();
      setContractAbi(JSON.stringify(abi, null, 2));
    } catch (error) {
      console.error("Error fetching ABI:", error);
      setContractAbi("Failed to retrieve ABI.");
    }
  };

  return (
    <div className="w-full p-4 flex flex-col justify-center items-center gap-4">
      <p>Enter a contract address to get its ABI</p>
      <input
        type="text"
        placeholder="Contract Address"
        className="input input-md shadow-md w-1/2"
        value={contractAddress}
        onChange={e => setContractAddress(e.target.value)}
      />
      <button className="btn btn-md btn-primary" onClick={getAbi}>
        Get ABI (experimental)
      </button>
      {contractAbi && <textarea className="textarea w-1/2 rounded-none" value={contractAbi} readOnly />}
      {contractAbi && <ContractUI deployedContractData={{ address: contractAddress, abi: JSON.parse(contractAbi) }} />}
    </div>
  );
};

export default Home;
