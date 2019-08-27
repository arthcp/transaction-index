module.exports = {
    mongoOperations: {
        set: "$set",
        addToSet: "$addToSet",
        in: "$in",
        match: "$match",
        unwind: "$unwind",
        lookup: "$lookup",
        project: "$project",
        arrayElemAt: "$arrayElemAt",
    },
    collections: {
        transactionDetails: "transactionDetails",
        userTransactions: "userTransactions",
    },
}