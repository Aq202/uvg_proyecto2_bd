import React, { useEffect, useState } from 'react';
import { Pagination } from '@mui/material';
import { FaArrowUp as ArrowUpIcon, FaArrowDown as ArrowDownIcon } from 'react-icons/fa';
import styles from './UserTrips.module.css';
import InputSelect from '../InputSelect';
import Trip from '../Trip';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import { serverHost } from '../../config';
import {
  button, red,
} from '../../styles/buttons.module.css';
import Button from '../Button';
import InputDate from '../InputDate';
import PopUp from '../PopUp/PopUp';
import usePopUp from '../../hooks/usePopUp';
import Spinner from '../Spinner';
import countries from '../../assets/countries.ts';
import InputTime from '../InputTime/InputTime';
import InputCheck from '../InputCheck/InputCheck';
import InputNumber from '../InputNumber/InputNumber';

function UserTrips() {
  const [filters, setFilters] = useState({ role: 'driver', order: -1 });
  const [currentPage, setCurrentPage] = useState(0);
  const [trips, setTrips] = useState([]);
  const [rideToCreate, setRideToCreate] = useState(
    { allowsLuggage: false, allowsMusic: false },
  );
  const [isCreateOpen, openCreate, closeCreate] = usePopUp();
  const {
    callFetch: fetchLocationsCreate,
    result: resultGetLocationsCreate,
    error: errorGetLocationsCreate,
    loading: loadingGetLocationsCreate,
  } = useFetch();
  const {
    callFetch: fetchVehicles,
    result: resultGetVehicles,
    error: errorGetVehicles,
    loading: loadingGetVehicles,
  } = useFetch();
  const {
    callFetch: getRides,
    result: resultGet,
    error: errorGet,
    loading: loadingGet,
  } = useFetch();
  const { callFetch: postRide, result: resultPost, loading: loadingTrip } = useFetch();
  const { callFetch: fetchCities, result: resultCities } = useFetch();
  const { callFetch: deleteUserTrip, result: resultDelete } = useFetch();
  const { callFetch: deleteAllUserTrips, result: resultDeleteAll } = useFetch();
  const [errors, setErrors] = useState({});

  const token = useToken();

  const readDate = (fechaISO) => {
    const fecha = new Date(fechaISO);

    // Convertir a cadena con formato local usando toLocaleString para manejar la zona horaria
    const opciones = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      // timeZone: 'UTC', // Asegura que la conversión se haga respecto a la hora UTC
    };

    // Puedes cambiar 'es' por el código de tu zona horaria local si necesitas otro idioma o formato
    const fechaHoraFormateada = fecha.toLocaleString('es', opciones);

    // Para asegurar el formato deseado, podrías hacer un ajuste manual si es necesario
    // Esto es un ejemplo y podría necesitar ajustes dependiendo del idioma o la zona horaria
    return fechaHoraFormateada.replace(/\//g, '-').replace(',', '');
  };

  const clearError = (e) => {
    setErrors((lastVal) => ({ ...lastVal, [e.target.name]: null }));
  };

  const validateStartLocation = () => {
    const value = rideToCreate.idStartLocation;

    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, idStartLocation: 'Se necesita un lugar de salida' }));
      return false;
    }

    return true;
  };

  const validateArrivalLocation = () => {
    const value = rideToCreate.idArrivalLocation;

    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, idArrivalLocation: 'Se necesita un lugar destino' }));
      return false;
    }

    return true;
  };

  const validateVehicleId = () => {
    const value = rideToCreate.vehicleId;

    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, vehicleId: 'Se necesita un vehículo' }));
      return false;
    }

    return true;
  };

  const validateStart = () => {
    const value = rideToCreate.start;

    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, start: 'Se necesita una hora de salida' }));
      return false;
    }

    return true;
  };

  const validateDate = () => {
    const value = rideToCreate.date;

    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, date: 'Se necesita una fecha de salida' }));
      return false;
    }

    return true;
  };

  const validateArrival = () => {
    const value = rideToCreate.arrival;
    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, arrival: 'Se necesita una hora de llegada' }));
      return false;
    }

    return true;
  };

  const validateCapacity = () => {
    const value = rideToCreate.remainingSpaces;
    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, remainingSpaces: 'Se necesita una capacidad de pasajeros' }));
      return false;
    }

    return true;
  };

  const handleDateOrder = () => {
    let value = filters.order;
    value = value === -1 ? 1 : -1;
    setFilters((prev) => ({ ...prev, order: value }));
  };

  const getCities = (country) => {
    fetchCities({
      uri: `${serverHost}/location/cities?fromUser=true&country=${country}`,
      headers: { authorization: token },
    });
  };

  const getUserTrips = () => {
    const { country, city, role } = filters;
    const paramsObj = { page: currentPage, order: filters.order };

    if (country !== undefined && country !== '') {
      paramsObj.country = country;
    }

    if (city !== undefined && city !== '') {
      paramsObj.city = city;
    }

    if (role !== undefined && role !== '') {
      if (role === 'driver') paramsObj.driver = true;
      if (role === 'passenger') paramsObj.passenger = true;
    }

    const searchParams = new URLSearchParams(paramsObj);
    getRides({
      uri: `${serverHost}/ride?${searchParams.toString()}`,
      headers: { authorization: token },
    });
  };

  const getLocationsCreate = () => {
    fetchLocationsCreate({
      uri: `${serverHost}/location`,
      headers: { authorization: token },
    });
  };

  const getVehiclesCreate = () => {
    fetchVehicles({
      uri: `${serverHost}/vehicle`,
      headers: { authorization: token },
    });
  };

  const postTrip = () => {
    let hasError = false;

    if (!validateArrivalLocation()) hasError = true;
    if (!validateStartLocation()) hasError = true;
    if (!validateStart()) hasError = true;
    if (!validateArrival()) hasError = true;
    if (!validateDate()) hasError = true;
    if (!validateVehicleId()) hasError = true;
    if (!validateCapacity()) hasError = true;

    if (hasError) return;

    postRide({
      uri: `${serverHost}/ride`,
      headers: { authorization: token },
      body: JSON.stringify(rideToCreate),
      method: 'POST',
      parse: false,
    });
  };

  const refreshTrips = () => {
    setTrips([]);
    getUserTrips();
  };

  const handleFormChange = (e) => {
    const { name } = e.target;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setRideToCreate((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (e, page) => {
    setTrips([]);
    setCurrentPage(page - 1);
  };

  useEffect(() => {
    if (resultGet) {
      setTrips(resultGet.result);
    }
  }, [resultGet]);

  useEffect(() => {
    if (!resultDelete && !resultPost && !resultDeleteAll) return;
    closeCreate();
    refreshTrips();
  }, [resultDelete, resultPost, resultDeleteAll]);

  useEffect(() => {
    if (filters.role === '') return;
    setTrips([]);
    getUserTrips();
  }, [currentPage, filters]);

  useEffect(() => {
    if (!isCreateOpen) return;
    getLocationsCreate();
    getVehiclesCreate();
    setRideToCreate({ allowsLuggage: false, allowsMusic: false });
    setErrors({});
  }, [isCreateOpen]);

  useEffect(() => {
    getUserTrips();
    getLocationsCreate();
  }, []);

  useEffect(() => {
    if (filters.country !== undefined && filters.country !== '') getCities(filters.country);
  }, [filters.country]);

  const deleteTrip = (tripId) => {
    deleteUserTrip({
      uri: `${serverHost}/ride/${tripId}`,
      headers: { authorization: token },
      method: 'DELETE',
      parse: false,
    });
  };

  const deleteAllTrips = () => {
    deleteAllUserTrips({
      uri: `${serverHost}/ride`,
      headers: { authorization: token },
      method: 'DELETE',
      parse: false,
    });
  };

  return (
    <div className={styles.mainContainer}>

      <div className={styles.headerSection}>

        <p className={styles.title}>Mis Viajes</p>

        <Button text="Nuevo" className={styles.newButton} onClick={openCreate} />
        <button
          style={{ marginLeft: '10px' }}
          className={`${button} ${red}`}
          onClick={deleteAllTrips}
          type="button"
        >
          Eliminar todos
        </button>

        <div className={styles.filtersContainer}>

          <div className={styles.filterContainer}>
            <Button
              className={styles.dateButton}
              emptyBlack
              onClick={handleDateOrder}
            >
              <p className={styles.dateText}>{filters.order === -1 ? 'Mostrar fechas en orden ascendente' : 'Mostrar fechas en orden descendente'}</p>
              {filters.order === -1 && <ArrowUpIcon />}
              {filters.order === 1 && <ArrowDownIcon />}
            </Button>
          </div>

          <div className={styles.filterContainer}>
            <InputSelect
              options={[{ value: 'driver', title: 'Soy el conductor' }, { value: 'passenger', title: 'Soy pasajero' }]}
              name="role"
              onChange={handleFilterChange}
              placeholder="Soy..."
              value={filters?.role}
            />
          </div>
        </div>
      </div>

      <div className={styles.filtersContainer}>
        <div className={styles.filterContainer}>
          <InputSelect
            options={countries.map((country) => (
              { value: country.name, title: country.name }))}
            name="country"
            onChange={handleFilterChange}
            placeholder="País"
            value={filters?.country}
          />
        </div>

        {resultCities && (
          <div className={styles.filterContainer}>
            <InputSelect
              options={filters.country !== undefined && filters.countries !== '' && resultCities
                ? resultCities.map((city) => ({ value: city.name, title: city.name }))
                : []}
              name="city"
              onChange={handleFilterChange}
              placeholder="Ciudad"
              value={filters?.city}
            />
          </div>
        )}
      </div>

      {!errorGet && (
        <div className={styles.tripsContainer}>
          {trips.map((trip) => (
            <Trip
              id={trip.id}
              location={`${trip.arrivalLocation.city.name}, ${trip.arrivalLocation.city.country}`}
              originName={trip.startLocation.name}
              originAddress={trip.startLocation.address}
              destinationName={trip.arrivalLocation.name}
              destinationAddress={trip.arrivalLocation.address}
              passengers={trip.passengers ? trip.passengers : []}
              startTime={typeof (trip.date) === 'string' ? `${trip.date}, ${trip.start}` : readDate(trip.start)}
              arrivalTime={typeof (trip.date) === 'string' ? `${trip.date}, ${trip.arrival}` : readDate(trip.arrival)}
              realStartTime={trip.startLocation.realStartTime ? readDate(trip.startLocation.realStartTime) : ''}
              realArrivalTime={trip.arrivalLocation.realArrivalTime ? readDate(trip.arrivalLocation.realArrivalTime) : ''}
              joined={trip.isPassenger}
              callback={refreshTrips}
              owner={trip.isDriver}
              driver={trip.driver?.name}
              completed={trip.completed}
              requests={trip.requests ? trip.requests : null}
              started={trip.driver.onMyWay}
              deleteTrip={() => deleteTrip(trip.id)}
            />
          ))}
        </div>
      )}

      {errorGet && <p>No se encontraron resultados</p>}
      {loadingGet && <Spinner />}

      <Pagination
        count={resultGet?.pages ?? 0}
        siblingCount={2}
        className={styles.pagination}
        onChange={handlePageChange}
        page={currentPage + 1}
      />

      {isCreateOpen && (
        <PopUp close={closeCreate} closeWithBackground>
          <div className={styles.createTrip}>
            {resultGetLocationsCreate && resultGetVehicles && (
              <>
                <h2 className={styles.creteTripTitle}>Crear viaje</h2>
                <p className={styles.createDescription}>Crea un viaje del que serás el conductor</p>
                <InputSelect
                  className={styles.inputSelect}
                  title="Lugar de salida"
                  options={resultGetLocationsCreate.map((location) => (
                    { value: location.id, title: location.name }))}
                  name="idStartLocation"
                  value={rideToCreate.idStartLocation}
                  onChange={handleFormChange}
                  error={errors.idStartLocation}
                  onBlur={validateStartLocation}
                  onFocus={clearError}
                />
                <InputSelect
                  className={styles.inputSelect}
                  title="Lugar de llegada"
                  options={resultGetLocationsCreate.map((location) => (
                    { value: location.id, title: location.name }))}
                  name="idArrivalLocation"
                  value={rideToCreate.idArrivalLocation}
                  onChange={handleFormChange}
                  error={errors.idArrivalLocation}
                  onBlur={validateArrivalLocation}
                  onFocus={clearError}
                />
                <InputDate
                  title="Fecha de salida"
                  name="date"
                  onChange={handleFormChange}
                  error={errors.date}
                  onBlur={validateDate}
                  onFocus={clearError}
                />
                <div className={styles.timesSection}>
                  <InputTime
                    title="Hora de salida"
                    name="start"
                    value={rideToCreate.start}
                    onChange={handleFormChange}
                    error={errors.start}
                    onBlur={() => validateStart(rideToCreate.start)}
                    onFocus={clearError}
                  />
                  <InputTime
                    title="Hora de llegada"
                    name="arrival"
                    value={rideToCreate.arrival}
                    onChange={handleFormChange}
                    error={errors.arrival}
                    onBlur={() => validateArrival(rideToCreate.arrival)}
                    onFocus={clearError}
                  />
                </div>
                <InputSelect
                  className={styles.inputSelect}
                  title="Vehículo de salida"
                  options={resultGetVehicles.map((vehicle) => (
                    { value: vehicle.identification, title: `${vehicle.brand} ${vehicle.model} ${vehicle.year}` }))}
                  name="vehicleId"
                  value={rideToCreate.vehicleId}
                  onChange={handleFormChange}
                  error={errors.vehicleId}
                  onBlur={validateVehicleId}
                  onFocus={clearError}
                />
                <InputCheck
                  title="Los pasajeros pueden llevar equipaje"
                  name="allowsLuggage"
                  value={rideToCreate.allowsLuggage}
                  onChange={handleFormChange}
                />
                <InputCheck
                  title="Está permitido reproducir música en el viaje"
                  name="allowsMusic"
                  value={rideToCreate.allowsMusic}
                  onChange={handleFormChange}
                />
                <InputNumber
                  title="Capacidad de pasajeros"
                  name="remainingSpaces"
                  value={rideToCreate.remainingSpaces}
                  onChange={handleFormChange}
                  error={errors.remainingSpaces}
                  onBlur={() => validateCapacity(rideToCreate.remainingSpaces)}
                  onFocus={clearError}
                />
                <Button text="Crear" className={styles.createButton} onClick={postTrip} disabled={loadingTrip} />
              </>
            )}
            {errorGetLocationsCreate && (
              <p className={styles.createDescription}>
                Aún no has registrado ninguna ubicación para tus viajes
              </p>
            )}
            {errorGetVehicles && (
              <p className={styles.createDescription}>
                Aún no has registrado ningún vehículo para tus viajes
              </p>
            )}
            {(loadingGetLocationsCreate || loadingGetVehicles) && <Spinner />}
          </div>
        </PopUp>
      )}

    </div>
  );
}

export default UserTrips;
