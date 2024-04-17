import RideSchema from "../../db/schemas/ride.schema.js";
import consts from "../../utils/consts.js";
import CustomError from "../../utils/customError.js";
import Connection from "../../db_neo4j/connection.js";
import generateId from "../../utils/generateId.js";
import exists from "../../utils/exists.js";

const createRide = async ({
	idStartLocation,
	idArrivalLocation,
	userId,
	date,
	arrival,
	start,
	vehicleId,
	remainingSpaces,
	allowsMusic,
	allowsLuggage,
}: {
	idStartLocation: string;
	idArrivalLocation: string;
	userId: string;
	date: Date;
	arrival: string;
	start: string;
	vehicleId: string;
	remainingSpaces: number;
	allowsMusic: boolean;
	allowsLuggage: boolean;
}) => {
	const session = Connection.driver.session();

	const rideId = generateId();
	const result = await session.run(
		`	MATCH (u:User {id:$userId})
			MATCH (v:Vehicle {identification:$vehicleId})
			MATCH (sl:Location {id:$idStartLocation})
			MATCH (al:Location {id:$idArrivalLocation})
			CREATE (d:Ride {id:$rideId, date:$date, arrival:$arrival, completed:$completed,start:$start})
			CREATE (u)-[:drives {onMyWay:false}]->(d)
			CREATE (d)-[:starts]->(sl)
			CREATE (d)-[:addressed_to]->(al)
			CREATE (d)-[:has {remainingSpaces:$remainingSpaces, allowsMusic:$allowsMusic, allowsLuggage:$allowsLuggage}]->(v)
			SET u:Driver
			RETURN u as user, v as vehicle, sl as startLocation, al as arrivalLocation`,
		{
			userId,
			vehicleId,
			idStartLocation,
			idArrivalLocation,
			rideId,
			date,
			arrival,
			completed: false,
			start,
			remainingSpaces,
			allowsMusic,
			allowsLuggage,
		}
	);

	if (result.records.length === 0) throw new CustomError("No se pudo crear el viaje.", 400);

	await session.close();
};

const getRides = async ({
	country,
	city,
	page,
	order,
	idUser,
	passengerFilter,
	driverFilter,
	idRide,
	onlyFriendsFilter,
}: {
	country?: string;
	city?: string;
	page?: number;
	order?: number;
	idUser: string;
	passengerFilter?: boolean;
	driverFilter?: boolean;
	idRide?:string;
	onlyFriendsFilter?:boolean;
}) => {

	const session = Connection.driver.session();
	
	const result = await session.run(
		`	MATCH (r:Ride ${idRide ? "{id:$idRide}" : ""})
			${country ? "MATCH (r)-[*]->()-[:located_at]->(:City {country:$country})" : ""}
			${city ? "MATCH (r)-[*]->()-[:located_at]->(:City {name:$city})" : ""}
			${passengerFilter ? "MATCH (:Passenger {id:$idUser})-[:is_passenger]->(r)" : ""}
			${driverFilter ? "MATCH (:Driver {id:$idUser})-[:drives]->(r)" : ""}
			${onlyFriendsFilter ? `	MATCH (dr:Driver)-[:drives]->(r)
															MATCH (u:User {id:$idUser})
															WHERE EXISTS((u)-[:knows]->(dr))`: ""}
			WITH collect(DISTINCT r) AS rides, count(DISTINCT r) as total
			UNWIND rides as r
			
			OPTIONAL MATCH (d:Driver)-[drives_rel:drives]->(r)
			OPTIONAL MATCH (r)-[has_rel:has]->(v:Vehicle)
			OPTIONAL MATCH (r)-[starts_rel:starts]->(sl:Location)-[s_located_rel:located_at]->(sc:City)
			OPTIONAL MATCH (r)-[addressed_rel:addressed_to]->(al:Location)-[a_located_rel:located_at]->(ac:City)
			OPTIONAL MATCH (u_req:User)-[asks_rel:asks]->(r)
			OPTIONAL MATCH (u_pass:User)-[pass_rel:is_passenger]->(r)
			
			RETURN r AS ride, total,
			v AS vehicle, has_rel AS ride_has_vehicle_rel,
			sl AS start_location, starts_rel AS ride_starts_location_rel,
			sc AS start_city,
			al AS arrival_location, addressed_rel AS ride_addressed_to_location_rel,
			ac AS arrival_city,
			collect({user: u_req, rel: asks_rel}) AS requests, collect({user: u_req, rel: pass_rel}) AS passengers,
			EXISTS((:Passenger {id:$idUser})-[:is_passenger]->(r)) AS is_passenger,
			EXISTS((:Driver {id:$idUser})-[:drives]->(r)) AS is_driver,
			d AS driver, drives_rel as driver_drives_ride_rel
			
			ORDER BY r.date ${order === 1 ? "ASC" : "DESC"}
			${exists(page) ? "SKIP toInteger($skip) LIMIT toInteger($limit)" : ""}
			`,
		{
			skip: (page ?? 0) * consts.resultsNumberPerPage,
			limit: consts.resultsNumberPerPage,
			idUser,
			country,
			city,
			idRide,
		}
	);

	if (result.records.length === 0) return null;

	const rides = result.records.map((record) => {
		const res = {
			...record.get("ride").properties,
			driver: {
				...record.get("driver").properties,
				...record.get("driver_drives_ride_rel").properties,
				password: undefined,
			},
			vehicle: {
				...record.get("vehicle").properties,
				...record.get("ride_has_vehicle_rel").properties,
			},
			startLocation: {
				...record.get("start_location").properties,
				...record.get("ride_starts_location_rel").properties,
				city: record.get("start_city").properties,
			},
			arrivalLocation: {
				...record.get("arrival_location").properties,
				...record.get("ride_addressed_to_location_rel").properties,
				city: record.get("arrival_city").properties,
			},
			isPassenger: record.get("is_passenger"),
			isDriver: record.get("is_driver"),
			requests: record
				.get("requests")
				?.map((req: any) => (req?.user !== null ? {
					user: req?.user ? {...req.user.properties, password: undefined} : undefined,
					...(req?.rel?.properties ?? {}),
				} : null)),
			
			passengers: record
			.get("passengers")
			?.map((req: any) => (req?.user !== null ? {
				user: req?.user ? {...req.user.properties, password: undefined} : undefined,
				...(req?.rel?.properties ?? {}),
			} : null)),
		};

		// Si no hay requests o passengers reemplazar por null
		if(res.requests.length === 1 && res.requests[0] === null) res.requests = null;
		if(res.passengers.length === 1 && res.passengers[0] === null) res.passengers = null;

		return res;
	});

	const count = result.records[0].get("total").toNumber();
	const pages = Math.ceil(count / consts.resultsNumberPerPage);

	await session.close();

	return { pages, total: count, result: rides };
};

const assignUserToRide = async ({
	idUser,
	idRide,
	sessionIdUser,
}: {
	idUser?: string;
	idRide: string;
	sessionIdUser: string;
}) => {
	const session = Connection.driver.session();

	const result = await session.run(
		`	MATCH (u:User ${idUser ? "{id:$idUser}": ""})
			MATCH (r:Ride {id:$idRide})
			MATCH (:Driver {id:$sessionIdUser})-[:drives]->(r)
			MATCH (u)-[a:asks]->(r)
			WHERE NOT EXISTS((u)-[:drives]->(r))
			MERGE (u)-[p:is_passenger]->(r)
			SET a.approved = true
			SET a.approved_date = $date
			RETURN p
			`,
		{
			idUser,
			idRide,
			sessionIdUser,
			date: new Date().toString()
		}
	);

	if (result.records.length === 0)
		throw new CustomError("No se pudo asignar al usuario como pasajero.", 400);

	await session.close();
};
const removeUserFromRide = async ({
	idUser,
	idRide,
	sessionIdUser,
}: {
	idUser?: string;
	idRide: string;
	sessionIdUser: string;
}) => {
	const session = Connection.driver.session();

	const result = await session.run(
		`	MATCH (u:User ${idUser ? "{id:$idUser}": ""})
			MATCH (r:Ride {id:$idRide})
			MATCH (:Driver {id:$sessionIdUser})-[:drives]->(r)
			MATCH (u)-[a:asks]->(r)
			MATCH (u)-[p:is_passenger]->(r)
			SET a.approved = false
			REMOVE a.approved_date
			DELETE p
			RETURN u
			`,
		{
			idUser,
			idRide,
			sessionIdUser,
		}
	);

	if (result.records.length === 0)
		throw new CustomError("No se pudo retirar al usuario como pasajero.", 400);

	await session.close();
};

const deleteRide = async ({
	idUser,
	idRide,
}: {
	idUser: string;
	idRide?: string;
}) => {
	const session = Connection.driver.session();

	const result = await session.run(
		`	MATCH (u:Driver {id:$idUser})-[:drives]->(r:Ride ${idRide ? "{id:$idRide}" : ""})
			DETACH DELETE r
			RETURN u
			`,
		{
			idUser,
			idRide,
		}
	);

	if (result.records.length === 0)
		throw new CustomError("No se encontraron viajes para el usuario.", 400);

	await session.close();
};


const createRideRequest = async ({
	idUser,
	idRide,
	message,
}: {
	idUser: string;
	idRide: string;
	message: string;
}) => {
	const session = Connection.driver.session();

	const result = await session.run(
		`	MATCH (u:User {id:$idUser})
			MATCH (r:Ride {id:$idRide})
			WHERE NOT EXISTS((u)-[:drives]->(r))
			MERGE (u)-[a:asks {approved:false, date:$date, message:$message}]->(r)
			RETURN a
			`,
		{
			idUser,
			idRide,
			message,
			date: new Date().toString(),
		}
	);

	if (result.records.length === 0)
		throw new CustomError("No se pudo crear la solicitud de viaje.", 400);

	await session.close();
};

const addPassengerComment = async ({
	idUser,
	idRide,
	comment,
}: {
	idUser: string;
	idRide: string;
	comment: string;
}) => {
	const session = Connection.driver.session();

	const result = await session.run(
		`	MATCH (u:User {id:$idUser})-[p:is_passenger]->(r:Ride {id:$idRide})
			SET p.comments = coalesce(p.comments, []) + [$comment]
			RETURN p
			`,
		{
			idUser,
			idRide,
			comment,
		}
	);

	if (result.records.length === 0)
		throw new CustomError("No se pudo agregar el comentario del pasajero al viaje.", 400);

	await session.close();
};

const completePassengerParticipation = async ({
	idUser,
	idRide,
	attended,
	rating,
}: {
	idUser: string;
	idRide: string;
	attended: boolean;
	rating: number;
}) => {
	const session = Connection.driver.session();

	const result = await session.run(
		`	MATCH (u:User {id:$idUser})-[p:is_passenger]->(r:Ride {id:$idRide})
			SET p.completed=true, p.rating=$rating
			RETURN p
			`,
		{ idUser, idRide, attended, rating }
	);

	if (result.records.length === 0)
		throw new CustomError("No se pudo completar la participación de un pasajero.", 400);

	await session.close();
};

const startRide = async ({
	idUser,
	idRide,
	wantsToTalk,
	inAHurry,
	waitTime,
	comment,
}: {
	idUser: string;
	idRide: string;
	wantsToTalk: boolean;
	inAHurry: boolean;
	waitTime: number;
	comment: string;
}) => {
	const session = Connection.driver.session();

	const result = await session.run(
		`	MATCH (u:User {id:$idUser})-[d:drives]->(r:Ride {id:$idRide})
			MATCH (r)-[s:starts]->(sl:Location)
			SET d.wantsToTalk=$wantsToTalk, d.inAHurry=$inAHurry, d.onMyWay=true, 
					s.realStartTime=$realStartTime, s.waitTime=$waitTime, s.comment=$comment
			RETURN d
			`,
		{
			idUser,
			idRide,
			wantsToTalk,
			inAHurry,
			realStartTime: new Date().toString(),
			waitTime,
			comment,
		}
	);

	if (result.records.length === 0) throw new CustomError("No se pudo iniciar el viaje.", 400);

	await session.close();
};

const finishRide = async ({
	idUser,
	idRide,
	onTime,
	comment,
}: {
	idUser: string;
	idRide: string;
	onTime: boolean;
	comment: string;
}) => {
	const session = Connection.driver.session();

	const result = await session.run(
		`	MATCH (u:User {id:$idUser})-[d:drives]->(r:Ride {id:$idRide})
			MATCH (r)-[a:addressed_to]->(al:Location)
			SET d.onMyWay=false, r.completed=true,
					a.realArrivalTime=$arrivalTime, a.onTime=$onTime, a.comment=$comment
			RETURN d
			`,
		{
			idUser,
			idRide,
			arrivalTime: new Date().toString(),
			onTime,
			comment,
		}
	);

	if (result.records.length === 0) throw new CustomError("No se pudo finalizar el viaje.", 400);

	await session.close();
};

const getTopUsersWithMostCompletedRides = async () => {
	const result = await RideSchema.aggregate([
		{
			$match: { completed: true },
		},
		{
			$group: {
				_id: "$user._id",
				totalTrips: { $sum: 1 },
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "_id",
				foreignField: "_id",
				as: "user",
			},
		},
		{
			$unwind: "$user",
		},
		{
			$addFields: { "user.id": "$user._id" },
		},
		{
			$project: { totalTrips: 1, "user.name": 1, _id: 0, "user.id": 1 },
		},
		{
			$sort: { totalTrips: -1 },
		},
		{
			$limit: 5,
		},
	]);

	return result;
};

export {
	createRide,
	getRides,
	assignUserToRide,
	removeUserFromRide,
	getTopUsersWithMostCompletedRides,
	createRideRequest,
	addPassengerComment,
	completePassengerParticipation,
	startRide,
	finishRide,
	deleteRide,
};
