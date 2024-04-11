import React, { useEffect, useState } from 'react';
import { Pagination } from '@mui/material';
import { FaArrowUp as ArrowUpIcon, FaArrowDown as ArrowDownIcon } from 'react-icons/fa';
import styles from './UserTrips.module.css';
import InputSelect from '../InputSelect';
import Trip from '../Trip';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import { serverHost } from '../../config';
import Button from '../Button';
import InputDate from '../InputDate';
import PopUp from '../PopUp/PopUp';
import usePopUp from '../../hooks/usePopUp';
import InputText from '../InputText';
import Spinner from '../Spinner';

function UserTrips() {
  const [filters, setFilters] = useState({ role: 'driver', order: -1 });
  const [currentPage, setCurrentPage] = useState(0);
  const [trips, setTrips] = useState([]);
  const [rideToCreate, setRideToCreate] = useState(false);
  const [isCreateOpen, openCreate, closeCreate] = usePopUp();
  const {
    callFetch: fetchLocationsCreate,
    result: resultGetLocationsCreate,
    error: errorGetLocationsCreate,
    loading: loadingGetLocationsCreate,
  } = useFetch();
  const {
    callFetch: getRides,
    result: resultGet,
    error: errorGet,
    loading: loadingGet,
  } = useFetch();
  const { callFetch: postRide, result: resultPost, loading: loadingTrip } = useFetch();
  const { callFetch: fetchCountries, result: resultCountries } = useFetch();
  const { callFetch: fetchCities, result: resultCities } = useFetch();
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
      timeZone: 'UTC', // Asegura que la conversión se haga respecto a la hora UTC
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

  const validateVehicleType = () => {
    const value = rideToCreate.vehicleType;

    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, vehicleType: 'Se necesita un tipo de vehículo' }));
      return false;
    }

    return true;
  };

  const validateVehicleId = () => {
    const value = rideToCreate.vehicleIdentification;

    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, vehicleIdentification: 'Se necesita un número de placa' }));
      return false;
    }

    return true;
  };

  const validateVehicleColor = () => {
    const value = rideToCreate.vehicleColor;

    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, vehicleColor: 'Se necesita un color de vehículo' }));
      return false;
    }

    return true;
  };

  const validateDate = () => {
    const value = rideToCreate.datetime;

    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, datetime: 'Se necesita una fecha de salida' }));
      return false;
    }

    return true;
  };

  const handleDateOrder = () => {
    let value = filters.order;
    value = value === -1 ? 1 : -1;
    setFilters((prev) => ({ ...prev, order: value }));
  };

  const getCountries = () => {
    fetchCountries({
      uri: `${serverHost}/location/countries?fromUser=true`,
      headers: { authorization: token },
    });
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
      uri: `${serverHost}/location?`,
      headers: { authorization: token },
    });
  };

  const postTrip = () => {
    let hasError = false;

    if (!validateArrivalLocation()) hasError = true;
    if (!validateStartLocation()) hasError = true;
    if (!validateDate()) hasError = true;
    if (!validateVehicleId()) hasError = true;
    if (!validateVehicleType()) hasError = true;
    if (!validateVehicleColor()) hasError = true;

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
    setFilters({});
    getUserTrips();
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setRideToCreate((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!rideToCreate) return;
    openCreate();
  }, [rideToCreate]);

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
    if (!resultPost) return;
    refreshTrips();
    closeCreate();
  }, [resultPost]);

  useEffect(() => {
    if (filters.role === '') return;
    setTrips([]);
    getUserTrips();
  }, [currentPage, filters]);

  useEffect(() => {
    if (!isCreateOpen) return;
    getLocationsCreate();
    setRideToCreate({});
    setErrors({});
  }, [isCreateOpen]);

  useEffect(() => {
    getUserTrips();
    getLocationsCreate();
    getCountries();
  }, []);

  useEffect(() => {
    if (filters.country !== undefined && filters.country !== '') getCities(filters.country);
  }, [filters.country]);

  return (
    <div className={styles.mainContainer}>

      <div className={styles.headerSection}>

        <p className={styles.title}>Mis Viajes</p>

        <Button text="Nuevo" className={styles.newButton} onClick={openCreate} />

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

          {resultCountries && (
          <div className={styles.filterContainer}>
            <InputSelect
              options={resultCountries.map((country) => (
                { value: country, title: country }))}
              name="country"
              onChange={handleFilterChange}
              placeholder="País"
              value={filters?.country}
            />
          </div>
          )}

          {resultCities && (
            <div className={styles.filterContainer}>
              <InputSelect
                options={filters.country !== undefined && filters.countries !== '' && resultCities
                  ? resultCities.map((city) => ({ value: city.city, title: city.city }))
                  : []}
                name="city"
                onChange={handleFilterChange}
                placeholder="Ciudad"
                value={filters?.city}
              />
            </div>
          )}

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

      {!errorGet && (
        <div className={styles.tripsContainer}>
          {trips.map((trip) => (
            <Trip
              id={trip.id}
              location={`${trip.arrivalLocation.city}, ${trip.arrivalLocation.country}`}
              originName={trip.startLocation.name}
              originAddress={trip.startLocation.address}
              destinationName={trip.arrivalLocation.name}
              destinationAddress={trip.arrivalLocation.address}
              driver={trip.user.name}
              passengers={trip.passengers.length}
              time={readDate(trip.datetime)}
              joined={trip.isPassenger}
              callback={refreshTrips}
              owner={trip.isDriver}
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
          {resultGetLocationsCreate && (
            <>
              <h2 className={styles.creteTripTitle}>Crear viaje</h2>
              <p className={styles.createDescription}>Crea un viaje del que serás el conductor</p>
              <InputSelect
                className={styles.inputSelect}
                title="Lugar de salida"
                options={resultGetLocationsCreate.result.map((location) => (
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
                options={resultGetLocationsCreate.result.map((location) => (
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
                name="datetime"
                onChange={handleFormChange}
                error={errors.datetime}
                onBlur={validateDate}
                onFocus={clearError}
              />
              <InputSelect
                className={styles.inputSelect}
                title="Vehículo de salida"
                options={[
                  { value: 'Sedan', title: 'Sedan' },
                  { value: 'SUV', title: 'SUV' },
                  { value: 'Pick-up', title: 'Pick-up' },
                  { value: 'Otro', title: 'Otro' }]}
                name="vehicleType"
                value={rideToCreate.vehicleType}
                onChange={handleFormChange}
                error={errors.vehicleType}
                onBlur={validateVehicleType}
                onFocus={clearError}
              />
              <InputText
                title="Número de placa"
                name="vehicleIdentification"
                value={rideToCreate.vehicleIdentification}
                onChange={handleFormChange}
                error={errors.vehicleIdentification}
                onBlur={validateVehicleId}
                onFocus={clearError}
              />
              <InputText
                title="Color del vehículo"
                name="vehicleColor"
                value={rideToCreate.vehicleColor}
                onChange={handleFormChange}
                error={errors.vehicleColor}
                onBlur={validateVehicleColor}
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
          {loadingGetLocationsCreate && <Spinner />}
        </div>
      </PopUp>
      )}

    </div>
  );
}

export default UserTrips;
