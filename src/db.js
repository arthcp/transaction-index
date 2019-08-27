const dbDetails = require('../config.json').dbDetails;
const MongoClient = require('mongodb').MongoClient;

let database = null;
let connection = null;

const startDatabase = async () => {
    const url = `mongodb://${dbDetails.userName}:${dbDetails.password}@${dbDetails.address}:${dbDetails.port}/${dbDetails.authDB}`;
    try {
        connection = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
        database = connection.db();
    } catch (e) {
        throw new Error(e);
    }
}

// database variable is accessed through getter so that connection can be started in case it doesnt exist
const getDatabase = async () => {
    if (!database) await startDatabase();
    return database;
}

const closeConnection = async () => {
    if (connection) {
        try {
            connection.close();
        } catch (e) {
            throw new Error(e);
        }
        connection = null;
        database = null;
    }
}

const findOne = async ({collectionName, queryDoc}) => {
    if (!collectionName || !queryDoc) {
        console.error(`Illegal db findOne request. collectionName ${collectionName} , queryDoc ${queryDoc}`);
        return null;
    }

    const db = await getDatabase();
    try {
        let result = await db.collection(collectionName).find(queryDoc).toArray();
        return result[0] || null;
    } catch (e) {
        throw new Error(e);
    }
}

const findAll = async ({collectionName, queryDoc}) => {
    if (!collectionName || !queryDoc) {
        console.error(`Illegal db findAll request. collectionName ${collectionName} , queryDoc ${queryDoc}`);
        return null;
    }

    const db = await getDatabase();
    try {
        return await db.collection(collectionName).find(queryDoc).toArray();
    } catch (e) {
        throw new Error(e);
    }
}

const insert = async ({collectionName, insertDoc}) => {
    if (!collectionName || !insertDoc) {
        console.error(`Illegal db insert request. collectionName ${collectionName} , insertDoc ${insertDoc}`);
        return null;
    }

    const database = await getDatabase();
    try {
        return await database.collection(collectionName).insertOne(insertDoc);
    } catch (e) {
        throw new Error(e);
    }
}

const updateOne = async ({collectionName, queryDoc, updateDoc, upsert}) => {
    if (!collectionName || !queryDoc || !updateDoc) {
        console.error(`Illegal db updateOne request. collectionName ${collectionName} , queryDoc ${queryDoc} , updateDoc ${updateDoc}`);
        return null;
    }

    const database = await getDatabase();
    try {
        return await database.collection(collectionName).updateOne(queryDoc, updateDoc, {upsert: upsert || false});
    } catch (e) {
        throw new Error(e);
    }
}

const aggregate = async ({collectionName, aggDoc}) => {
    if (!collectionName || !aggDoc) {
        console.error(`Illegal db insert request. collectionName ${collectionName} , aggDoc ${aggDoc}`);
        return null;
    }
    
    const database = await getDatabase();
    try {
        return await database.collection(collectionName).aggregate(aggDoc).toArray();
    } catch (e) {
        throw new Error(e);
    }
}

const drop = async ({collectionName}) => {
    if (!collectionName) {
        console.error("No collectionName for remove");
        return null;
    }

    const database = await getDatabase();
    try {
        await database.collection(collectionName).drop();
    } catch (e) {
        console.error(`Error while dropping collection. ${collectionName}. Probably the collection doesn't yet exist`);
    }
}

module.exports = {
    findOne,
    findAll,
    insert,
    updateOne,
    closeConnection,
    aggregate,
    drop,
};