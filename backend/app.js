import express from "express";
import cors from "cors";
import indexRoutes from "./routes/index.js";
import connect from "./db/connection.js";
import config from "config";
import getDirname from "./utils/getDirname.js";
const app = express();
// @ts-ignore
global.dirname = getDirname(import.meta.url);
await connect();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));
app.use("/", indexRoutes);
const port = config.get("port");
app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}.`);
});
