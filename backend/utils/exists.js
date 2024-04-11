/**
 * Función para verificar que una o varios valores no sean undefined o null.
 * @param val valores a verificar.
 * @returns bool
 */
const exists = (...values) => values === null || values === void 0 ? void 0 : values.every((val) => val !== undefined && val !== null);
/**
 * Función para verificar que alguno de los valores no sean undefined o null.
 * @param val valores a verificar.
 * @returns bool
 */
const someExists = (...values) => values === null || values === void 0 ? void 0 : values.some((val) => val !== undefined && val !== null);
export default exists;
export { someExists };
