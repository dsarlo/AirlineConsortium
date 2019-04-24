const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../build/AirlineConsortium");

let accounts, contract;
const INITIAL_SUPPLY = 100;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  contract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: [INITIAL_SUPPLY]
    })
    .send({ from: accounts[0], gas: 1000000 });
});

describe("AirlineConsortium", () => {
  it("deploys a contract", () => {
    assert.ok(contract.options.address);
  });

  it("has initial supply", async () => {
    const supply = await contract.methods.balanceOf(accounts[0]).call();
    assert.equal(supply, INITIAL_SUPPLY);
  });

  it("can transfer tokens", async () => {
    const TOKENS = 10;
    const txHash = await contract.methods
      .transfer(accounts[1], TOKENS)
      .send({ from: accounts[0] });

    const fromBalance = await contract.methods.balanceOf(accounts[0]).call();
    const toBalance = await contract.methods.balanceOf(accounts[1]).call();

    assert.equal(fromBalance, INITIAL_SUPPLY - TOKENS);
    assert.equal(toBalance, TOKENS);
  });

  it("requires sufficient balance", async () => {
    try {
      await contract.methods.transfer(accounts[0], 10).send({ from: accounts[1] });
      assert.fail();
    } catch (error) {
      assert.ok(error);
    }
  });
});