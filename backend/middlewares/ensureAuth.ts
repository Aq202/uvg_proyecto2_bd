import { NextFunction } from "express";
import { validateToken } from "../services/jwt.js";

const ensureAuth = async (req: AppRequest, res: AppResponse, next: NextFunction): Promise<void> => {
	const authToken = req.headers?.authorization;
	if (!authToken) {
		res.statusMessage = "El usuario no está autenticado.";
		return res.sendStatus(401);
	}

	try {
		const userData = await validateToken(authToken);

		req.session = userData;
		next();
	} catch (ex) {
		// Token invalido, retirarlo de la bd si existe
		res.statusMessage = "El token de autorización no es válido.";
		res.sendStatus(401);
	}
};

export default ensureAuth;
