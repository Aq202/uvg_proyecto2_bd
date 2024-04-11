import express from "express";
import ensureAuth from "../../middlewares/ensureAuth.js";
import validateBody from "../../middlewares/validateBody.js";
import createLocationSchema from "./validationSchemas/createLocationSchema.js";
import {
	createLocationController,
	deleteLocationController,
	getCitiesListController,
	getCountriesListController,
	getLocationsController,
	updateLocationController,
} from "./location.controller.js";
import updateLocationSchema from "./validationSchemas/updateLocationSchema.js";

const locationRouter = express.Router();

locationRouter.post("", ensureAuth, validateBody(createLocationSchema), createLocationController);
locationRouter.patch("", ensureAuth, validateBody(updateLocationSchema), updateLocationController);
locationRouter.delete("/:idLocation", ensureAuth, deleteLocationController);
locationRouter.get("/", ensureAuth, getLocationsController);
locationRouter.get("/countries", ensureAuth, getCountriesListController);
locationRouter.get("/cities", ensureAuth, getCitiesListController);
export default locationRouter;
