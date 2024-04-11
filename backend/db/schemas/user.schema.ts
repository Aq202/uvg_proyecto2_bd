import { Schema, model } from "mongoose";
import { ObjectId } from "mongodb";

const userSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	phone: { type: String, required: true },
	password: { type: String, required: true },
});

const userSubSchema = new Schema({
	_id: { type: ObjectId, ref: "user", required: true },
	name: { type: String, required: true },
	email: { type: String, required: true },
	phone: { type: String, required: true },
});

const UserSchema = model("user", userSchema);
export default UserSchema;
export { userSubSchema };
