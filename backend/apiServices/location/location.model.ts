import LocationSchema from "../../db/schemas/location.schema.js";
import Connection from "../../db_neo4j/connection.js";
import CustomError from "../../utils/customError.js";
import exists from "../../utils/exists.js";
import generateId from "../../utils/generateId.js";
import parseBoolean from "../../utils/parseBoolean.js";

const createCity = async ({
	name,
	longitude,
	latitude,
	country,
}: {
	name: string;
	longitude: string;
	latitude: string;
	country: string;
}): Promise<City> => {
	const session = Connection.driver.session();

	const id = generateId();

	await session.run(
		` MERGE (c:City {id:$id, name:$name, longitude:$longitude, latitude:$latitude, country:$country})
      RETURN c`,
		{ id, name, longitude, latitude, country }
	);

	await session.close();

	return { id, name, longitude, latitude, country };
};

const createLocation = async ({
	name,
	address,
	parking,
	openTime,
	closeTime,
	cityId,
	distanceFromCityCenter,
	dangerArea,
	urbanArea,
}: {
	name: string;
	address: string;
	parking: boolean;
	openTime: string;
	closeTime: string;
	cityId: string;
	distanceFromCityCenter: string;
	dangerArea: boolean;
	urbanArea: boolean;
}): Promise<AppLocation & { city: City } & LocatedAtRel> => {
	const session = Connection.driver.session();

	const id = generateId();
	const result = await session.run(
		`	MATCH (c:City {id:$cityId})
			MERGE (l:Location {id:$id, name:$name, address:$address, parking:$parking, openTime:$openTime, closeTime:$closeTime})
			MERGE (l)-[:located_at {distanceFromCityCenter:$distanceFromCityCenter, dangerArea:$dangerArea, urbanArea:$urbanArea}]->(c)
			RETURN c as city`,
		{
			id,
			cityId,
			name,
			address,
			parking: parseBoolean(parking),
			openTime,
			closeTime,
			distanceFromCityCenter,
			dangerArea: parseBoolean(parking),
			urbanArea: parseBoolean(parking),
		}
	);

	if (result.records.length === 0) throw new CustomError("No se encontró la ciudad.", 404);

	const city = result.records[0].get("city").properties;

	await session.close();

	return {
		id,
		name,
		address,
		parking,
		openTime,
		closeTime,
		city,
		distanceFromCityCenter,
		dangerArea,
		urbanArea,
	};
};

const updateLocation = async ({
	idLocation,
	name = null,
	address = null,
	parking = null,
	openTime = null,
	closeTime = null,
	distanceFromCityCenter = null,
	dangerArea = null,
	urbanArea = null,
}: {
	idLocation: string;
	name?: string | null;
	address?: string | null;
	parking?: boolean | null;
	openTime?: string | null;
	closeTime?: string | null;
	distanceFromCityCenter?: string	| null;
	dangerArea?: boolean | null;
	urbanArea?: boolean | null;
}) => {
	const session = Connection.driver.session();
	const result = await session.run(
		`	MATCH (l:Location {id:$idLocation})-[l_rel:located_at]->(:City)
			SET l.name = COALESCE($name, l.name),
					l.address = COALESCE($address, l.address),
					l.parking = COALESCE($parking, l.parking),
					l.openTime = COALESCE($openTime, l.openTime),
					l.closeTime = COALESCE($closeTime, l.closeTime),
					l_rel.distanceFromCityCenter = COALESCE($distanceFromCityCenter, l_rel.distanceFromCityCenter),
					l_rel.dangerArea = COALESCE($dangerArea, l_rel.dangerArea),
					l_rel.urbanArea = COALESCE($urbanArea, l_rel.urbanArea)
			RETURN l`,
		{
			idLocation,
			name,
			address,
			parking: exists(parking) ? parseBoolean(parking) : null,
			openTime,
			closeTime,
			distanceFromCityCenter,
			dangerArea:exists(dangerArea) ? parseBoolean(dangerArea) : null,
			urbanArea:exists(urbanArea) ? parseBoolean(urbanArea) : null,
			
		
		}
	);

	if (result.records.length === 0) throw new CustomError("No se encontró la ubicación.", 404);

	await session.close();
};

const deleteLocation = async ({ id, idUser }: { id: string; idUser: string }) => {
	try {
		const { acknowledged, deletedCount } = await LocationSchema.deleteOne({ _id: id, idUser });

		if (!acknowledged) throw new CustomError("Ocurrió un error al eliminar ubicación.", 500);
		if (deletedCount !== 1) throw new CustomError("No se encontró la ubicación.", 404);
	} catch (ex: any) {
		if (ex?.kind === "ObjectId") throw new CustomError("El id de la ubicación no es válido.", 400);
		throw ex;
	}
};

const getLocations = async () => {
	const session = Connection.driver.session();

	const result = await session.run(
		`	MATCH (l:Location)-[r:located_at]->(c:City)
			RETURN l as location, c as city, r as locatedAtRel
		`
	);

	if (result.records.length === 0) return null;

	const locations: (AppLocation & { city: City & LocatedAtRel })[] = result.records.map(
		(record) => ({
			...record.get("location").properties,
			city: { ...record.get("city").properties, ...record.get("locatedAtRel").properties },
		})
	);

	await session.close();

	return locations;
};

const getLocationById = async (idLocation: string) => {
	const session = Connection.driver.session();

	const result = await session.run(
		`	MATCH (l:Location {id:$idLocation})
			RETURN l as location`,
		{ idLocation }
	);

	if (result.records.length === 0) return null;

	const location: AppLocation = result.records[0].get("location").properties;

	await session.close();

	return location;
};

const getCountries = async (idUser?: string) => {
	const filter: { idUser?: string } = {};
	if (idUser) filter.idUser = idUser;
	const countries = await LocationSchema.find(filter, { country: 1 })
		.distinct("country")
		.sort({ country: 1 });

	return countries?.map((val) => val);
};

const getCities = async (country?: string) => {
	const session = Connection.driver.session();

	const result = await session.run(
		`	MATCH (c:City)
			${country ? "WHERE c.country=$country" : ""}
			RETURN c as city`,
		{ country }
	);

	if (result.records.length === 0) return null;

	const cities: City[] = result.records.map((record) => record.get("city").properties);

	await session.close();

	return cities;
};

const assignHome = async ({idUser, idLocation, isOwner, postalCode, livesAlone}: {idUser:string; idLocation:string; isOwner:boolean; postalCode: number; livesAlone:boolean})=>{
	const session = Connection.driver.session();
    const result = await session.run(`
			MATCH (u:User {id:$idUser})
			MATCH (l:Location {id:$idLocation})
			MERGE (u)-[:lives_at {isOwner:$isOwner, postalCode:$postalCode, livesAlone:$livesAlone}]->(l)
			RETURN u
			`, {
        idUser,
				idLocation,
				isOwner,
				postalCode,
				livesAlone,
    });
    if (result.records.length === 0)
        throw new CustomError("No se pudo asignar la ubicación como casa.", 400);
    await session.close();
}

const getHome = async ({idUser}: {idUser: string}) => {
	const session = Connection.driver.session();

	const result = await session.run(
		`	MATCH (:User {id: $idUser})-[l_rel:lives_at]->(l:Location)
			RETURN l as location, l_rel AS user_lives_at_rel
			LIMIT 1`,
		{ idUser }
	);

	if (result.records.length === 0) return null;

	const home = {
		...result.records[0].get("location").properties,
		...result.records[0].get("user_lives_at_rel").properties,

	}

	await session.close();

	return home;
}

const addContinentToCities = async ({country, continent}:{country:string; continent:string;}) => {
	const session = Connection.driver.session();

	const result = await session.run(
		`	MATCH (c:City {country:$country})
			SET c.continent=$continent
			RETURN c`,
		{ country, continent}
	);

	if (result.records.length === 0) throw new CustomError("No se encontraron ciudades con dicho país.", 400)

	await session.close();

}

const updateCountryName = async ({country, newName}:{country:string; newName: string}) => {
	const session = Connection.driver.session();

	const result = await session.run(
		`	MATCH (c:City {country:$country})
			SET c.country = $newName
			RETURN c`,
		{ country, newName}
	);

	if (result.records.length === 0) throw new CustomError("No se encontraron ciudades con dicho país.", 400)

	await session.close();

}

const deleteContinentFromCities = async ({idCity}: { idCity:string}) => {
	const session = Connection.driver.session();

	const result = await session.run(
		`	MATCH (c:City ${idCity ? "{id:$idCity}": ""})
			REMOVE c.continent
			RETURN c`,
		{ idCity }
	);

	if (result.records.length === 0) throw new CustomError("No se encontraron ciudades.", 404)

	await session.close();

}

export {
	createCity,
	createLocation,
	updateLocation,
	deleteLocation,
	getLocations,
	getLocationById,
	getCountries,
	getCities,
	assignHome,
	getHome,
	addContinentToCities,
	updateCountryName,
	deleteContinentFromCities,
};
