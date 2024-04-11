import yup from "yup";
import validateId from "../../../utils/validateId.js";

export default yup.object().shape({
	id: yup
		.string()
		.nullable()
		.required("El campo 'id' es obligatorio.")
		.test("validate-id", "El id de la ubicación no es un id válido.", (id) => validateId(id)),
});
