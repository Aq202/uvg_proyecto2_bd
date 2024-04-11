const createLocationDto = (resource) => {
    var _a, _b, _c;
    const { name, country, city, address, idUser } = (_a = resource === null || resource === void 0 ? void 0 : resource._doc) !== null && _a !== void 0 ? _a : resource;
    return {
        id: (_c = (_b = resource === null || resource === void 0 ? void 0 : resource._id) === null || _b === void 0 ? void 0 : _b.valueOf()) !== null && _c !== void 0 ? _c : resource.id,
        name,
        country,
        city,
        address,
        idUser,
    };
};
const createMultipleLocationsDto = (resources) => resources === null || resources === void 0 ? void 0 : resources.map((resource) => createLocationDto(resource));
export { createLocationDto, createMultipleLocationsDto };
