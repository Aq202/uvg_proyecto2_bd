import { ObjectId } from "mongodb";

const validateId = (id: string | undefined | null) => {
	try {
		if (id === undefined || id === null) return false;
		if (new ObjectId(id).toString() === id?.toString()) return true;
	} catch (ex) {
		// err
	}
	return false;
};

export default validateId;
