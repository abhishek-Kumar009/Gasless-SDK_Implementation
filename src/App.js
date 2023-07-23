import React, { useEffect, useRef, useState } from "react";
import { GaspayManager } from "flint-gasless-sdk";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useNetwork } from "wagmi";
import GenerateSigCom from "./components/GenerateSigCom.jsx";

function App() {
  const [fromToken, setFromToken] = useState("");

  const [modal, setModal] = useState(false);

  const typesSig = useRef(null);
  const domainSig = useRef(null);
  const valueSig = useRef(null);

  const [functionSig, setFunctionSig] = useState("");

  const { address, isConnected, connector } = useAccount();
  const { chain, chains } = useNetwork();

  const signatureFromWallet = useRef("");

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const { disconnect } = useDisconnect();

  const gaspayManager = new GaspayManager("1238123-afasd");

  const onChangeFromToken = (e) => {
    console.log(e.target.value, "changed val");
    const { value } = e.target;

    setFromToken(value);
  };

  const generateSig = async () => {
    console.log("Generating sig");
    const { dataToSign, functionSignature } =
      await gaspayManager.generateApprovalSignature(
        address,
        fromToken,
        chain.network
      );
    setFunctionSig(functionSignature);
    const { types, domain, message } = dataToSign;
    console.log(
      JSON.stringify(types),
      JSON.stringify(domain),
      JSON.stringify(message),
      "data to sign destruct"
    );

    typesSig.current = types;
    domainSig.current = domain;
    valueSig.current = message;

    setModal(true);

    // setSig(JSON.stringify(dataToSign));
    console.log(dataToSign, "Data to sign@@@@");
    // await signMessage({ message: JSON.stringify(dataToSign) });
    console.log("Sugning finished...");
  };

  const sendApprovalSignature = async (dataFromProvider) => {
    console.log(
      dataFromProvider,
      functionSig,
      fromToken,
      address.toLowerCase(),
      chain.network,
      "Payload $$$$"
    );
    const txDetails = await gaspayManager.sendApprovalTransaction(
      dataFromProvider,
      functionSig,
      fromToken.toLowerCase(),
      address.toLowerCase(),
      chain.network
    );

    console.log(txDetails, "Transaction details...");
  };

  useEffect(() => {
    console.log(connector, "Connnector###");
    console.log(chain, "Chain");
    console.log(chains, "Chainsssss");
  }, [isConnected, chain]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderWidth: "1px",
        borderColor: "red",
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          marginTop: "20px",
        }}
      >
        <span>From token:</span>
        <div
          style={{
            width: "40px",
            height: "20px",
            borderRadius: "20px",
            marginLeft: "20px",
          }}
        >
          <input
            type="text"
            value={fromToken}
            onChange={onChangeFromToken}
            placeholder="From token..."
          />
        </div>
      </div>

      <div
        onClick={generateSig}
        style={{
          cursor: "pointer",
          width: "100px",
          height: "20px",
          borderRadius: "10px",
          padding: "10px",
          marginTop: "20px",
          backgroundColor: "green",
        }}
      >
        <span>Generate Sig</span>
      </div>

      {isConnected ? (
        <div
          style={{ display: "flex", flexDirection: "row", marginRight: "15px" }}
        >
          <span>
            Connected to: {address} on chainId: {chain?.network}
          </span>
          <div
            onClick={() => disconnect()}
            style={{
              cursor: "pointer",
              width: "100px",
              height: "20px",
              borderRadius: "10px",
              padding: "10px",
              marginTop: "20px",
              backgroundColor: "red",
            }}
          >
            <span>Disconnect wallet</span>
          </div>
        </div>
      ) : (
        <div
          onClick={() => connect()}
          style={{
            cursor: "pointer",
            width: "100px",
            height: "20px",
            borderRadius: "10px",
            padding: "10px",
            marginTop: "20px",
            backgroundColor: "yellow",
          }}
        >
          <span>Connect wallet</span>
        </div>
      )}

      {modal && (
        <div
          style={{
            position: "absolute",
            top: "200px",
            left: "400px",
            zIndex: 100,
          }}
        >
          <GenerateSigCom
            types={typesSig.current}
            domain={domainSig.current}
            value={valueSig.current}
            handleSignatureSigned={sendApprovalSignature}
          />
        </div>
      )}
    </div>
  );
}

export default App;
