type User = {
	name: string;
	email: string;
	phone: string;
	id: string;
};

type UploadedFile = {
	fileName: string;
	type: string;
};

type session = {
	session?: User;
	uploadedFiles?: UploadedFile[];
};

type AppRequest = session & Record<string, any>;

type AppResponse = Record<string, any>;

type AppLocation = {
	id: ObjectId;
	name: String;
	country: String;
	city: String;
	address: String;
	idUser: String;
};

type Vehicle = {
	type: string;
	identification: string;
	color: string;
};

type Ride = {
	id: string;
	startLocation: AppLocation | string;
	arrivalLocation: AppLocation | string;
	user: User;
	passengers: User[];
	completed: boolean;
	datetime: Date;
	vehicle: Vehicle;
	isPassenger?: boolean;
	isDriver?: boolean;
};
