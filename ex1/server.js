const express = require("express");
const bodyParser = require("body-parser");
const cipherRoutes = require("./routes/cipherRoutes");

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/api", cipherRoutes);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
