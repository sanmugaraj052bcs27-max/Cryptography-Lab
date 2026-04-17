const express = require("express");
const bodyParser = require("body-parser");
const md5 = require("./md5");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/md5", (req, res) => {
    const message = req.body.message;
    const result = md5.generateMD5WithSteps(message);
    res.json(result);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));