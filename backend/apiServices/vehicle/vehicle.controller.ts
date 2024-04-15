import CustomError from "../../utils/customError.js";
import errorSender from "../../utils/errorSender.js";
import { createVehicle, getUserVehicles } from "./vehicle.model.js";

const createVehicleController = async (req: AppRequest, res: AppResponse) => {
	const { type, identification, color, brand, model, year, since, stillOwner, price } =
		req.body;

	if (!req.session) return;
  const {id } = req.session;
	try {
		const vehicle = await createVehicle({userId: id, type, identification, color, brand, model, year, relation: {since: new Date(since).toString(), stillOwner, price}})

		res.send(vehicle);
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al crear nuevo vehiculo.",
		});
	}
};


const getUserVehiclesController = async (req: AppRequest, res: AppResponse) => {
	if (!req.session) return;

	try {

		if(!req.session) return;

		const result = await getUserVehicles(req.session.id);

		if (!result || !(result.length > 0)) throw new CustomError("No se encontraron resultados.", 404);
		res.send(result);
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al obtener lista de vehiculos del usuario.",
		});
	}
};

export {createVehicleController, getUserVehiclesController}
