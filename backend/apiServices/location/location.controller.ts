import CustomError from "../../utils/customError.js";
import errorSender from "../../utils/errorSender.js";
import exists from "../../utils/exists.js";
import {
	createCity,
	createLocation,
	deleteLocation,
	getCities,
	getCountries,
	getLocations,
	updateLocation,
} from "./location.model.js";

const createCityController = async (req: AppRequest, res: AppResponse) => {
	const { name, longitude, latitude, country } = req.body;

	try {
		const location = await createCity({ name, longitude, latitude, country });

		res.send(location);
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al crear nueva ciudad.",
		});
	}
};

const createLocationController = async (req: AppRequest, res: AppResponse) => {
	const {
		name,
		address,
		parking,
		openTime,
		closeTime,
		cityId,
		distanceFromCityCenter,
		dangerArea,
		urbanArea,
	} = req.body;

	try {
		const location = await createLocation({
			name,
			address,
			parking,
			openTime,
			closeTime,
			cityId,
			distanceFromCityCenter,
			dangerArea,
			urbanArea,
		});

		res.send(location);
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al crear nueva ubicación.",
		});
	}
};
const updateLocationController = async (req: AppRequest, res: AppResponse) => {
	const { id, name, country, city, address } = req.body;

	try {
		if (!req.session) return;

		const idUser: string = req.session.id;

		const location = await updateLocation({ id, name, country, city, address, idUser });

		res.send(location);
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al actualizar ubicación.",
		});
	}
};

const deleteLocationController = async (req: AppRequest, res: AppResponse) => {
	if (!req.session) return;

	const { idLocation } = req.params;
	const idUser: string = req.session.id;

	try {
		await deleteLocation({ id: idLocation, idUser });

		res.send({ ok: true });
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al eliminar ubicación.",
		});
	}
};

const getLocationsController = async (req: AppRequest, res: AppResponse) => {
	if (!req.session) return;
	const { city, country, page } = req.query;
	const idUser: string = req.session.id;

	try {
		const parsedPage = exists(page) ? parseInt(page) : undefined;
		const result = await getLocations({ idUser, country, city, page: parsedPage });

		if (result.result.length === 0) throw new CustomError("No se encontraron resultados.", 404);
		res.send(result);
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al obtener ubicaciones.",
		});
	}
};

const getCountriesListController = async (req: AppRequest, res: AppResponse) => {
	if (!req.session) return;
	const { fromUser } = req.query;
	const idUser: string = req.session.id;

	try {
		const userFilter = exists(fromUser) ? idUser : undefined;
		const result = await getCountries(userFilter);

		if (!(result?.length > 0)) throw new CustomError("No se encontraron resultados.", 404);
		res.send(result);
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al obtener lista de países.",
		});
	}
};
const getCitiesListController = async (req: AppRequest, res: AppResponse) => {
	if (!req.session) return;
	const { fromUser, country } = req.query;
	const idUser: string = req.session.id;

	try {
		const userFilter = exists(fromUser) ? idUser : undefined;
		const result = await getCities(userFilter, country);

		if (!(result?.length > 0)) throw new CustomError("No se encontraron resultados.", 404);
		res.send(result);
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al obtener lista de ciudades.",
		});
	}
};

export {
	createCityController,
	createLocationController,
	updateLocationController,
	deleteLocationController,
	getLocationsController,
	getCountriesListController,
	getCitiesListController,
};
