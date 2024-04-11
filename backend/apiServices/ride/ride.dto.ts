import { createLocationDto } from "../location/location.dto.js";
import { createMultipleUsersDto, createUserDto } from "../user/user.dto.js";

const createRideDto = (resource: any): Ride => {
	const {
		startLocation,
		arrivalLocation,
		user,
		passengers,
		completed,
		datetime,
		vehicle,
		isPassenger,
		isDriver,
	} = resource?._doc ?? resource;
	return {
		id: resource?._id?.valueOf() ?? resource.id,
		startLocation:
			typeof startLocation === "string" ? startLocation : createLocationDto(startLocation),
		arrivalLocation:
			typeof arrivalLocation === "string" ? arrivalLocation : createLocationDto(arrivalLocation),
		user: createUserDto(user),
		passengers: passengers ? createMultipleUsersDto(passengers) : [],
		completed: completed,
		datetime,
		vehicle,
		isPassenger,
		isDriver,
	};
};

const createMultipleRidesDto = (resources: any[]) =>
	resources?.map((resource) => createRideDto(resource));

export { createRideDto, createMultipleRidesDto };
