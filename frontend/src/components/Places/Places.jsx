import React, { useEffect, useState } from 'react';
import { Pagination } from '@mui/material';
import styles from './Places.module.css';
import InputSelect from '../InputSelect';
import Place from '../Place/Place';
import usePopUp from '../../hooks/usePopUp';
import PopUp from '../PopUp/PopUp';
import InputText from '../InputText';
import Button from '../Button';
import Spinner from '../Spinner';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import { serverHost } from '../../config';
import countries from '../../assets/countries.ts';

function Places() {
  const [filters, setFilters] = useState({});
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isEditOpen, openEdit, closeEdit] = usePopUp();
  const [placeToEdit, setPlaceToEdit] = useState(false);
  const [placeToCreate, setPlaceToCreate] = useState(false);
  const [isCreateOpen, openCreate, closeCreate] = usePopUp();
  const [errors, setErrors] = useState({});
  const {
    callFetch: fetchLocations,
    result: resultGet,
    error: errorGet,
    loading: loadingGet,
  } = useFetch();
  const { callFetch: putLocation, result: resultPut, loading: loadingPut } = useFetch();
  const { callFetch: postLocation, result: resultPost, loading: loadingPost } = useFetch();
  const { callFetch: deleteLocation, result: resultDelete } = useFetch();
  const { callFetch: fetchCountries, result: resultCountries } = useFetch();
  const { callFetch: fetchCities, result: resultCities } = useFetch();

  const token = useToken();

  const clearError = (e) => {
    setErrors((lastVal) => ({ ...lastVal, [e.target.name]: null }));
  };

  const validateName = (value) => {
    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, name: 'Se necesita un nombre para el lugar' }));
      return false;
    }

    return true;
  };

  const validateAddress = (value) => {
    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, address: 'Se necesita una dirección para el lugar' }));
      return false;
    }

    return true;
  };

  const validateCountry = (value) => {
    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, country: 'Se necesita un país para el lugar' }));
      return false;
    }

    return true;
  };

  const validateCity = (value) => {
    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, city: 'Se necesita un país para el lugar' }));
      return false;
    }

    return true;
  };

  const editPlace = (id, name, address, city, country) => {
    setPlaceToEdit({
      id, name, address, city, country,
    });
  };

  const getLocations = () => {
    const { country, city } = filters;
    const paramsObj = { page: currentPage };

    if (country !== undefined && country !== '') {
      paramsObj.country = country;
    }

    if (city !== undefined && city !== '') {
      paramsObj.city = city;
    }

    const searchParams = new URLSearchParams(paramsObj);

    fetchLocations({
      uri: `${serverHost}/location?${searchParams.toString()}`,
      headers: { authorization: token },
    });
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

  const updateLocation = () => {
    let hasError = false;

    if (!validateAddress(placeToEdit.address)) hasError = true;
    if (!validateCity(placeToEdit.city)) hasError = true;
    if (!validateCountry(placeToEdit.country)) hasError = true;
    if (!validateName(placeToEdit.name)) hasError = true;

    if (hasError) return;

    putLocation({
      uri: `${serverHost}/location/`,
      headers: { authorization: token },
      body: JSON.stringify(placeToEdit),
      method: 'PATCH',
      parse: false,
    });
  };

  const deletePlace = (placeId) => {
    deleteLocation({
      uri: `${serverHost}/location/${placeId}`,
      headers: { authorization: token },
      method: 'DELETE',
      parse: false,
    });
  };

  const createLocation = () => {
    let hasError = false;

    if (!validateAddress(placeToCreate.address)) hasError = true;
    if (!validateCity(placeToCreate.city)) hasError = true;
    if (!validateCountry(placeToCreate.country)) hasError = true;
    if (!validateName(placeToCreate.name)) hasError = true;

    if (hasError) return;

    postLocation({
      uri: `${serverHost}/location/`,
      headers: { authorization: token },
      body: JSON.stringify(placeToCreate),
      method: 'POST',
      parse: false,
    });
  };

  const refreshPlaces = () => {
    setPlaces([]);
    setFilters({});
    closeEdit();
    getLocations();
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setPlaceToEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setPlaceToCreate((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (e, page) => {
    setCurrentPage(page - 1);
  };

  useEffect(() => {
    if (!placeToEdit) return;
    openEdit();
  }, [placeToEdit]);

  useEffect(() => {
    if (resultGet) {
      setPlaces(resultGet.result);
    }
  }, [resultGet]);

  useEffect(() => {
    setPlaces([]);
    getLocations();
  }, [currentPage, filters]);

  useEffect(() => {
    if (!resultPut && !resultDelete && !resultPost) return;
    closeCreate();
    closeEdit();
    refreshPlaces();
  }, [resultPut, resultDelete, resultPost]);

  useEffect(() => {
    if (!isCreateOpen && !isEditOpen) return;
    setErrors({});
    setPlaceToCreate({});
  }, [isCreateOpen, isEditOpen]);

  useEffect(() => {
    getLocations();
    getCountries();
  }, []);

  useEffect(() => {
    if (filters.country !== undefined && filters.country !== '') getCities(filters.country);
  }, [filters.country]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.headerSection}>

        <p className={styles.title}>Lugares</p>

        <Button text="Nuevo" className={styles.newButton} onClick={openCreate} />

        <div className={styles.filtersContainer}>

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

        </div>
      </div>

      {!errorGet && (
        <div className={styles.placesContainer}>
          {places?.map((place) => (
            <Place
              location={`${place.city}, ${place.country}`}
              name={place.name}
              address={place.address}
              editPlace={() => editPlace(
                place.id,
                place.name,
                place.address,
                place.city,
                place.country,
              )}
              deletePlace={() => deletePlace(place.id)}
            />
          ))}
        </div>
      )}

      {errorGet && <p>No se encontraron resultados</p>}
      {loadingGet && <Spinner />}

      {isEditOpen && (
      <PopUp close={closeEdit} closeWithBackground>
        <div className={styles.editPlace}>
          <h2 className={styles.editPlaceTitle}>Detalles de lugar</h2>
          <InputText
            title="Nombre"
            name="name"
            value={placeToEdit.name}
            onChange={handleEditFormChange}
            error={errors.name}
            onBlur={() => validateName(placeToEdit.name)}
            onFocus={clearError}
          />
          <InputText
            title="Dirección"
            name="address"
            value={placeToEdit.address}
            onChange={handleEditFormChange}
            error={errors.address}
            onBlur={() => validateAddress(placeToEdit.address)}
            onFocus={clearError}
          />
          <InputSelect
            title="País"
            className={styles.inputSelect}
            options={countries.map((country) => (
              { value: country.name, title: country.name }))}
            name="country"
            value={placeToEdit.country}
            onChange={handleEditFormChange}
            error={errors.country}
            onBlur={() => validateCountry(placeToEdit.country)}
            onFocus={clearError}
          />
          <InputText
            title="Ciudad"
            name="city"
            value={placeToEdit.city}
            onChange={handleEditFormChange}
            error={errors.city}
            onBlur={() => validateCity(placeToEdit.city)}
            onFocus={clearError}
          />
          <Button text="Actualizar" className={styles.updateButton} onClick={updateLocation} disabled={loadingPut} />
        </div>
      </PopUp>
      )}

      {isCreateOpen && (
      <PopUp close={closeCreate} closeWithBackground>
        <div className={styles.editPlace}>
          <h2 className={styles.editPlaceTitle}>Detalles de lugar</h2>
          <p className={styles.createDescription}>
            Registra una ubicación para usar en alguno de tus viajes
          </p>
          <InputText
            title="Nombre"
            name="name"
            value={placeToCreate.name}
            onChange={handleCreateFormChange}
            error={errors.name}
            onBlur={() => validateName(placeToCreate.name)}
            onFocus={clearError}
          />
          <InputText
            title="Dirección"
            name="address"
            value={placeToCreate.address}
            onChange={handleCreateFormChange}
            error={errors.address}
            onBlur={() => validateAddress(placeToCreate.address)}
            onFocus={clearError}
          />
          <InputSelect
            title="País"
            className={styles.inputSelect}
            options={countries.map((country) => (
              { value: country.name, title: country.name }))}
            name="country"
            value={placeToCreate.country}
            onChange={handleCreateFormChange}
            error={errors.country}
            onBlur={() => validateCountry(placeToCreate.country)}
            onFocus={clearError}
          />
          <InputText
            title="Ciudad"
            name="city"
            value={placeToCreate.city}
            onChange={handleCreateFormChange}
            error={errors.city}
            onBlur={() => validateCity(placeToCreate.city)}
            onFocus={clearError}
          />
          <Button text="Crear" className={styles.updateButton} onClick={createLocation} disabled={loadingPost} />
        </div>
      </PopUp>
      )}

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

export default Places;
