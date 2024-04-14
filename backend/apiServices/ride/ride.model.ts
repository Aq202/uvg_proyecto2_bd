import RideSchema from "../../db/schemas/ride.schema.js";
import { createMultipleRidesDto } from "./ride.dto.js";
import consts from "../../utils/consts.js";
import { ObjectId } from "mongodb";
import CustomError from "../../utils/customError.js";
import { startSession } from "mongoose";
import Connection from "../../db_neo4j/connection.js";
import generateId from "../../utils/generateId.js";

const createRide = async ({
	idStartLocation,
	idArrivalLocation,
	userId,
	date,
	arrival,
	start,
	vehicleId,
}: {
	idStartLocation: string;
	idArrivalLocation: string;
	userId: string;
	date: Date;
	arrival: string;
	start: string;
	vehicleId: string;
}) => {
	const session = Connection.driver.session();

	const driveId = generateId()
	const result = await session.run(
		`	MATCH (u:User {id:$userId})
			MATCH (v:Vehicle {identification:$vehicleId})
			MATCH (sl:Location {id:$idStartLocation})
			MATCH (al:Location {id:$idArrivalLocation})
			CREATE (d:Drive {id:$driveId, date:$date, arrival:$arrival, completed:$completed,start:$start})
			CREATE (u)-[:drives]->(d)
			CREATE (d)-[:starts]->(sl)
			CREATE (d)-[:addressed_to]->(al)
			CREATE (d)-[:has]->(v)
			RETURN u as user, v as vehicle, sl as startLocation, al as arrivalLocation`,
		{userId, vehicleId, idStartLocation, idArrivalLocation, driveId, date, arrival, completed: false, start }
	);

	if(result.records.length === 0) throw new CustomError("No se pudo crear el viaje.", 400);

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
}: {
	country?: string;
	city?: string;
	page?: number;
	order?: number;
	idUser?: string;
	passengerFilter?: boolean;
	driverFilter?: boolean;
}) => {
	const queryPipeline: any = [
		{
			$lookup: {
				from: "locations",
				localField: "startLocation",
				foreignField: "_id",
				as: "startLocation",
			},
		},
		{
			$unwind: "$startLocation",
		},
		{
			$lookup: {
				from: "locations",
				localField: "arrivalLocation",
				foreignField: "_id",
				as: "arrivalLocation",
			},
		},
		{
			$unwind: "$arrivalLocation",
		},
		{
			$addFields: {
				isPassenger: {
					$anyElementTrue: {
						$map: {
							input: "$passengers",
							as: "passengers",
							in: {
								$eq: ["$$passengers._id", new ObjectId(idUser)],
							},
						},
					},
				},
			},
		},
		{
			$addFields: {
				isDriver: {
					$cond: {
						if: { $eq: ["$user._id", new ObjectId(idUser)] },
						then: true,
						else: false,
					},
				},
			},
		},
	];

	// Agregar filtrado por ubicación

	const conditions = [];
	if (country) {
		conditions.push({
			$or: [{ "startLocation.country": country }, { "arrivalLocation.country": country }],
		});
	}

	if (city) {
		conditions.push({
			$or: [{ "startLocation.city": city }, { "arrivalLocation.city": city }],
		});
	}

	if (passengerFilter !== undefined && idUser) {
		if (passengerFilter)
			conditions.push({ passengers: { $elemMatch: { _id: new ObjectId(idUser) } } });
		else conditions.push({ passengers: { $not: { $elemMatch: { _id: new ObjectId(idUser) } } } });
	}

	if (driverFilter !== undefined && idUser) {
		if (driverFilter) conditions.push({ "user._id": new ObjectId(idUser) });
		else conditions.push({ "user._id": { $ne: new ObjectId(idUser) } });
	}

	if (conditions.length > 0) queryPipeline.push({ $match: { $and: conditions } });

	// Realizar conteo total de registros
	const count =
		(await RideSchema.aggregate([...queryPipeline, { $count: "total" }]))[0]?.total ?? 0;
	const pages = Math.ceil(count / consts.resultsNumberPerPage);

	// ordenar por fecha
	queryPipeline.push({ $sort: { datetime: order ?? -1 } });

	// Limitar segun paginación

	if (page != undefined) {
		queryPipeline.push({
			$skip: page * consts.resultsNumberPerPage,
		});
		queryPipeline.push({
			$limit: consts.resultsNumberPerPage,
		});
	}
	const rides = await RideSchema.aggregate(queryPipeline);
	return { pages, total: count, result: createMultipleRidesDto(rides) };
};

const assignUserToRide = async ({ user, idRide }: { user: User; idRide: string }) => {
	const session = await startSession();
	try {
		session.startTransaction();
		const ride = await RideSchema.findOneAndUpdate(
			{ _id: idRide },
			{ $push: { passengers: { _id: user.id, ...user } }, $inc: {num_passengers: 1} },
			{ session }
		);

		if (!ride) throw new CustomError("No se encontró el viaje.", 404);
		if (ride.user._id === user.id)
			throw new CustomError("El conductor no puede ser pasajero.", 400);

		await session.commitTransaction();
	} catch (ex: any) {
		await session.abortTransaction();
		if (ex?.kind === "ObjectId") throw new CustomError("El id no es válido.", 400);
		throw ex;
	}
};

const removeUserFromRide = async ({ idUser, idRide }: { idUser: string; idRide: string }) => {
	try {
		const { acknowledged, matchedCount } = await RideSchema.updateOne(
			{ _id: idRide },
			{ passengers: { $pull: { _id: idUser }, }, $inc: {num_passengers: -1} }
		);

		if (matchedCount === 0) throw new CustomError("No se encontraron coincidencias.", 404);
		if (!acknowledged) throw new CustomError("No se pudo remover al usuario del ride.", 500);
	} catch (ex: any) {
		if (ex?.kind === "ObjectId") throw new CustomError("El id no es válido.", 400);
		throw ex;
	}
};

const getTopUsersWithMostCompletedRides = async () => {

	const result = await RideSchema.aggregate([
		{
			$match: { completed: true } 
		},
		{
			$group: {
				_id: "$user._id", 
				totalTrips: { $sum: 1 } 
			}
		},
		{
			$lookup: { 
				from: "users",
				localField: "_id",
				foreignField: "_id",
				as: "user"
			}
		},
		{
			$unwind: "$user" 
		},
		{
			$addFields: {"user.id": "$user._id"}
		},
		{
			$project: {totalTrips: 1, "user.name":1, "_id":0, "user.id": 1}
		},
		{
			$sort: { totalTrips: -1 } 
		},
		{
			$limit: 5 
		}
	])

	return result;
}

export { createRide, getRides, assignUserToRide, removeUserFromRide, getTopUsersWithMostCompletedRides };
