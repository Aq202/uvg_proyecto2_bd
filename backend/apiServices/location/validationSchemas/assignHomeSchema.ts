import yup from "yup";

export default yup.object().shape({
	livesAlone: yup
		.boolean()
		.nullable()
		.typeError("El campo 'livesAlone' debe tener un valor booleano.")
		.required("El campo 'livesAlone' es obligatorio."),
	isOwner: yup
		.boolean()
		.nullable()
		.typeError("El campo 'isOwner' debe tener un valor booleano.")
		.required("El campo 'isOwner' es obligatorio."),
	postalCode: yup
		.number()
		.nullable()
		.typeError("El campo 'postalCode' debe ser un número.")
		.integer("El campo 'postalCode' debe ser un número entero.")
		.required("El campo 'postalCode' es obligatorio."),
	idLocation: yup.string().required("El campo 'idLocation' es obligatorio."),
});
