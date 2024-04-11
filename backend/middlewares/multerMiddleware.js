export default (multerInstance) => (req, res, next) => {
    multerInstance(req, res, (err) => {
        var _a, _b;
        if (!err)
            next();
        else {
            let error = (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : "Ocurrió un error al subir imagen.";
            let status = (_b = err === null || err === void 0 ? void 0 : err.status) !== null && _b !== void 0 ? _b : 500;
            if ((err === null || err === void 0 ? void 0 : err.code) === "LIMIT_FILE_SIZE") {
                error = "El tamaño del archivo es demasiado grande. El tamaño máximo es de 1 MB.";
                status = 413;
            }
            res.statusMessage = error;
            res.status(status).send({ err: error, status });
        }
    });
};
