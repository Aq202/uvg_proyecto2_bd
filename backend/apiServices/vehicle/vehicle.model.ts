import Connection from "../../db_neo4j/connection.js";

const createVehicle = async ({
	userId,
	type,
	identification,
	color,
	brand,
	model,
	year,
	relation,
}: Vehicle & { userId: string }): Promise<Vehicle> => {
	const session = Connection.driver.session();

	await session.run(
		` MATCH (u:User {id:$userId})
      MERGE (v:Vehicle {type:$type, identification:$identification, color:$color, brand:$brand,
      model:$model, year:$year })
      MERGE (u)-[:Owns {since:$since, still_owner:$stillOwner, price:$price}]->(v)
      RETURN v`,
		{
			type,
			identification,
			color,
			brand,
			model,
			year,
			userId,
			since: relation?.since,
			stillOwner: relation?.stillOwner,
			price: relation?.price,
		}
	);

	await session.close();
	return { type, identification, color, brand, model, year };
};


export {createVehicle}