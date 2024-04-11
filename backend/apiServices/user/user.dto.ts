const createUserDto = (resource: any): User => {
	const { name, email, phone } = resource?._doc ?? resource;
	return {
		id: resource?._id?.valueOf() ?? resource.id,
		name,
		email,
		phone,
	};
};

const createMultipleUsersDto = (resources: [any]) => resources?.map((resource) => createUserDto(resource));

export { createUserDto, createMultipleUsersDto };
