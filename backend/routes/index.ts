import express from "express";
import consts from "../utils/consts.js";
import userRouter from "../apiServices/user/user.route.js";
import locationRouter from "../apiServices/location/location.route.js";
import rideRouter from "../apiServices/ride/ride.route.js";
import vehicleRouter from "../apiServices/vehicle/vehicle.route.js";

const router = express.Router();

const { apiPath } = consts;

router.use(`${apiPath}/user`, userRouter);
router.use(`${apiPath}/location`, locationRouter);
router.use(`${apiPath}/ride`, rideRouter);
router.use(`${apiPath}/vehicle`, vehicleRouter);

// router.get('*', (req, res) => {
//   res.sendFile(`${global.dirname}/public/index.html`);
// });
export default router;
