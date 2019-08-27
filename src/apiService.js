const {mongoOperations, collections} = require('./constants');
const db = require('./db');

const getUserTransactions = async ({userAddress}) => {
    if (!userAddress) {
        throw new Error("userAddress not provided");
    }
    console.log(`getting transactions for userAddress ${userAddress}`);

    const aggDoc = [
        {
            [mongoOperations.match]: {
                userAddress: userAddress
            }
        },
        {
            [mongoOperations.unwind]: "$transactionList"
        },
        {
            [mongoOperations.lookup]: {
                from : 'transactionDetails',
                localField: 'transactionList', 
                foreignField: 'transactionHash', 
                as : 'transactionArr'
            }
        },
        {
            [mongoOperations.project]: { 
                transaction: {
                    [mongoOperations.arrayElemAt]: ["$transactionArr", 0]
                },
                "_id": false
            }
        }
    ];
    const collectionName = collections.userTransactions;
    const resultDoc = await db.aggregate({collectionName, aggDoc});
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