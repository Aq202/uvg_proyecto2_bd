import express from "express";
import {
	addFriendController,
	createUserController,
	getSessionUserController,
	getUserImageController,
	loginController,
	updateUserController,
	uploadUsers,
} from "./user.controller.js";
import validateBody from "../../middlewares/validateBody.js";
import createUserSchema from "./validationSchemas/createUserSchema.js";
import loginSchema from "./validationSchemas/loginSchema.js";
import ensureAuth from "../../middlewares/ensureAuth.js";
import updateUserSchema from "./validationSchemas/updateUserSchema.js";
import multerMiddleware from "../../middlewares/multerMiddleware.js";
import uploadImage from "../../services/uploadFiles/uploadImage.js";
import addFriendSchema from "./validationSchemas/addFriendSchema.js";
const userRouter = express.Router();

userRouter.post("/", multerMiddleware(uploadImage.single("photo")), validateBody(createUserSchema), createUserController);
userRouter.post("/upload", ensureAuth, uploadUsers);
userRouter.post("/login", validateBody(loginSchema), loginController);
userRouter.patch("/", ensureAuth, validateBody(updateUserSchema), updateUserController);
userRouter.get("/", ensureAuth, getSessionUserController);
userRouter.get("/:idUser/image", getUserImageController);
userRouter.post("/addFriend", ensureAuth, validateBody(addFriendSchema), addFriendController);
export default userRouter;
