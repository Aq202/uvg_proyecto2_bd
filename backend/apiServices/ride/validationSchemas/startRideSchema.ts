import yup from "yup";
export default yup.object().shape({
	comment: yup.string().nullable().required("El campo 'comment' es obligatorio."),
	waitTime: yup
		.number()
		.nullable()
		.typeError("El campo 'waitTime' debe ser un número.")
		.integer("El campo 'waitTime' debe ser un número entero.")
		.min(0, "El campo 'waitTime' debe ser un número entero mayor o igual que 0.")
		.required("El campo 'waitTime' es obligatorio."),
	inAHurry: yup
		.boolean()
		.nullable()
		.typeError("El campo 'inAHurry' debe ser booleano.")
		.required("El campo 'inAHurry' es obligatorio."),
	wantsToTalk: yup
		.boolean()
		.nullable()
		.typeError("El campo 'wantsToTalk' debe ser booleano.")
		.required("El campo 'wantsToTalk' es obligatorio."),
	idRide: yup.string().nullable().required("El campo 'idRide' es obligatorio."),
});
