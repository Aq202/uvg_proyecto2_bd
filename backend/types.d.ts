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
	id:string;
	name: string;
	address: string;
	parking: boolean;
	openTime: string;
	closeTime: string;
} | {
	id: ObjectId;
	name: String;
	country: String;
	city: String;
	address: String;
	idUser: String;
};

type Ride = {
	id: string
	date: Date,
	completed: boolean,
	arrival: string;
	start: string;
}|
{
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

type LocatedAtRel = {
	distanceFromCityCenter?: string;
	dangerArea?: boolean;
	urbanArea?: boolean;
}

type DrivesRel = {
	wantsToTalk: boolean;
	inAHurry: boolean;
	onMyWay: boolean;
}

type IsPassengerRel = {
	completed: boolean;
	comments: string[];
	rating: number;
}

type AsksRel = {
	date: string;
	approved: boolean;
	message: string;
}

type HasRel = {
	remainingSpaces: number;
	allowsMusic: boolean;
	allowsLuggage: boolean;
}

type StartsRel = {
	realStartTime: string;
	waitTime: number;
	comment: string;
}

type AddressedToRel = {
	realArrivalTime: string;
	onTime: boolean;
	comment: string;
}



