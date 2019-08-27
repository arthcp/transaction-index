const config = require('../config.json');
const {mongoOperations, collections} = require('./constants');
const db = require('./db');

const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(config.nodeAddress);
const web3 = new Web3(provider);

const getLatestBlock = async () => {
    try {
        return await web3.eth.getBlock("latest", true);
    } catch (e) {
        throw new Error(e);
    }
}

const getTransactionsFromBlock = async ({blockNumber}) => {
    if (!blockNumber) {
        throw new Error("blockNumber not provided");
    }
    console.log(`getting transactions for blockNumber ${blockNumber}`)
    try {
        const blockData = await web3.eth.getBlock(blockNumber, true);
        return blockData.transactions;
    } catch (e) {
        throw new Error(e);
    }
}

const indexTransaction = async ({transaction}) => {
    if (!transaction || !transaction.from || !transaction.to || !transaction.blockNumber || !transaction.hash) {
        throw new Error("Incomplete transaction details " + JSON.stringify(transaction));
    }
    console.log(`indexing transaction ${transaction.hash}`)

    const promise1 = insertTransactionDetails({transaction});
    const promise2 = insertUserTransaction({
        userAddress: transaction.from, 
        transactionHash: transaction.hash
    });
    const promise3 = insertUserTransaction({
        userAddress: transaction.to, 
        transactionHash: transaction.hash
    });
    await Promise.all([promise1, promise2, promise3]);
}

const insertTransactionDetails = async ({transaction}) => {
    const insertDoc = {
        from: transaction.from,
        to: transaction.to,
        blockNumber: transaction.blockNumber,
        transactionHash: transaction.hash,
    };

    const collectionName = collections.transactionDetails;
    await db.insert({collectionName, insertDoc});
}

const insertUserTransaction = async ({userAddress, transactionHash}) => {
    const queryDoc = {userAddress};
    const updateDoc = {
        [mongoOperations.addToSet]: {
            transactionList: transactionHash
        }
    };

    const collectionName = collections.userTransactions;
    await db.updateOne({collectionName, queryDoc, updateDoc, upsert: true});
}

module.exports = {
    getLatestBlock,
    getTransactionsFromBlock,
    indexTransaction,
}