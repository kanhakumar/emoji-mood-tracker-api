// Import express
const express = require('express'); //to create server
const bodyParser = require('body-parser'); // to parse the request
const cors = require('cors') //to enable cross platform resource sharing

const apiRoutes = require("./routes");
const { db } = require("./db");
// Initialize the app
const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());

db.sync()
    .then(() => {
        console.log("Database and tables synced");
        startServer();
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });


function startServer() {
    let port = process.env.PORT || 8080;
    app.use('/api', apiRoutes);
    app.listen(port, function () {
        console.log("Running Emoji Mood Tracker APP on port " + port);
    });
    app.use(function (err, req, res, next) {
        console.log(err);
        return res.status(500).send({ success: false, message: err })
    });
}