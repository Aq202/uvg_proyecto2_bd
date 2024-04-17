import yup from "yup";

export default yup.object().shape({
	urbanArea: yup
		.boolean()
		.nullable()
		.typeError("El campo 'urbanArea' debe tener un valor booleano."),
	dangerArea: yup
		.boolean()
		.nullable()
		.typeError("El campo 'dangerArea' debe tener un valor booleano."),
	parking: yup
		.boolean()
		.nullable()
		.typeError("El campo 'parking' debe tener un valor booleano."),
	idLocation: yup
		.string()
		.nullable()
		.required("El campo 'idLocation' es obligatorio.")
});
