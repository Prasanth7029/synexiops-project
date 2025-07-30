const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Order service running"));

app.listen(8083, () => console.log("Order service on port 8083"));
