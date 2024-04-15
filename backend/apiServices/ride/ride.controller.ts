import CustomError from "../../utils/customError.js";
import errorSender from "../../utils/errorSender.js";
import exists from "../../utils/exists.js";
import parseBoolean from "../../utils/parseBoolean.js";
import { getLocationById } from "../location/location.model.js";
import { getUserById } from "../user/user.model.js";
import { getUserVehicleById } from "../vehicle/vehicle.model.js";
import {
	addPassengerComment,
	assignUserToRide,
	completePassengerParticipation,
	createRide,
	createRideRequest,
	getRides,
	getTopUsersWithMostCompletedRides,
	removeUserFromRide,
} from "./ride.model.js";

const createRideController = async (req: AppRequest, res: AppResponse) => {
	const {
		idStartLocation,
		idArrivalLocation,
		date,
		arrival,
		start,
		vehicleId,
		remainingSpaces,
		allowsMusic,
		allowsLuggage,
	} = req.body;

	try {
		if (!req.session) return;
		const userId = req.session.id;

		// Verificar si existen las ubicaciones y vehiculo
		if ((await getLocationById(idStartLocation)) === null)
			throw new CustomError("La ubicación de salida no existe.", 400);
		if ((await getLocationById(idArrivalLocation)) === null)
			throw new CustomError("La ubicación de llegada no existe.", 400);
		if ((await getUserVehicleById(vehicleId, userId)) === null)
			throw new CustomError("El vehiculo no existe.", 400);

		await createRide({
			idStartLocation,
			idArrivalLocation,
			userId,
			date,
			arrival,
			start,
			vehicleId,
			remainingSpaces,
			allowsMusic,
			allowsLuggage,
		});
		res.send({ ok: true });
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al crear ride.",
		});
	}
};

const getRidesController = async (req: AppRequest, res: AppResponse) => {
	const { city, country, page, order, passenger, driver } = req.query;
	if (!req.session) return;
	const idUser = req.session.id;

	try {
		const parsedPage = exists(page) ? parseInt(page) : undefined;
		const parsedOrder =
			parseInt(order) === 1 || parseInt(order) === -1 ? parseInt(order) : undefined;
		const result = await getRides({
			country,
			city,
			page: parsedPage,
			order: parsedOrder,
			idUser,
			passengerFilter: passenger !== undefined ? parseBoolean(passenger) : undefined,
			driverFilter: driver !== undefined ? parseBoolean(driver) : undefined,
		});

		if (result.result.length === 0) throw new CustomError("No se encontraron resultados.", 404);
		res.send(result);
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al obtener viajes.",
		});
	}
};

const assignUserToRideController = async (req: AppRequest, res: AppResponse) => {
	if (!req.session) return;
	try {
		const { idRide, idUser } = req.params;
		const sessionIdUser = req.session.id;

		// Verificar si existe el usuario
		if(!(await getUserById({idUser}))) throw new CustomError("El usuario no existe. ",400)

		await assignUserToRide({ idUser, idRide, sessionIdUser });

		res.send({ ok: true });
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al asignar usuario a viaje.",
		});
	}
};

const removeUserFromRideController = async (req: AppRequest, res: AppResponse) => {
	const user = req.session;
	if (!user) return;
	try {
		const { idRide } = req.params;

		await removeUserFromRide({ idUser: user.id, idRide });

		res.send({ ok: true });
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al desasignar usuario de viaje.",
		});
	}
};

const getTopUsersWithMostCompletedRidesController = async (req: AppRequest, res: AppResponse) => {
	try {
		const result = await getTopUsersWithMostCompletedRides();

		res.send(result);
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al obtener top usuarios con más viajes completados.",
		});
	}
};

const createRideRequestController = async (req: AppRequest, res: AppResponse) => {
	const { idRide, message } = req.body;

	try {
		if (!req.session) return;
		const	idUser = req.session.id;


		await createRideRequest({idRide, idUser, message})
		res.send({ ok: true });
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al crear solicitud de ride.",
		});
	}
};

const addPassengerCommentController = async (req: AppRequest, res: AppResponse) => {
	const { idRide, comment} = req.body;

	try {
		if (!req.session) return;
		const	idUser = req.session.id;


		await addPassengerComment({idRide, idUser, comment})
		res.send({ ok: true });
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al agregar comentario de pasajero.",
		});
	}
}

const completePassengerParticipationController = async (req: AppRequest, res: AppResponse) => {
	const { idRide, attended, rating } = req.body;

	try {
		if (!req.session) return;
		const	idUser = req.session.id;


		await completePassengerParticipation({ idUser, idRide, attended, rating: parseInt(rating) })
		res.send({ ok: true });
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al completar participación de pasajero.",
		});
	}
}

export {
	createRideController,
	getRidesController,
	assignUserToRideController,
	removeUserFromRideController,
	getTopUsersWithMostCompletedRidesController,
	createRideRequestController,
	addPassengerCommentController,
	completePassengerParticipationController
};
