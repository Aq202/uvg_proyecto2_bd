const createUserDto = (resource) => {
    var _a, _b, _c;
    const { name, email, phone } = (_a = resource === null || resource === void 0 ? void 0 : resource._doc) !== null && _a !== void 0 ? _a : resource;
    return {
        id: (_c = (_b = resource === null || resource === void 0 ? void 0 : resource._id) === null || _b === void 0 ? void 0 : _b.valueOf()) !== null && _c !== void 0 ? _c : resource.id,
        name,
        email,
        phone,
    };
};
const createMultipleUsersDto = (resources) => resources === null || resources === void 0 ? void 0 : resources.map((resource) => createUserDto(resource));
export { createUserDto, createMultipleUsersDto };
