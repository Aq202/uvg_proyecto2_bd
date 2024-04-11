import { ObjectId } from "mongodb";
const validateId = (id) => {
    try {
        if (id === undefined || id === null)
            return false;
        if (new ObjectId(id).toString() === (id === null || id === void 0 ? void 0 : id.toString()))
            return true;
    }
    catch (ex) {
        // err
    }
    return false;
};
export default validateId;
