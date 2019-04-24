const solc = require("solc");
const path = require("path");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "../build");
fs.removeSync(buildPath);

const contractPath = path.resolve(__dirname, "../contracts", "AirlineConsortium.sol");
const source = fs.readFileSync(contractPath, "utf8");
const output = solc.compile(source, 1).contracts[":AirlineConsortium"];

fs.ensureDirSync(buildPath);
fs.outputJsonSync(path.resolve(buildPath, "AirlineConsortium.json"), output);