import yup from "yup";
export default yup.object().shape({

	remainingSpaces:yup
	.number()
	.nullable()
	.typeError("El campo 'remainingSpaces' debe ser un número.")
	.integer("El campo 'remainingSpaces' debe ser un número entero.")
	.min(0, "El campo 'remainingSpaces' debe ser un número entero mayor o igual que 0.")
	.required("El campo 'remainingSpaces' es obligatorio."),
	allowsMusic: yup.boolean().nullable().typeError("El campo 'allowsMusic' debe ser un valor booleano.").required("El campo 'allowsMusic' es obligatorio."),
	allowsLuggage: yup.boolean().nullable().typeError("El campo 'allowsLuggage' debe ser un valor booleano.").required("El campo 'allowsLuggage' es obligatorio."),
	vehicleId: yup.string().required("El campo 'vehicleId' es obligatorio."),
	start: yup.string().required("El campo 'start' es obligatorio."),
	arrival: yup.string().required("El campo 'arrival' es obligatorio."),
	date: yup
		.date()
		.nullable()
		.typeError("El campo 'date' debe ser en formato fecha.")
		.required("El campo 'date' es obligatorio."),
	idArrivalLocation: yup
		.string()
		.nullable()
		.required("El campo 'idArrivalLocation' es obligatorio."),
	idStartLocation: yup
		.string()
		.nullable()
		.required("El campo 'idStartLocation' es obligatorio.")

});
