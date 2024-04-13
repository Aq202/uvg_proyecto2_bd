const dotenv = require("dotenv");

dotenv.config(); // hace accesibles las variables de entorno

module.exports = {
	port: 3000,
	dbConnectionUri:
		"mongodb+srv://diego:123@clusteruvg.aryjpty.mongodb.net/?retryWrites=true&w=majority&appName=clusterUVG",
	jwtKey: "a8b08ebce1d6ad7f0eb8f0815385ab5ad9af9d7b02f8c744abaa8d8f52541d7c",
	sendErrorObj: true,
	neo4j_uri: "neo4j+s://9a670284.databases.neo4j.io",
	neo4j_user: "neo4j",
	neo4j_password: "q341vIR2TmgIvedPcx_pl3m5Y9B7ab-tTiBmY7cIEek"
};
