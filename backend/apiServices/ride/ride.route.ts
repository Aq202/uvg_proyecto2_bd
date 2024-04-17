import express from "express";
import ensureAuth from "../../middlewares/ensureAuth.js";
import {
	addPassengerCommentController,
	assignUserToRideController,
	completePassengerParticipationController,
	createRideController,
	createRideRequestController,
	deleteAllUserRidesController,
	deleteRideController,
	finishRideController,
	getRideController,
	getRidesController,
	getTopUsersWithMostCompletedRidesController,
	removeUserFromRideController,
	startRideController,
} from "./ride.controller.js";
import validateBody from "../../middlewares/validateBody.js";
import createRideSchema from "./validationSchemas/createRideSchema.js";
import createRideRequestSchema from "./validationSchemas/createRideRequestSchema.js";
import commentRideSchema from "./validationSchemas/commentRideSchema.js";
import completePassengerSchema from "./validationSchemas/completePassengerSchema.js";
import startRideSchema from "./validationSchemas/startRideSchema.js";
import finishRideSchema from "./validationSchemas/finishRideSchema.js";

const rideRouter = express.Router();

rideRouter.post("/", ensureAuth, validateBody(createRideSchema), createRideController);
rideRouter.get("/", ensureAuth, getRidesController);
rideRouter.get("/:idRide", ensureAuth, getRideController);
rideRouter.post("/:idRide/assign/:idUser", ensureAuth, assignUserToRideController);
rideRouter.delete("/", ensureAuth, deleteAllUserRidesController);
rideRouter.delete("/:idRide", ensureAuth, deleteRideController);
rideRouter.delete("/:idRide/assignment", ensureAuth, removeUserFromRideController);
rideRouter.get("/user/top", ensureAuth, getTopUsersWithMostCompletedRidesController);
rideRouter.post("/request", ensureAuth, validateBody(createRideRequestSchema), createRideRequestController);
rideRouter.post("/comment", ensureAuth, validateBody(commentRideSchema), addPassengerCommentController);
rideRouter.post("/passenger/complete", ensureAuth, validateBody(completePassengerSchema), completePassengerParticipationController);
rideRouter.patch("/start", ensureAuth, validateBody(startRideSchema), startRideController);
rideRouter.patch("/finish", ensureAuth, validateBody(finishRideSchema), finishRideController);

export default rideRouter;
