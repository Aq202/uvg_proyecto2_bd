import yup from "yup";
export default yup.object().shape({

	rating:yup
	.number()
	.nullable()
	.typeError("El campo 'rating' debe ser un número.")
	.integer("El campo 'rating' debe ser un número entero.")
	.min(0, "El campo 'rating' debe ser un número entero mayor o igual que 0.")
	.max(5, "El campo 'rating' debe ser un número entero menor o igual que 5.")
	.required("El campo 'rating' es obligatorio."),
	idRide: yup
		.string()
		.nullable()
		.required("El campo 'idRide' es obligatorio.")

});
