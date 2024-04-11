import LocationSchema from "../../db/schemas/location.schema.js";
import consts from "../../utils/consts.js";
import CustomError from "../../utils/customError.js";
import { someExists } from "../../utils/exists.js";
import { createLocationDto, createMultipleLocationsDto } from "./location.dto.js";
import { ObjectId } from "mongodb";
const createLocation = async ({ name, country, city, address, idUser, }) => {
    const location = new LocationSchema();
    location.name = name;
    location.country = country;
    location.city = city;
    location.address = address;
    location.idUser = idUser;
    await location.save();
    return createLocationDto(location);
};
const updateLocation = async ({ id, name, country, city, address, idUser, }) => {
    const location = await LocationSchema.findOne({ _id: id, idUser });
    if (!location)
        throw new CustomError("No se encontró la ubicación.", 404);
    if (name)
        location.name = name;
    if (country)
        location.country = country;
    if (city)
        location.city = city;
    if (address)
        location.address = address;
    if (someExists(name, country, city, address))
        await location.save();
    return createLocationDto(location);
};
const deleteLocation = async ({ id, idUser }) => {
    try {
        const { acknowledged, deletedCount } = await LocationSchema.deleteOne({ _id: id, idUser });
        if (!acknowledged)
            throw new CustomError("Ocurrió un error al eliminar ubicación.", 500);
        if (deletedCount !== 1)
            throw new CustomError("No se encontró la ubicación.", 404);
    }
    catch (ex) {
        if ((ex === null || ex === void 0 ? void 0 : ex.kind) === "ObjectId")
            throw new CustomError("El id de la ubicación no es válido.", 400);
        throw ex;
    }
};
const getLocations = async ({ idUser, country, city, page, }) => {
    const filter = {
        idUser: new ObjectId(idUser),
    };
    if (country)
        filter.country = country;
    if (city)
        filter.city = city;
    const count = await LocationSchema.countDocuments(filter);
    const pages = Math.ceil(count / consts.resultsNumberPerPage);
    const queryPipeline = [
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
    queryPipeline.push({ $sort: { name: 1 } });
    const locations = await LocationSchema.aggregate(queryPipeline);
    return { pages, total: count, result: createMultipleLocationsDto(locations) };
};
const getLocationById = async (idLocation) => {
    try {
        const location = await LocationSchema.findById(idLocation);
        if (!location)
            return null;
        return createLocationDto(location);
    }
    catch (ex) {
        if ((ex === null || ex === void 0 ? void 0 : ex.kind) === "ObjectId")
            throw new CustomError("El id de la ubicación no es válido.", 400);
        throw ex;
    }
};
const getCountries = async (idUser) => {
    const filter = {};
    if (idUser)
        filter.idUser = idUser;
    const countries = await LocationSchema.find(filter, { country: 1 }).distinct("country").sort({ country: 1 });
    return countries === null || countries === void 0 ? void 0 : countries.map(val => val);
};
const getCities = async (idUser, country) => {
    const filter = {};
    if (idUser)
        filter.idUser = new ObjectId(idUser);
    if (country)
        filter.country = country;
    const cities = await LocationSchema.aggregate([
        { $match: filter },
        { $group: { _id: { country: "$country", city: "$city" } } },
        {
            $project: {
                _id: 0,
                country: "$_id.country",
                city: "$_id.city"
            }
        },
        {
            $sort: { "city": 1 }
        }
    ]);
    return cities;
};
export { createLocation, updateLocation, deleteLocation, getLocations, getLocationById, getCountries, getCities };
