import CustomError from "../../utils/customError.js";
import errorSender from "../../utils/errorSender.js";
import exists from "../../utils/exists.js";
import {
	addContinentToCities,
	assignHome,
	createCity,
	createLocation,
	deleteContinentFromCities,
	deleteLocation,
	getCities,
	getCountries,
	getLocationById,
	getLocations,
	updateCountryName,
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
	const {
		idLocation,
		name,
		address,
		parking,
		openTime,
		closeTime,
		distanceFromCityCenter,
		urbanArea,
		dangerArea,
	} = req.body;

	try {
		await updateLocation({
			idLocation,
			name,
			address,
			parking,
			openTime,
			closeTime,
			distanceFromCityCenter,
			urbanArea,
			dangerArea,
		});

		res.send({ ok: true });
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
	try {
		const result = await getLocations();

		if (!result || result.length === 0) throw new CustomError("No se encontraron resultados.", 404);
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
	const { country } = req.query;

	try {
		const result = await getCities(country);

		if (!result || !(result.length > 0))
			throw new CustomError("No se encontraron resultados.", 404);
		res.send(result);
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al obtener lista de ciudades.",
		});
	}
};

const assignHomeController = async (req: AppRequest, res: AppResponse) => {
	if (!req.session) return;
	try {
		const { idLocation, isOwner, postalCode, livesAlone } = req.body;
		const idUser = req.session.id;

		// Verificar si existe la ubicación
		if (!(await getLocationById(idLocation)))
			throw new CustomError("La ubicación no existe. ", 400);

		await assignHome({ idUser, idLocation, isOwner, postalCode, livesAlone });

		res.send({ ok: true });
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al asignar casa.",
		});
	}
};

const addContinentToCitiesController = async (req: AppRequest, res: AppResponse) => {
	try {
		const { country, continent } = req.body;

		if (!country) throw new CustomError("El campo 'country' es obligatorio. ", 400);
		if (!continent) throw new CustomError("El campo 'continent' es obligatorio. ", 400);

		await addContinentToCities({ country, continent });

		res.send({ ok: true });
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al asignar continente a ciudades de un país.",
		});
	}
};
const updateCountryNameController = async (req: AppRequest, res: AppResponse) => {
	try {
		const { country, newName } = req.body;

		if (!country) throw new CustomError("El campo 'country' es obligatorio. ", 400);
		if (!newName) throw new CustomError("El campo 'newName' es obligatorio. ", 400);

		await updateCountryName({ country, newName });

		res.send({ ok: true });
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al actualizar nombre de país.",
		});
	}
};

const deleteContinentFromCitiesController = async (req: AppRequest, res: AppResponse) => {
	try {
		const { idCity } = req.query;

		await deleteContinentFromCities({ idCity });

		res.send({ ok: true });
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al eliminar continente de ciudades.",
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
	assignHomeController,
	addContinentToCitiesController,
	updateCountryNameController,
	deleteContinentFromCitiesController,
};
