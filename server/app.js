const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors')
const path = require('path')
const connectDb = require('./db.js')


const PORT = 4000;
connectDb();

app.use(cors({
    origin: ["*"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));
app.use(bodyParser.json());
app.use(routes);
app.use(express.static(path.join(__dirname, "wealth-up\index.html")));
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
