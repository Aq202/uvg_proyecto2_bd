import yup from "yup";
export default yup.object().shape({

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
