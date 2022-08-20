const express = require("express");
const bodyParser = require("body-parser");
const dbConfig = require("./config/database.config.js");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./app/routes/user.routes");
const { Server } = require('socket.io')
const { createServer } = require("http");
const fs = require('fs/promises');

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

const httpServer = createServer(app);

const server = new Server(httpServer, {
    cors:{
        origin:'http://localhost:3000'
    }
})

server.on("connection", async(socket)=>{
    const getChat = await fs.readFile('./chat.json', 'utf-8');

    const chatToJson = JSON.parse(getChat);

    socket.emit('chat', {data: chatToJson});


    socket.on('message', async (...data) => {
		console.log(data[0].data, '<<< data');
		const getData = data[0].data;

        console.log(chatToJson);

        console.log(typeof chatToJson);


		chatToJson[getData.sender].push({
			sender: getData.sender,
			message: getData.message
		})

		chatToJson[getData.to].push({
			sender: getData.sender,
			message: getData.message
		})

		await fs.writeFile('./chat.json', JSON.stringify(chatToJson), 'utf-8')
    })
})

httpServer.listen(3000, () => {
	console.log(`App listen to port 3000`)
});

// app.listen(process.env.PORT || 3000, () => {
//   console.log("Server is listening on port 3000");
// });
