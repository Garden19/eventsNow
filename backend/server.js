require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const path = require("path");

const outdoorCinemas = require("./routes/outdoorCinemas");

app.use("/outdoor-cinemas", outdoorCinemas);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log("Listening on: http://localhost:" + PORT + "/");
});
