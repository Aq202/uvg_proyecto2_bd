import yup from "yup";

export default yup.object().shape({
	address: yup.string().required("El campo 'address' es obligatorio."),
	city: yup.string().required("El campo 'city' es obligatorio."),
	country: yup.string().required("El campo 'country' es obligatorio."),
	name: yup.string().required("El campo 'name' es obligatorio."),
});
