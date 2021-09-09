// general dependencies
const express = require('express');
const fs = require('fs');

const app = express()
const cors = require('cors')

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors())

const owner = "CyBizpsEVPjycYiaCMaDQFkHJWrPZJsBYWeYTz3JYVPX";

const startWhitelist = (num) => {
    let whitelist = fs.readFileSync('whitelist', 'utf-8').split('\n');
    whitelist.push(owner);

    let mintsLeftDB = {};
    whitelist.forEach(x => {
        mintsLeftDB[x] = num;
    });
    fs.writeFileSync('mintsLeftDB.json', JSON.stringify(mintsLeftDB));
    fs.writeFileSync('transactionsDB.json', JSON.stringify({}));
}

app.get('/', (req, res) => {
    
    res.send("Hello There!")
})

const registerMint = (num, address, signature) => {
    let mintsLeftDB = JSON.parse(fs.readFileSync('mintsLeftDB.json', 'utf-8'));
    let transactionsDB = JSON.parse(fs.readFileSync('transactionsDB.json', 'utf-8'));

    mintsLeftDB[address] -= num;
    transactionsDB[address] = {signature, num_minted: num};

    fs.writeFileSync('mintsLeftDB.json', JSON.stringify(mintsLeftDB));
    fs.writeFileSync('transactionsDB.json', JSON.stringify(transactionsDB));
}

app.post('/getMintsLeft', (req, res) => {
    let address = req.body.address;
    let mintsLeftDB = JSON.parse(fs.readFileSync('mintsLeftDB.json', 'utf-8'));
    
    res.send({mints_left: mintsLeftDB[address]})
})

app.post('/registerMint', (req, res) => {
    let {num, address, signature} = req.body;
    
    registerMint(num, address, signature);

    res.end();
})

app.get('/getTransactions', (req, res) => {
    
    res.send(JSON.parse(fs.readFileSync('transactionsDB.json', 'utf-8')));
})

let port = 4000

app.listen(port, () => {
    startWhitelist(10);
    console.log(`Example app listening at http://localhost:${port}`)
})