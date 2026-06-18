require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;

const outdoorCinemas = require("./routes/outdoorCinemas");

app.use("/outdoor-cinemas", outdoorCinemas);

app.listen(PORT, () => {
  console.log("Listening on: http://localhost:" + PORT + "/");
});
