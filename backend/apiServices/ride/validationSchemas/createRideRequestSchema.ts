import yup from "yup";
export default yup.object().shape({

	message: yup
		.string()
		.nullable()
		.required("El campo 'message' es obligatorio."),
	idRide: yup
		.string()
		.nullable()
		.required("El campo 'idRide' es obligatorio.")

});
