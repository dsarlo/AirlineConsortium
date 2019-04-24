import web3 from "./web3";

const ADDRESS = "0x2faE80ed1d9d7853C071Cf76633824f84E822414"; //Update with the address at which the contract was deployed!
const ABI = [
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "transfer",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "initialSupply", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  }
];

export default new web3.eth.Contract(ABI, ADDRESS);