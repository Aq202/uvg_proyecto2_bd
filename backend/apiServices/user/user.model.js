import RideSchema from "../../db/schemas/ride.schema.js";
import UserSchema from "../../db/schemas/user.schema.js";
import CustomError from "../../utils/customError.js";
import exists, { someExists } from "../../utils/exists.js";
import { createUserDto, createMultipleUsersDto } from "./user.dto.js";
const createManyUsers = async (users) => {
    var _a, _b;
    try {
        const operations = users.map((user) => ({
            insertOne: {
                document: user,
            },
        }));
        await UserSchema.bulkWrite(operations);
        return createMultipleUsersDto(users);
    }
    catch (ex) {
        const { err: WriteError } = ex.writeErrors[0];
        if (ex.code === 11000 && ((_a = WriteError === null || WriteError === void 0 ? void 0 : WriteError.errmsg) === null || _a === void 0 ? void 0 : _a.includes('email'))) {
            throw new CustomError(`El email "${(_b = WriteError === null || WriteError === void 0 ? void 0 : WriteError.op) === null || _b === void 0 ? void 0 : _b.email}" ya se encuentra registrado.`, 400);
        }
        throw ex;
    }
};
const createUser = async ({ name, email, phone, password, }) => {
    var _a;
    try {
        const user = new UserSchema();
        user.name = name;
        user.email = email;
        user.phone = phone;
        user.password = password;
        await user.save();
        return createUserDto(user);
    }
    catch (ex) {
        if (ex.code === 11000 && ((_a = ex.keyValue) === null || _a === void 0 ? void 0 : _a.email) !== undefined) {
            throw new CustomError("El email ya se encuentra registrado.", 400);
        }
        throw ex;
    }
};
const authenticate = async ({ email, password, }) => {
    const user = await UserSchema.findOne({ email, password }, { password: 0 });
    if (!user)
        throw new CustomError("Usuario o contraseña incorrectos.", 401);
    return createUserDto(user);
};
const updateUser = async ({ id, name, email, phone, password, }) => {
    var _a;
    try {
        const user = await UserSchema.findById(id, { password: 0 });
        if (!user)
            throw new CustomError("No se encontró al usuario.", 404);
        if (name && exists(name))
            user.name = name;
        if (email && exists(email))
            user.email = email;
        if (phone && exists(phone))
            user.phone = phone;
        if (password && exists(password))
            user.password = password;
        if (someExists(name, email, phone, password))
            await user.save();
        return createUserDto(user);
    }
    catch (ex) {
        if (ex.code === 11000 && ((_a = ex.keyValue) === null || _a === void 0 ? void 0 : _a.email) !== undefined) {
            throw new CustomError("El email ya se encuentra registrado.", 400);
        }
        throw ex;
    }
};
const updateUserSubdocuments = async (user) => {
    const userObj = Object.assign(Object.assign({}, user), { _id: user.id });
    await RideSchema.updateMany({ "user._id": user.id }, { user: userObj });
    await RideSchema.updateMany({}, { $set: { "passengers.$[elem]": userObj } }, { arrayFilters: [{ "elem._id": user.id }] });
};
const getUserById = async ({ idUser }) => {
    try {
        const user = await UserSchema.findById(idUser, { password: 0 });
        return user;
    }
    catch (ex) {
        if ((ex === null || ex === void 0 ? void 0 : ex.kind) === "ObjectId")
            throw new CustomError("El id de la ubicación no es válido.", 400);
        throw ex;
    }
};
export { createUser, authenticate, updateUser, getUserById, createManyUsers, updateUserSubdocuments };
