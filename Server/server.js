const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Success");
});

app.listen(3002, () => console.log("Example app is listening on port 3000"));
