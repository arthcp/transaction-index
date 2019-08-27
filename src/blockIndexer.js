const config = require('../config.json');
const service = require('./blockIndexerService');

const db = require('./db');

const indexBlocks = async () => {
    // TODO: clear or merge old index
    const latestBlock = await service.getLatestBlock();
    for (let transaction of latestBlock.transactions) {
        try {
            await service.indexTransaction({transaction});
        } catch (e) {
            console.error(e);
        }
    }
    
    const start = latestBlock.number - 1;
    const end = latestBlock.number - config.blockIndexlimit;
    for (let blockNumber = start; blockNumber >= end; blockNumber--) {
        // TODO: address memory leak warning
        const transactions = await service.getTransactionsFromBlock({blockNumber});
        for (let transaction of transactions) {
            try {
                await service.indexTransaction({transaction});
            } catch (e) {
                console.error(e);
            }
        };
        console.count("block count");
    }

    await db.closeConnection();
    // TODO: exit program properly
}


indexBlocks().then(() => {
    console.log("Indexing completed");
}).catch((e) => {
    console.error("Fatal error");
    console.error(e);
});
