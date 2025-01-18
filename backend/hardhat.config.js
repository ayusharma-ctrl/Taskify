/**
 * @type import ('hardhat/config').HardhatUserConfig
 */

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const {API_URL, PRIVATE_KEY} = process.env;

module.exports = {
    networks: {
        polygon_amoy: {
            url: API_URL,
            accounts: [`0x${PRIVATE_KEY}`],
        },
    },
    solidity: "0.8.11",
};
