const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");

require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();

const corsConfig = {
  origin: process.env.URL,
}

app.use(cors());
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
})

app.get("/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
})

app.get("/comic-data/last", cors(corsConfig), async (req, res) => {
  const json = await fetch(`https://xkcd.com/info.0.json`, {
    method: "GET",
  }).then(res => res.json());
  res.json(json);
})

app.get("/comic-data/:id", cors(corsConfig), async (req, res) => {
  const json = await fetch(`https://xkcd.com/${req.params.id}/info.0.json`, {
    method: "GET",
  }).then(res => res.json());
  res.json(json);
}) 

app.listen(PORT, () => {
  console.log("Server is up and listening on PORT: " + PORT);
})