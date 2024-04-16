import yup from "yup";
export default yup.object().shape({
	comment: yup.string().nullable().required("El campo 'comment' es obligatorio."),
	onTime: yup
		.boolean()
		.nullable()
		.typeError("El campo 'onTime' debe ser booleano.")
		.required("El campo 'onTime' es obligatorio."),
	idRide: yup.string().nullable().required("El campo 'idRide' es obligatorio."),
});
