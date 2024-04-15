import LocationSchema from "../../db/schemas/location.schema.js";
import Connection from "../../db_neo4j/connection.js";
import CustomError from "../../utils/customError.js";
import { someExists } from "../../utils/exists.js";
import generateId from "../../utils/generateId.js";
import { createLocationDto } from "./location.dto.js";

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
			parking,
			openTime,
			closeTime,
			distanceFromCityCenter,
			dangerArea,
			urbanArea,
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
	id,
	name,
	country,
	city,
	address,
	idUser,
}: {
	id: string;
	name?: string;
	country?: string;
	city?: string;
	address?: string;
	idUser: string;
}): Promise<AppLocation> => {
	const location = await LocationSchema.findOne({ _id: id, idUser });

	if (!location) throw new CustomError("No se encontró la ubicación.", 404);

	if (name) location.name = name;
	if (country) location.country = country;
	if (city) location.city = city;
	if (address) location.address = address;

	if (someExists(name, country, city, address)) await location.save();

	return createLocationDto(location);
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

export {
	createCity,
	createLocation,
	updateLocation,
	deleteLocation,
	getLocations,
	getLocationById,
	getCountries,
	getCities,
};
