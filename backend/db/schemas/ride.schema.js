import { Schema, model } from "mongoose";
import { ObjectId } from "mongodb";
import { userSubSchema } from "./user.schema.js";
const rideSchema = new Schema({
    startLocation: { type: ObjectId, ref: "location", required: true },
    arrivalLocation: { type: ObjectId, ref: "location", required: true },
    user: { type: userSubSchema, required: true },
    passengers: { type: [userSubSchema] },
    num_passengers: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    datetime: { type: Date, required: true },
    vehicle: {
        type: { type: String, required: true },
        identification: { type: String, required: true },
        color: { type: String, required: true },
    },
});
const RideSchema = model("ride", rideSchema);
export default RideSchema;
