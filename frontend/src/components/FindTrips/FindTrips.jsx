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

function FindTrips() {
  const [filters, setFilters] = useState({ role: 'none', order: -1 });
  const [currentPage, setCurrentPage] = useState(0);
  const {
    callFetch: getRides,
    result: resultGet,
    error: errorGet,
    loading: loadingGet,
  } = useFetch();
  const [trips, setTrips] = useState([]);
  const { callFetch: fetchCountries, result: resultCountries } = useFetch();
  const { callFetch: fetchCities, result: resultCities } = useFetch();

  const token = useToken();

  const getCountries = () => {
    fetchCountries({
      uri: `${serverHost}/location/countries`,
      headers: { authorization: token },
    });
  };

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
    setFilters({});
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
      timeZone: 'UTC', // Asegura que la conversión se haga respecto a la hora UTC
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
    getTrips();
    getCountries();
  }, []);

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
              options={[{ value: 'driver', title: 'Soy el conductor' }, { value: 'passenger', title: 'Soy pasajero' }, { value: 'none', title: 'Ninguno' }]}
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

    </div>
  );
}

export default FindTrips;
