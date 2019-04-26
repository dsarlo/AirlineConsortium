import web3 from "./web3";

const ADDRESS = "0xa932d7CAe693e444aB35A96d81C137a2c0c1295A"; //Update with the address at which the contract was deployed!
const ABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "userBalances",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "airlineBalances",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "originalFlightAirlineAddr",
        "type": "address"
      },
      {
        "name": "flightToChangeToAddr",
        "type": "address"
      },
      {
        "name": "originalFlightCost",
        "type": "uint256"
      },
      {
        "name": "flightCost",
        "type": "uint256"
      }
    ],
    "name": "requestFlightChange",
    "outputs": [
      
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "userAddr",
        "type": "address"
      },
      {
        "name": "originalFlightAirlineAddr",
        "type": "address"
      },
      {
        "name": "flightToChangeToAddr",
        "type": "address"
      },
      {
        "name": "originalFlightCost",
        "type": "uint256"
      },
      {
        "name": "flightCost",
        "type": "uint256"
      }
    ],
    "name": "settlePayment",
    "outputs": [
      
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "userAddr",
        "type": "address"
      },
      {
        "name": "originalFlightAirlineAddr",
        "type": "address"
      },
      {
        "name": "flightToChangeToAddr",
        "type": "address"
      },
      {
        "name": "originalFlightCost",
        "type": "uint256"
      },
      {
        "name": "flightCost",
        "type": "uint256"
      }
    ],
    "name": "responseToFlightChange",
    "outputs": [
      
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "isAirline",
        "type": "bool"
      }
    ],
    "name": "register",
    "outputs": [
      
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "airlineAddr",
        "type": "address"
      },
      {
        "name": "flightCost",
        "type": "uint256"
      }
    ],
    "name": "bookFlight",
    "outputs": [
      
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "userToUnregister",
        "type": "address"
      },
      {
        "name": "isAirline",
        "type": "bool"
      }
    ],
    "name": "unregister",
    "outputs": [
      
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default new web3.eth.Contract(ABI, ADDRESS);