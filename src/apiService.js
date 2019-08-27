const {mongoOperations, collections} = require('./constants');
const db = require('./db');

const getUserTransactions = async ({userAddress}) => {
    if (!userAddress) {
        throw new Error("userAddress not provided");
    }
    console.log(`getting transactions for userAddress ${userAddress}`);

    const transactionHashList = await getTransactionHashList({userAddress});
    const transactionDetailsList = await getTransactionDetailsList({transactionList: transactionHashList});
    return transactionDetailsList;
}

const getTransactionHashList = async({userAddress}) => {
    const queryDoc = {userAddress};
    const collectionName = collections.userTransactions;

    return (await db.findOne({collectionName, queryDoc})).transactionList || [];
}

const getTransactionDetailsList = async({transactionList}) => {
    const queryDoc = {
        transactionHash: {
            [mongoOperations.in]: transactionList
        }
    }
    const collectionName = collections.transactionDetails;

    return (await db.findAll({collectionName, queryDoc})) || [];
}

module.exports = {
    getUserTransactions,
}