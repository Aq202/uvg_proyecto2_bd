import express from "express";
import ensureAuth from "../../middlewares/ensureAuth.js";
import validateBody from "../../middlewares/validateBody.js";
import createLocationSchema from "./validationSchemas/createLocationSchema.js";
import {
	addContinentToCitiesController,
	assignHomeController,
	createCityController,
	createLocationController,
	deleteContinentFromCitiesController,
	deleteLocationController,
	getCitiesListController,
	getCountriesListController,
	getLocationsController,
	updateCountryNameController,
	updateLocationController,
} from "./location.controller.js";
import updateLocationSchema from "./validationSchemas/updateLocationSchema.js";
import createCitySchema from "./validationSchemas/createCitySchema.js";
import assignHomeSchema from "./validationSchemas/assignHomeSchema.js";

const locationRouter = express.Router();

locationRouter.post("/city", ensureAuth, validateBody(createCitySchema), createCityController)
locationRouter.post("", ensureAuth, validateBody(createLocationSchema), createLocationController);
locationRouter.patch("", ensureAuth, validateBody(updateLocationSchema), updateLocationController);
locationRouter.delete("/continent", ensureAuth, deleteContinentFromCitiesController);
locationRouter.delete("/:idLocation", ensureAuth, deleteLocationController);
locationRouter.get("/", ensureAuth, getLocationsController);
locationRouter.get("/countries", ensureAuth, getCountriesListController);
locationRouter.get("/cities", ensureAuth, getCitiesListController);
locationRouter.post("/home", ensureAuth, validateBody(assignHomeSchema), assignHomeController);
locationRouter.patch("/continent", ensureAuth, addContinentToCitiesController);
locationRouter.patch("/countryName", ensureAuth, updateCountryNameController);

export default locationRouter;
