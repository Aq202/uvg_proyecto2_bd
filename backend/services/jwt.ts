import jwt from "jsonwebtoken";
import config from "config";

const key: string = config.get("jwtKey");

const signToken = ({ id, name, email, phone }: User) =>
	jwt.sign(
		{
			id,
			name,
			email,
			phone,
		},
		key
	);

const validateToken = (token: string): User => {
	const payload: any = jwt.verify(token, key);
	const { id, name, email, phone } = payload;
	return { id, name, email, phone };
};

export { signToken, validateToken };
