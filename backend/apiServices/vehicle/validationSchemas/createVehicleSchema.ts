import yup from "yup";

export default yup.object().shape({
	price: yup
    .number()
    .nullable()
		.typeError("El campo 'price' debe ser un número.")
    .min(0, "El campo 'price' debe ser un número mayor que 0.")
		.required("El campo 'price' es obligatorio."),
	stillOwner: yup.boolean().nullable().typeError("El campo 'stillOwner' debe ser una fecha.").required("El campo 'stillOwner' es obligatorio."),
	since: yup.date().nullable().typeError("El campo 'since' debe ser una fecha.").required("El campo 'since' es obligatorio."),
	year: yup
    .number()
    .nullable()
		.typeError("El campo 'year' debe ser un número.")
    .integer("El campo 'year' debe ser un número entero.")
    .min(1900, "El campo 'year' debe ser un número entero mayor que 1900.")
    .max(2100, "El campo 'year' debe ser un número entero menor que 2100.")
		.required("El campo 'year' es obligatorio."),
	model: yup.string().required("El campo 'model' es obligatorio."),
	brand: yup.string().required("El campo 'brand' es obligatorio."),
	color: yup.string().required("El campo 'color' es obligatorio."),
	identification: yup.string().required("El campo 'identification' es obligatorio."),
	type: yup.string().required("El campo 'type' es obligatorio."),
});
