import express from "express";
import "dotenv/config";
import grades from "./routes/grades.mjs";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
import "./db/conn.mjs";

app.get("/", (req, res) => {
  res.send("Welcome to the API.");
});

app.use("/grades", grades); 

app.use((err, req, res, next) => {
  res.status(500).send("Server error.");
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
