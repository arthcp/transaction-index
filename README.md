## Transaction Index ##
Used to store ethereum transactions in a seperate index. From this index, user transactions can be retrieved easily.

### Technologies used ###
* node.js - Run indexing process and REST server
* web3.js - Connect to ethereum node
* mongodb - Store user transactions

### Setup ###
1. The computer needs to be installed with nodejs and mongodb.
2. Clone this repository.
3. Install node modules for this project.
4. Add proper values in `config.json` which is found in project root directory.
  * `nodeAddress` - Full address of ethereum node. eg. https://kovan.infura.io/v3/asdasdasdasdasdasd
  * `blockIndexlimit` - Number of blocks to index
  * `dbDetails.address` - Address for mongo server.
  * `dbDetails.authDB` - Auth db for mongo server.
  * `dbDetails.userName` - Username for mongo server.
  * `dbDetails.password` - Password for mongo server.
  * `dbDetails.port` - Port for mongo server.
  * `serverPort` - Port for running REST server

### Execution ###
The Index needs to be generated before the API is used. 
To generate the index run this in project root directory -
```
node src/blockIndexer.js
```
The API server can be started by running this in project root directory -
```
node src/api.js
```

Sample request (JSON)-
```
{
	"userAddress": "0xdfD32B08318065b363AC2827196bbe2B6B368C14"
}
```
Sample response (JSON)-
```
{
    "status": "success",
    "data": [
        {
            "from": "0xCEc36668091A2b92B773337e4b648F690f8fD978",
            "to": "0xdfD32B08318065b363AC2827196bbe2B6B368C14",
            "blockNumber": 13085578,
            "transactionHash": "0xaef43c11e9623253caf0b5a8d5d4992be60b497171fc1c2fe62775bff971cca2"
        },
        {
            "from": "0xCEc36668091A2b92B773337e4b648F690f8fD978",
            "to": "0xdfD32B08318065b363AC2827196bbe2B6B368C14",
            "blockNumber": 13085401,
            "transactionHash": "0xb9019c6842d888a1c4cba35ac97c2fae90e8159abcd779447337d539f15b8c72"
        },
        {
            "from": "0xCEc36668091A2b92B773337e4b648F690f8fD978",
            "to": "0xdfD32B08318065b363AC2827196bbe2B6B368C14",
            "blockNumber": 13085346,
            "transactionHash": "0xbba2db4d9a81501e64bac194018f1ab9886bf591d00eb00b357ed03b612e1787"
        }
    ]
}
```
