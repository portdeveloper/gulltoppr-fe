import { useEffect, useState } from "react";
import { InheritanceTooltip } from "./InheritanceTooltip";
import { Abi, AbiFunction } from "abitype";
import { Address } from "viem";
import { useContractRead } from "wagmi";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { displayTxResult } from "~~/components/scaffold-eth";
import { useAnimationConfig } from "~~/hooks/scaffold-eth";

type DisplayVariableProps = {
  contractAddress: Address;
  abiFunction: AbiFunction;
  refreshDisplayVariables: boolean;
  inheritedFrom?: string;
};

export const DisplayVariable = ({
  contractAddress,
  abiFunction,
  refreshDisplayVariables,
  inheritedFrom,
}: DisplayVariableProps) => {
  const [modifiedAbiFunction, setModifiedAbiFunction] = useState(abiFunction);

  const tryDifferentReturnTypes = (error: Error, currentAbiFunction: any) => {
    console.log("Trying different return types due to error:", error);

    // Define a list of potential return types to try
    const potentialReturnTypes = ["string", "uint256", "bytes32", "bool", "address"];

    // Find the current return type index
    const currentTypeIndex = potentialReturnTypes.indexOf(currentAbiFunction.outputs[0].type);

    // Try the next return type in the list
    if (currentTypeIndex < potentialReturnTypes.length - 1) {
      const nextType = potentialReturnTypes[currentTypeIndex + 1];
      const updatedAbiFunction = { ...currentAbiFunction };
      updatedAbiFunction.outputs = [{ ...updatedAbiFunction.outputs[0], type: nextType }];
      setModifiedAbiFunction(updatedAbiFunction);
      console.log(`Updated return type to: ${nextType}`);
    } else {
      console.log("Tried all return types, unable to resolve the correct type.");
    }
  };

  const {
    data: result,
    isFetching,
    refetch,
  } = useContractRead({
    address: contractAddress,
    functionName: modifiedAbiFunction.name,
    abi: [modifiedAbiFunction] as Abi,
    onError: error => {
      tryDifferentReturnTypes(error, modifiedAbiFunction);
    },
  });

  const { showAnimation } = useAnimationConfig(result);

  useEffect(() => {
    refetch();
  }, [refetch, refreshDisplayVariables, modifiedAbiFunction]);

  return (
    <div className="space-y-1 pb-2">
      <div className="flex items-center">
        <h3 className="font-medium text-lg mb-0 break-all">{abiFunction.name}</h3>
        <button className="btn btn-ghost btn-xs" onClick={async () => await refetch()}>
          {isFetching ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <ArrowPathIcon className="h-3 w-3 cursor-pointer" aria-hidden="true" />
          )}
        </button>
        <InheritanceTooltip inheritedFrom={inheritedFrom} />
      </div>
      <div className="text-gray-500 font-medium flex flex-col items-start">
        <div>
          <div
            className={`break-all block transition bg-transparent ${
              showAnimation ? "bg-warning rounded-sm animate-pulse-fast" : ""
            }`}
          >
            {displayTxResult(result)}
          </div>
        </div>
      </div>
    </div>
  );
};
