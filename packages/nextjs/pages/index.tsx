import { useState } from "react";
import type { NextPage } from "next";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { ContractUI } from "~~/components/scaffold-eth";

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const Home: NextPage = () => {
  const [contractAddress, setContractAddress] = useState<string>("");
  const [contractAbi, setContractAbi] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getAbi = async () => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  return (
    <div className="w-full p-8 flex flex-col justify-center gap-4">
      <p className="self-center p-0 m-0 font-semibold">
        Warning: This feature is experimental. You may lose funds if you interact with contracts using this app.
      </p>
      <div className="flex w-1/2 self-center gap-4">
        <input
          type="text"
          placeholder="Contract Address"
          className="input input-md shadow-md w-full"
          value={contractAddress}
          onChange={e => setContractAddress(e.target.value)}
        />
        <button className="btn btn-md btn-primary" onClick={getAbi}>
          Decompile ABI (experimental)
        </button>
      </div>
      <div className="flex flex-1 w-full justify-center">
        {isLoading ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : contractAbi ? (
          <>
            <ContractUI deployedContractData={{ address: contractAddress, abi: JSON.parse(contractAbi) }} />
            <div className="w-1/2">
              {contractAbi && (
                <div className="h-full">
                  <h2>Decompiled ABI:</h2>
                  <textarea className="textarea w-full rounded-xl h-full" value={contractAbi} readOnly />
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Home;
