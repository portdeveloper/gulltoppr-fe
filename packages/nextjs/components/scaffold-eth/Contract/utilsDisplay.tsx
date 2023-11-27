import { ReactElement } from "react";
import { Hex, formatEther, hexToBigInt, hexToBool, hexToString } from "viem";
import { replacer } from "~~/utils/scaffold-eth/common";

type DisplayContent = string | number | bigint | Record<string, any> | undefined | unknown;

export const displayTxResult = (
  displayContent: DisplayContent | DisplayContent[],
  asText = false,
): ReactElement | string => {
  if (displayContent == null) {
    return "";
  }

  if (typeof displayContent === "bigint") {
    const interpretations = [];
    interpretations.push(`BigInt: ${displayContent.toString()}`);
    interpretations.push(`Formatted Ether: Ξ${formatEther(displayContent)}`);
    return (
      <>
        {interpretations.map((interpretation, index) => (
          <div key={index}>{interpretation}</div>
        ))}
      </>
    );
  }

  if (typeof displayContent === "string" && /^0x[0-9a-fA-F]+$/.test(displayContent)) {
    const interpretations = [];

    interpretations.push(`NumberString: ${Number(displayContent)}`);

    interpretations.push(`Boolean: ${displayContent ? "true" : "false"}`);

    interpretations.push(`Address: ${displayContent}`);

    interpretations.push(`BigInt: ${BigInt(displayContent).toString()}`);

    interpretations.push(`Formatted Ether: Ξ${formatEther(BigInt(displayContent))}`);

    interpretations.push(`String: ${hexToString(displayContent as Hex)}`);

    return (
      <>
        {interpretations.map((interpretation, index) => (
          <div key={index}>{interpretation}</div>
        ))}
      </>
    );
  }

  return JSON.stringify(displayContent, replacer, 2);
};
