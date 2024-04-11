import multer from "multer";
import CustomError from "../../utils/customError.js";

const storage = multer.diskStorage({
	destination(req, file, callback) {
		// @ts-ignore
		callback(null, `${global.dirname}/files`);
	},

	filename(req: AppRequest, file, callback) {
		const newFilename = `${Date.now()}-${file.originalname}`;

		// guardar datos de archivo en req header
		const data = { fileName: newFilename, type: file.mimetype.split("/")[1] };
		if (!Array.isArray(req.uploadedFiles)) {
			req.uploadedFiles = [data];
		} else req.uploadedFiles.push(data);

		callback(null, newFilename);
	},
});

const fileFilter = (req: AppRequest, file: any, callback: Function) => {
	// Check if the file type is an image
	if (
		file.mimetype === "image/jpeg" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/png" ||
		file.mimetype === "image/svg"
	) {
		callback(null, true); // Accept the file
	} else {
		callback(new CustomError("Solo se permiten formatos de imagen JPEG, JPG, PNG y SVG.", 400)); // Reject the file
	}
};

const limits = {
	fileSize: 1000000, // archivos de máximo 1 MB
};

export default multer({ storage, fileFilter, limits });
