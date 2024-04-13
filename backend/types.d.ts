type User = {
	name: string;
	email: string;
	phone: string;
	id: string;
	gender?: string;
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


type City = {
	id: string,
	name: string;
	longitude: string;
	latitude: string;
	country: string;
}

type AppLocation = {
	name: string;
	address: string;
	parking: boolean;
	openTime: string;
	closeTime: string;
	city:City;
	distance_from_city_center: string;
	danger_area: boolean;
	urban_area: boolean;
} | {
	id: ObjectId;
	name: String;
	country: String;
	city: String;
	address: String;
	idUser: String;
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

type OwnsRelation = {
	since: Date | string;
	stillOwner: boolean;
	price: number;
};

type Vehicle = {
	type: string;
	identification: string;
	color: string;
	brand?: string;
	model?: string;
	year?: number;
	relation?: OwnsRelation;
};



