import LocationSchema from "../../db/schemas/location.schema.js";
import consts from "../../utils/consts.js";
import CustomError from "../../utils/customError.js";
import { someExists } from "../../utils/exists.js";
import { createLocationDto, createMultipleLocationsDto } from "./location.dto.js";
import { ObjectId } from "mongodb";

const createLocation = async ({
	name,
	country,
	city,
	address,
	idUser,
}: {
	name: string;
	country: string;
	city: string;
	address: string;
	idUser: string;
}): Promise<AppLocation> => {
	const location = new LocationSchema();

	location.name = name;
	location.country = country;
	location.city = city;
	location.address = address;
	location.idUser = idUser as any;

	await location.save();

	return createLocationDto(location);
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

const getLocations = async ({
	idUser,
	country,
	city,
	page,
}: {
	country?: string;
	city?: string;
	idUser: string;
	page?: number;
}) => {
	const filter: { idUser: ObjectId; country?: string; city?: string } = {
		idUser: new ObjectId(idUser),
	};

	if (country) filter.country = country;
	if (city) filter.city = city;

	const count = await LocationSchema.countDocuments(filter);
	const pages = Math.ceil(count / consts.resultsNumberPerPage);

	const queryPipeline: any = [
		{
			$match: filter,
		},
	];

	if (page != undefined) {
		queryPipeline.push({
			$skip: page * consts.resultsNumberPerPage,
		});
		queryPipeline.push({
			$limit: consts.resultsNumberPerPage,
		});
	}

	queryPipeline.push({ $sort: {name: 1 }})
	const locations = await LocationSchema.aggregate(queryPipeline);
	return { pages, total: count, result: createMultipleLocationsDto(locations) };
};

const getLocationById = async (idLocation: string) => {
	try {
		const location = await LocationSchema.findById(idLocation);
		if (!location) return null;
		return createLocationDto(location);
	} catch (ex: any) {
		if (ex?.kind === "ObjectId") throw new CustomError("El id de la ubicación no es válido.", 400);
		throw ex;
	}
};

const getCountries = async (idUser?:string) => {

	const filter:{idUser?:string} = {}
	if(idUser) filter.idUser = idUser;
	const countries = await LocationSchema.find(filter, {country: 1}).distinct("country").sort({country: 1})

	return countries?.map(val => val)
}

const getCities = async (idUser?:string, country?:string) => {

	const filter:{idUser?:ObjectId, country?:string} = {}
	if(idUser) filter.idUser = new ObjectId(idUser);
	if(country) filter.country = country;
	const cities = await LocationSchema.aggregate([
		{$match: filter},
		{$group: {_id: {country: "$country", city:"$city"}}},
		{
			$project: {
				_id: 0,
				country: "$_id.country",
				city: "$_id.city"
			}
		},
		{
			$sort: {"city": 1}
		}
	])

	return cities;
}

export { createLocation, updateLocation, deleteLocation, getLocations, getLocationById, getCountries, getCities };
