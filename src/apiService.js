const {mongoOperations, collections} = require('./constants');
const db = require('./db');

const getUserTransactions = async ({userAddress}) => {
    if (!userAddress) {
        throw new Error("userAddress not provided");
    }
    console.log(`getting transactions for userAddress ${userAddress}`);

    const aggDoc = [
        {
            // search for documents where userAddress matches
            [mongoOperations.match]: {
                userAddress: userAddress
            }
        },
        {
            // split transactionList array into seperate documents
            [mongoOperations.unwind]: "$transactionList"
        },
        {
            // get details from transactionDetails collection by matching transactionHash
            [mongoOperations.lookup]: {
                from : 'transactionDetails',
                localField: 'transactionList', 
                foreignField: 'transactionHash', 
                as : 'transactionArr'
            }
        },
        {
            // form transaction field by taking first element of transactionArr field and remove _id
            [mongoOperations.project]: { 
                transaction: {
                    [mongoOperations.arrayElemAt]: ["$transactionArr", 0]
                },
                "_id": false
            }
        }
    ];
    const collectionName = collections.userTransactions;
    // resultDoc is an array of documents. each document having details for one transaction
    const resultDoc = await db.aggregate({collectionName, aggDoc});
    // resultDoc is converted into an array of transaction details by removing document structure
    const transactionDetailsList = 
        resultDoc.reduce((arr, eachDoc) => {
            const {from, to, blockNumber, transactionHash} = eachDoc.transaction;
            return [...arr, {from, to, blockNumber, transactionHash}];
        }, []);
    
    return transactionDetailsList;
}

module.exports = {
    getUserTransactions,
}