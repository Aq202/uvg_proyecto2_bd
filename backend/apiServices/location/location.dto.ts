const createLocationDto = (resource: any): AppLocation => {
	const { name, country, city, address, idUser } = resource?._doc ?? resource;
	return {
		id: resource?._id?.valueOf() ?? resource.id,
		name,
		country,
		city,
		address,
		idUser,
	};
};

const createMultipleLocationsDto = (resources: any[]) =>
	resources?.map((resource) => createLocationDto(resource));

export { createLocationDto, createMultipleLocationsDto };
