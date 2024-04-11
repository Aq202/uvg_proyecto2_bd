import yup from "yup";
import validateId from "../../../utils/validateId.js";
export default yup.object().shape({
    vehicleColor: yup.string().required("El campo 'vehicleColor' es obligatorio."),
    vehicleIdentification: yup.string().required("El campo 'vehicleIdentification' es obligatorio."),
    vehicleType: yup.string().required("El campo 'vehicleType' es obligatorio."),
    datetime: yup
        .date()
        .nullable()
        .typeError("El campo 'datetime' debe ser en formato fecha.")
        .required("El campo 'datetime' es obligatorio."),
    idArrivalLocation: yup
        .string()
        .nullable()
        .required("El campo 'idArrivalLocation' es obligatorio.")
        .test("validate-id", "El id de la ubicación de llegada no es un id válido.", (id) => validateId(id)),
    idStartLocation: yup
        .string()
        .nullable()
        .required("El campo 'idStartLocation' es obligatorio.")
        .test("validate-id", "El id de la ubicación de salida no es un id válido.", (id) => validateId(id)),
});
