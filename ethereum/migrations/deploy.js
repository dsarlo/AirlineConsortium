const Provider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("../build/AirlineConsortium");

const provider = new Provider(
  "YOUR-METAMASK-SECRET-HERE (Ex: cargo jaguar float step gauge sister, etc)",
  "https://YOUR-INFURA-LINK-HERE"
);

const web3 = new Web3(provider);

(async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Deploying from account:", accounts[0]);

  const contract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: "0x" + bytecode
    })
    .send({ from: accounts[0], gas: 1000000 });
  console.log("Contract address:", contract.options.address);
})();