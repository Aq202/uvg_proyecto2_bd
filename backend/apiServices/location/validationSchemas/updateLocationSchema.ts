import yup from "yup";

export default yup.object().shape({
	parking: yup
		.boolean()
		.nullable()
		.typeError("El campo 'parking' debe tener un valor booleano."),
	idLocation: yup
		.string()
		.nullable()
		.required("El campo 'idLocation' es obligatorio.")
});
