import { NextFunction } from "express";
import { AnyObject } from "yup";
import deleteFiles from "../utils/deleteFiles.js"

const validateBody = (...schemas:[AnyObject]) => async (req:AppRequest, res:AppResponse, next:NextFunction) => {
  try {
    await Promise.all(schemas?.map((schema:any) => schema.validate(req.body)));
    return next();
  } catch (err:any) {
    if (req.uploadedFiles) deleteFiles(req.uploadedFiles); // Eliminar archivos temporales

    res.statusMessage = err.message;
    return res.status(400).send({ err: err.message, status: 400, ok: false });
  }
};

export default validateBody;
