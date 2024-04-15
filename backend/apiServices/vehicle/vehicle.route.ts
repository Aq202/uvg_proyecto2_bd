import express from "express";
import validateBody from "../../middlewares/validateBody.js";
import createVehicleSchema from "./validationSchemas/createVehicleSchema.js";
import ensureAuth from "../../middlewares/ensureAuth.js";
import { createVehicleController, getUserVehiclesController } from "./vehicle.controller.js";
const vehicleRouter = express.Router();

vehicleRouter.post("/", ensureAuth, validateBody(createVehicleSchema), createVehicleController)
vehicleRouter.get("/", ensureAuth, getUserVehiclesController)

export default vehicleRouter;
