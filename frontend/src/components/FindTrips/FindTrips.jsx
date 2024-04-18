import React, { useState, useEffect } from 'react';
import { Pagination } from '@mui/material';
import { FaArrowUp as ArrowUpIcon, FaArrowDown as ArrowDownIcon } from 'react-icons/fa';
import styles from './FindTrips.module.css';
import InputSelect from '../InputSelect';
import Trip from '../Trip';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import { serverHost } from '../../config';
import Spinner from '../Spinner';
import Button from '../Button';
import countries from '../../assets/countries.ts';
import useSessionData from '../../hooks/useSessionData';

function FindTrips() {
  const userData = useSessionData();
  const [filters, setFilters] = useState({ role: 'none', order: -1 });
  const [currentPage, setCurrentPage] = useState(0);
  const {
    callFetch: getRides,
    result: resultGet,
    error: errorGet,
    loading: loadingGet,
  } = useFetch();
  const [trips, setTrips] = useState([]);
  const { callFetch: fetchCities, result: resultCities } = useFetch();

  const token = useToken();

  const getCities = (country) => {
    fetchCities({
      uri: `${serverHost}/location/cities?country=${country}`,
      headers: { authorization: token },
    });
  };

  const getTrips = () => {
    const { country, city, role } = filters;
    const paramsObj = { passenger: false, page: currentPage, order: filters.order };

    if (country !== undefined && country !== '') {
      paramsObj.country = country;
    }

    if (city !== undefined && city !== '') {
      paramsObj.city = city;
    }

    if (role !== undefined && role !== '' && role !== 'none') {
      if (role === 'driver') paramsObj.driver = true;
      if (role === 'passenger') paramsObj.passenger = true;
    }

    const searchParams = new URLSearchParams(paramsObj);
    getRides({
      uri: `${serverHost}/ride?${searchParams.toString()}`,
      headers: { authorization: token },
    });
  };

  const refreshTrips = () => {
    setTrips([]);
    getTrips();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateOrder = () => {
    let value = filters.order;
    value = value === -1 ? 1 : -1;
    setFilters((prev) => ({ ...prev, order: value }));
  };

  const handlePageChange = (e, page) => {
    setTrips([]);
    setCurrentPage(page - 1);
  };

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
      // timeZone: 'GMT', // Asegura que la conversión se haga respecto a la hora UTC
    };

    // Puedes cambiar 'es' por el código de tu zona horaria local si necesitas otro idioma o formato
    const fechaHoraFormateada = fecha.toLocaleString('es', opciones);

    // Para asegurar el formato deseado, podrías hacer un ajuste manual si es necesario
    // Esto es un ejemplo y podría necesitar ajustes dependiendo del idioma o la zona horaria
    return fechaHoraFormateada.replace(/\//g, '-').replace(',', '');
  };

  useEffect(() => {
    if (resultGet) {
      setTrips(resultGet.result);
    }
  }, [resultGet]);

  useEffect(() => {
    setTrips([]);
    getTrips();
  }, [currentPage, filters]);

  useEffect(() => {
    if (filters.country !== undefined && filters.country !== '') getCities(filters.country);
  }, [filters.country]);

  return (
    <div className={styles.mainContainer}>

      <div className={styles.headerSection}>

        <p className={styles.title}>Encontrar viajes</p>

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
              options={[{ value: 'driver', title: 'Soy el conductor' }, { value: 'passenger', title: 'Soy pasajero' }, { value: 'none', title: 'Ninguno' }]}
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
              requested={trip?.requests?.some((request) => request.user.id === userData.id)}
              callback={refreshTrips}
              owner={trip.isDriver}
              driver={trip.driver?.name}
              completed={trip.completed}
              requests={trip.requests ? trip.requests : null}
              started={trip.driver.onMyWay}
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

    </div>
  );
}

export default FindTrips;
