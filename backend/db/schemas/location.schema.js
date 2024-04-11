import { Schema, model } from "mongoose";
import { ObjectId } from "mongodb";
const locationSchema = new Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    idUser: { type: ObjectId, ref: "user", required: true },
});
const LocationSchema = model("location", locationSchema);
export default LocationSchema;
