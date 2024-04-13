import neo4j from "neo4j-driver";
import config from "config";


class Connection {
	static driver: neo4j.Driver;

	static connect() {
		const uri:string = config.get("neo4j_uri"); 
		const user:string = config.get("neo4j_user");
		const password:string = config.get("neo4j_password"); 

		// Crear una nueva instancia del driver Neo4j
		Connection.driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

	}
}

export default Connection
