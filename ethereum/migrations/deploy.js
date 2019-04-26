const Provider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("../build/AirlineConsortium");

const provider = new Provider(
  "cargo jaguar float step gauge sister marine car wire barrel leopard pencil",
  "https://rinkeby.infura.io/v3/48f1c230054a498d84299c6c3db213fd"
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