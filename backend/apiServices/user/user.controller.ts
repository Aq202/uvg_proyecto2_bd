import { signToken } from "../../services/jwt.js";
import errorSender from "../../utils/errorSender.js";
import exists from "../../utils/exists.js";
import { authenticate, createManyUsers, createUser, updateUser, updateUserSubdocuments } from "./user.model.js";
import hash from "hash.js";
import { connection } from "../../db/connection.js";
import { GridFSBucket } from "mongodb";


const createUserController = async (req: AppRequest, res: AppResponse) => {
	const { name, email, phone, password, gender } = req.body;

	try {

		const passwordHash = hash.sha256().update(password).digest("hex");
		const user = await createUser({ name, email, phone, password: passwordHash, gender });

		res.send(user);
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al crear nuevo usuario.",
		});
	}
};

const updateUserController = async (req: AppRequest, res: AppResponse) => {
	const { name, email, phone, password } = req.body;

	if (!req.session) return;
	const id: string = req.session?.id;

	try {
		const passwordHash = exists(password)
			? hash.sha256().update(password).digest("hex")
			: undefined;

		const user = await updateUser({ id, name, email, phone, password: passwordHash });

		// Actualizar documentos embedded
		await updateUserSubdocuments(user)

		res.send(user);
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al crear nuevo usuario.",
		});
	}
};

const loginController = async (req: AppRequest, res: AppResponse) => {
	const { email, password } = req.body;

	try {
		const passwordHash = hash.sha256().update(password).digest("hex");
		const user = await authenticate({ email, password: passwordHash });

		const result = {
			...user,
			token: signToken(user),
		};

		res.send(result);
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al iniciar sesión.",
		});
	}
};

const getSessionUserController = async (req: AppRequest, res: AppResponse) => {
	try {
		if (!req.session) return;
		const user = req.session;
		res.send(user);
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al obtener datos de usuario.",
		});
	}
};

const uploadUsers = async (req: AppRequest, res: AppResponse) => {
	const { data } = req.body;
	try {
		const users = data.map((user: { name: string, email: string, phone: string, password: string }) => ({
			name: user.name,
			email: user.email,
			phone: user.phone,
			password: hash.sha256().update(user.password).digest("hex"),
		}))

		const createdUsers = await createManyUsers(users);

		res.send(createdUsers);
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al importar usuarios.",
		});
	}
}

const getUserImageController = async (req: AppResponse, res: AppRequest) => {
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
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al obtener imagen del usuario.",
		});
	}
};
export {
	createUserController,
	loginController,
	updateUserController,
	getSessionUserController,
	getUserImageController,
	uploadUsers,
};
