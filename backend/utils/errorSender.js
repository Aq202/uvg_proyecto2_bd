import CustomError from "./customError.js";
/**
 * Se encarga del empaquetamiento y envío uniforme del error.
 * Dentro de esta función se ejecuta el parámetro res.send({err,status}).
 * Se recomienda que no se ejecute nada posterior a esta función.
 * @param res Objeto res del controlador de la ruta.
 * @param ex Objeto de la excepción o error generado. Puede ser un CustomError y texto.
 * Si es null o undefined se utiliza un mensaje y satus por default.
 * @param session Objeto session de la bd de mongo. Es opcional. Si se adjunta, se aborta y finaliza
 * la sesión.
 */
const errorSender = async ({ res, ex, defaultError = "Ocurrió un error.", defaultStatus = 500, }) => {
    var _a;
    let err = defaultError;
    let status = defaultStatus;
    if (ex instanceof CustomError) {
        err = ex.message;
        status = (_a = ex.status) !== null && _a !== void 0 ? _a : 500;
    }
    console.log("Error manejado: \n", ex);
    res.statusMessage = err;
    res.status(status).send({ err, status, errorObj: ex });
};
export default errorSender;
