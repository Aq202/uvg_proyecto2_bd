import yup from "yup";

export default yup.object().shape({
	country: yup.string().required("El campo 'country' es obligatorio."),
	latitude: yup.string().required("El campo 'latitude' es obligatorio."),
	longitude: yup.string().required("El campo 'longitude' es obligatorio."),
	name: yup.string().required("El campo 'name' es obligatorio."),
});
