import { validateToken } from "../services/jwt.js";
const ensureAuth = async (req, res, next) => {
    var _a;
    const authToken = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
    if (!authToken) {
        res.statusMessage = "El usuario no está autenticado.";
        return res.sendStatus(401);
    }
    try {
        const userData = await validateToken(authToken);
        req.session = userData;
        next();
    }
    catch (ex) {
        // Token invalido, retirarlo de la bd si existe
        res.statusMessage = "El token de autorización no es válido.";
        res.sendStatus(401);
    }
};
export default ensureAuth;
