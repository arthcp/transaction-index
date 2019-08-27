const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const service = require('./apiService');
const config = require('../config.json');
const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());

// returning user transactions when post request is received at /getUserTransactions
app.post('/getUserTransactions', async (req, res) => {
    try {
        if (req.body && req.body.userAddress) {
            const userAddress = req.body.userAddress;
            const response = await service.getUserTransactions({userAddress}); 
            res.status(200).json({status: "success", data: response});
            return;

        } else {
            console.error("Illegal arguments in getUserTransactions ", req.body);
            res.status(400).json({status: "error"});
            return;
        }

    } catch (e) {
        console.error("API error");
        console.error(e);
        res.status(500).json({status: "error"});
        return;
    }
});

// returning 404 for all other requests
app.all('*', async (req, res) => {
    console.error("Wrong request");
    res.status(404).json({status: "error"});
    return;
});

app.listen(config.serverPort, () => {
    console.info(`Listening on port ${config.serverPort}`);
});