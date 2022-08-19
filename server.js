const express = require("express");
const bodyParser = require("body-parser");
const dbConfig = require("./config/database.config.js");
const mongoose = require("mongoose");
var cors = require("cors");
const userRoutes = require("./app/routes/user.routes");
require("dotenv").config();

mongoose.Promise = global.Promise;

//Koneksi ke database
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Sukses terkonek ke database");
  })
  .catch((err) => {
    console.log("Gagal terkoneksi ke database, eror: ", err);
    process.exit();
  });

//membuat express app
const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(userRoutes);

app.get("/", (req, res) => {
  res.json({
    messeage: "Aplikasi notes",
  });
});

require("./app/routes/note.routes.js")(app);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is listening on port 3000");
});
