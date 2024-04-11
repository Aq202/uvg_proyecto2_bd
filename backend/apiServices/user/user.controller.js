import { signToken } from "../../services/jwt.js";
import errorSender from "../../utils/errorSender.js";
import exists from "../../utils/exists.js";
import { authenticate, createManyUsers, createUser, updateUser, updateUserSubdocuments } from "./user.model.js";
import hash from "hash.js";
import Grid from "gridfs-stream";
import { connection, mongo } from "../../db/connection.js";
import CustomError from "../../utils/customError.js";
import fs from "fs";
import { GridFSBucket } from "mongodb";
const uploadUserImage = (idUser, file) => {
    return new Promise((resolve, reject) => {
        let gfs = Grid(connection.db, mongo);
        gfs.collection("images");
        const { fileName } = file;
        // @ts-ignore
        const filePath = `${global.dirname}/files/${fileName}`;
        const bucket = new GridFSBucket(connection.db, { bucketName: "images" });
        const uploadStream = bucket.openUploadStream(idUser);
        fs.createReadStream(filePath).pipe(uploadStream);
        uploadStream.on("error", async (error) => {
            fs.unlink(filePath, () => { }); // Eliminar archivo temporal
            reject(error);
        });
        uploadStream.on("finish", () => {
            fs.unlink(filePath, () => { }); // Eliminar archivo temporal
            resolve(1);
        });
    });
};
const createUserController = async (req, res) => {
    var _a;
    const { name, email, phone, password } = req.body;
    try {
        const file = (_a = req.uploadedFiles) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            throw new CustomError("No se proporionó una foto de perfil.", 400);
        const passwordHash = hash.sha256().update(password).digest("hex");
        const user = await createUser({ name, email, phone, password: passwordHash });
        await uploadUserImage(user.id, file);
        res.send(user);
    }
    catch (ex) {
        await errorSender({
            res,
            ex,
            defaultError: "Ocurrio un error al crear nuevo usuario.",
        });
    }
};
const updateUserController = async (req, res) => {
    var _a;
    const { name, email, phone, password } = req.body;
    if (!req.session)
        return;
    const id = (_a = req.session) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const passwordHash = exists(password)
            ? hash.sha256().update(password).digest("hex")
            : undefined;
        const user = await updateUser({ id, name, email, phone, password: passwordHash });
        // Actualizar documentos embedded
        await updateUserSubdocuments(user);
        res.send(user);
    }
    catch (ex) {
        await errorSender({
            res,
            ex,
            defaultError: "Ocurrio un error al crear nuevo usuario.",
        });
    }
};
const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const passwordHash = hash.sha256().update(password).digest("hex");
        const user = await authenticate({ email, password: passwordHash });
        const result = Object.assign(Object.assign({}, user), { token: signToken(user) });
        res.send(result);
    }
    catch (ex) {
        await errorSender({
            res,
            ex,
            defaultError: "Ocurrio un error al iniciar sesión.",
        });
    }
};
const getSessionUserController = async (req, res) => {
    try {
        if (!req.session)
            return;
        const user = req.session;
        res.send(user);
    }
    catch (ex) {
        await errorSender({
            res,
            ex,
            defaultError: "Ocurrio un error al obtener datos de usuario.",
        });
    }
};
const uploadUsers = async (req, res) => {
    const { data } = req.body;
    try {
        const users = data.map((user) => ({
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: hash.sha256().update(user.password).digest("hex"),
        }));
        const createdUsers = await createManyUsers(users);
        res.send(createdUsers);
    }
    catch (ex) {
        await errorSender({
            res,
            ex,
            defaultError: "Ocurrio un error al importar usuarios.",
        });
    }
};
const getUserImageController = async (req, res) => {
    try {
        const { idUser } = req.params;
        const bucket = new GridFSBucket(connection.db, { bucketName: "images" });
        const downloadStream = bucket.openDownloadStreamByName(idUser);
        // Construir respuesta con chunks recibidos
        downloadStream.on("data", (chunk) => {
            res.write(chunk);
        });
        // Cuando se completa la lectura del stream, finalizar la respuesta
        downloadStream.on("end", () => {
            res.end();
        });
        downloadStream.on("error", async (error) => {
            await errorSender({
                res,
                ex: error,
                defaultError: "No se encontró la imagen del usuario.",
                defaultStatus: 404,
            });
        });
    }
    catch (ex) {
        await errorSender({
            res,
            ex,
            defaultError: "Ocurrio un error al obtener imagen del usuario.",
        });
    }
};
export { createUserController, loginController, updateUserController, getSessionUserController, getUserImageController, uploadUsers, };
