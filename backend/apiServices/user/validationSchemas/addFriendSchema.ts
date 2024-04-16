import yup from "yup";
export default yup.object().shape({

	closeLevel:yup
	.number()
	.nullable()
	.typeError("El campo 'closeLevel' debe ser un número.")
	.integer("El campo 'closeLevel' debe ser un número entero.")
	.min(0, "El campo 'closeLevel' debe ser un número entero mayor o igual que 0.")
	.max(5, "El campo 'closeLevel' debe ser un número entero menor o igual que 5.")
	.required("El campo 'closeLevel' es obligatorio."),
	relation: yup
		.string()
		.nullable()
		.required("El campo 'relation' es obligatorio."),
	idUser: yup
		.string()
		.nullable()
		.required("El campo 'idUser' es obligatorio.")

});
