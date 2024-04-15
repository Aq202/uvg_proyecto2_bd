import yup from "yup";
export default yup.object().shape({

	comment: yup
		.string()
		.nullable()
		.required("El campo 'comment' es obligatorio."),
	idRide: yup
		.string()
		.nullable()
		.required("El campo 'idRide' es obligatorio.")

});
