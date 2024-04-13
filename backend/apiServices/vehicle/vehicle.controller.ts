import errorSender from "../../utils/errorSender.js";
import { createVehicle } from "./vehicle.model.js";

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

export {createVehicleController}
