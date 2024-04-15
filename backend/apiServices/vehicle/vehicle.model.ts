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
      MERGE (u)-[:owns {since:$since, stillOwner:$stillOwner, price:$price}]->(v)
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

const getUserVehicleById = async (idVehicle: string, userId: string) => {
	const session = Connection.driver.session();

	const result = await session.run(
		`	MATCH (:User {id:$userId})-[:owns]->(v:Vehicle {identification:$idVehicle})
			RETURN v as vehicle`,
		{ idVehicle, userId }
	);

	if (result.records.length === 0) return null;

	const location: AppLocation = result.records[0].get("vehicle").properties;

	await session.close();

	return location;
};

const getUserVehicles = async (userId: string) => {
	const session = Connection.driver.session();

	const result = await session.run(
		`	MATCH (:User {id:$userId})-[:owns]->(v:Vehicle)
			RETURN v as vehicle`,
		{ userId }
	);

	if(result.records.length === 0) return null;

	const vehicles:Vehicle[] = result.records.map(record => record.get("vehicle").properties)

	await session.close();

	return vehicles;
}

export { createVehicle, getUserVehicleById, getUserVehicles };
