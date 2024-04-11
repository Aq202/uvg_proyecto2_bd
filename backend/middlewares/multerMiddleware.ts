import { NextFunction } from "express";

export default (multerInstance: any) => (req: AppRequest, res: AppResponse, next: NextFunction) => {
	multerInstance(req, res, (err: any) => {
		if (!err) next();
		else {
			let error = err?.message ?? "Ocurrió un error al subir imagen.";
			let status = err?.status ?? 500;

			if (err?.code === "LIMIT_FILE_SIZE") {
				error = "El tamaño del archivo es demasiado grande. El tamaño máximo es de 1 MB.";
				status = 413;
			}

			res.statusMessage = error;
			res.status(status).send({ err: error, status });
		}
	});
};
