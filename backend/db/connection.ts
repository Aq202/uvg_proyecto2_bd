/* eslint-disable no-console */
import mongoose from "mongoose";
import config from "config";

const uri: string = config.get("dbConnectionUri");
const connect = () => mongoose.connect(uri);

const { connection, mongo } = mongoose;

connection.on("error", () => console.error.bind(console, "connection error"));

connection.once("open", () => {
	console.info("Conexión a la bd exitosa.");
});

export default connect;
export { connection, mongo };
