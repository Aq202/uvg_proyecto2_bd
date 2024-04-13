import yup from "yup";

export default yup.object().shape({
	urbanArea: yup
		.boolean()
		.nullable()
		.typeError("El campo 'urbanArea' debe tener un valor booleano.")
		.required("El campo 'urbanArea' es obligatorio."),
	dangerArea: yup
		.boolean()
		.nullable()
		.typeError("El campo 'dangerArea' debe tener un valor booleano.")
		.required("El campo 'dangerArea' es obligatorio."),
	parking: yup
		.boolean()
		.nullable()
		.typeError("El campo 'parking' debe tener un valor booleano.")
		.required("El campo 'parking' es obligatorio."),
	distanceFromCityCenter: yup
		.string()
		.required("El campo 'distanceFromCityCenter' es obligatorio."),
	cityId: yup.string().required("El campo 'cityId' es obligatorio."),
	closeTime: yup.string().required("El campo 'closeTime' es obligatorio."),
	openTime: yup.string().required("El campo 'openTime' es obligatorio."),
	address: yup.string().required("El campo 'address' es obligatorio."),
	name: yup.string().required("El campo 'name' es obligatorio."),
});
