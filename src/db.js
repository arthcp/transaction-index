const dbDetails = require('../config.json').dbDetails;
const MongoClient = require('mongodb').MongoClient;

let database = null;
let connection = null;

const startDatabase = async () => {
    const url = `mongodb://${dbDetails.userName}:${dbDetails.password}@${dbDetails.address}:${dbDetails.port}/${dbDetails.authDB}`;
    connection = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    database = connection.db();
}

const getDatabase = async () => {
    if (!database) await startDatabase();
    return database;
}

const closeConnection = async () => {
    if (connection) {
        connection.close();
        connection = null;
        database = null;
    }
}

const findOne = async ({collectionName, queryDoc}) => {
    if (!collectionName || !queryDoc) {
        console.error(`Illegal db find request. collectionName ${collectionName} , queryDoc ${queryDoc}`);
        return null;
    }

    const db = await getDatabase();
    let result = await db.collection(collectionName).find(queryDoc);
    return (await result.hasNext()) ? (await result.next()) : null;
}

const insert = async ({collectionName, insertDoc}) => {
    if (!collectionName || !insertDoc) {
        console.error(`Illegal db insert request. collectionName ${collectionName} , insertDoc ${insertDoc}`);
        return null;
    }

    const database = await getDatabase();
    return await database.collection(collectionName).insertOne(insertDoc);
}

const updateOne = async ({collectionName, queryDoc, updateDoc}) => {
    if (!collectionName || !queryDoc || !updateDoc) {
        console.error(`Illegal db updateOne request. collectionName ${collectionName} , queryDoc ${queryDoc} , updateDoc ${updateDoc}`);
        return null;
    }

    const database = await getDatabase();
    return await database.collection(collectionName).updateOne(queryDoc, updateDoc);
}

module.exports = {
    findOne,
    insert,
    updateOne,
    closeConnection,
};