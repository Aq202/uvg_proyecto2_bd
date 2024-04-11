import yup from "yup";

export default yup.object().shape({
	password: yup.string().required("El campo 'password' es obligatorio."),
	phone: yup.string().required("El campo 'phone' es obligatorio."),
	email: yup
		.string()
		.nullable()
		.email("El valor de 'email' no posee el formato de una email válido.")
		.required("El campo 'email' es obligatorio."),
	name: yup.string().required("El campo 'name' es obligatorio."),
});
