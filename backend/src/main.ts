import fs from "node:fs/promises";
import bodyParser from "body-parser";
import express from 'express';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all domains
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  next();
});

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

app.get("/dashboard", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const fileContent = await fs.readFile("C:/Users/Charbel/Desktop/Weave Wider/weave-wider/backend/src/data/dashboard-data.json", "utf-8");

  const placesData = JSON.parse(fileContent);

  res.status(200).json({ dashboard: placesData });
});
