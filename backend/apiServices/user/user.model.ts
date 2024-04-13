import { Session } from "neo4j-driver";
import RideSchema from "../../db/schemas/ride.schema.js";
import UserSchema from "../../db/schemas/user.schema.js";
import Connection from "../../db_neo4j/connection.js";
import CustomError from "../../utils/customError.js";
import exists, { someExists } from "../../utils/exists.js";
import generateId from "../../utils/generateId.js";
import { createUserDto, createMultipleUsersDto } from "./user.dto.js";

const createManyUsers = async (users: { name: string, email: string, phone: string, password: string }[]) => {
	try {
		const operations = users.map((user) => ({
			insertOne: {
				document: user,
			},
		}));

		await UserSchema.bulkWrite(operations);
		return createMultipleUsersDto(users as any);
	} catch (ex: any) {
		const {err: WriteError} = ex.writeErrors[0];
		if (ex.code === 11000 && WriteError?.errmsg?.includes('email')) {
			throw new CustomError(`El email "${WriteError?.op?.email}" ya se encuentra registrado.`, 400);
		}
		throw ex;
	}

}

const verifyIfEmailAlreadyExists = async ({email, session}:{email:string, session:Session}) => {

        const result = await session.run(
            `MATCH (u:User)
            WHERE u.email = $email
            RETURN COUNT(u) AS count`,
            { email }
        );

        const count = result.records[0].get('count').toNumber();
        return count > 0;

}

const createUser = async ({
	name,
	email,
	phone,
	password,
	gender,
}: {
	name: string;
	email: string;
	phone: string;
	password: string;
	gender: string,
}): Promise<User> => {
	try {
		
		const session = Connection.driver.session();

		if((await verifyIfEmailAlreadyExists({email, session}))) throw new CustomError("El email ya se encuentra registrado.", 400)

		const id = generateId();
		const user = {name, email, phone, password, gender, id}
		await session.run(
			`CREATE (u:User:Passenger {name:$name, email:$email, phone:$phone, password:$password,
			gender:$gender, id:$id}) RETURN u`, user);

		await session.close();
		return user;

	} catch (ex: any) {
		if (ex.code === 11000 && ex.keyValue?.email !== undefined) {
			throw new CustomError("El email ya se encuentra registrado.", 400);
		}
		throw ex;
	}
};

const authenticate = async ({
	email,
	password,
}: {
	email: string;
	password: string;
}): Promise<User> => {
	const user = await UserSchema.findOne({ email, password }, { password: 0 });
	if (!user) throw new CustomError("Usuario o contraseña incorrectos.", 401);

	return createUserDto(user);
};

const updateUser = async ({
	id,
	name,
	email,
	phone,
	password,
}: {
	id: string;
	name?: string;
	email?: string;
	phone?: string;
	password?: string;
}): Promise<User> => {
	try {
		const user = await UserSchema.findById(id, { password: 0 });

		if (!user) throw new CustomError("No se encontró al usuario.", 404);

		if (name && exists(name)) user.name = name;
		if (email && exists(email)) user.email = email;
		if (phone && exists(phone)) user.phone = phone;
		if (password && exists(password)) user.password = password;

		if (someExists(name, email, phone, password)) await user.save();

		return createUserDto(user);
	} catch (ex: any) {
		if (ex.code === 11000 && ex.keyValue?.email !== undefined) {
			throw new CustomError("El email ya se encuentra registrado.", 400);
		}
		throw ex;
	}
};

const updateUserSubdocuments = async (user:User) => {
	
	const userObj = {...user, _id: user.id}
	await RideSchema.updateMany({"user._id": user.id}, {user:userObj})
	await RideSchema.updateMany(
		{},
		{ $set: { "passengers.$[elem]": userObj } },
  	{ arrayFilters: [{ "elem._id": user.id}] })
}

const getUserById = async ({ idUser }: { idUser: string }) => {
	try {
		const user = await UserSchema.findById(idUser, { password: 0 });

		return user;
	} catch (ex: any) {
		if (ex?.kind === "ObjectId") throw new CustomError("El id de la ubicación no es válido.", 400);
		throw ex;
	}
};

export { createUser, authenticate, updateUser, getUserById, createManyUsers, updateUserSubdocuments };
