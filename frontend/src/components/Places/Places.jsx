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
import InputTime from '../InputTime/InputTime';
import InputNumber from '../InputNumber/InputNumber';
import InputCheck from '../InputCheck/InputCheck';
import useSessionData from '../../hooks/useSessionData';

function Places() {
  const token = useToken();
  const [userData, setUserdata] = useState(useSessionData());
  const hasHome = userData?.home?.id !== null && userData?.home?.id !== undefined;
  const [filters, setFilters] = useState({});
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isEditOpen, openEdit, closeEdit] = usePopUp();
  const [placeToEdit, setPlaceToEdit] = useState(false);
  const [placeToCreate, setPlaceToCreate] = useState(
    { parking: false, dangerArea: false, urbanArea: false },
  );
  const [isCreateOpen, openCreate, closeCreate] = usePopUp();
  const [errors, setErrors] = useState({});
  const {
    callFetch: fetchLocations,
    result: resultGet,
    error: errorGet,
    loading: loadingGet,
  } = useFetch();
  const {
    callFetch: fetchUserData,
    result: resultGetUser,
  } = useFetch();
  const { callFetch: putLocation, result: resultPut, loading: loadingPut } = useFetch();
  const { callFetch: postLocation, result: resultPost, loading: loadingPost } = useFetch();
  const { callFetch: fetchCities, result: resultCities } = useFetch();
  const [cities, setCities] = useState([]);

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

  const validateOpenTime = (value) => {
    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, openTime: 'Se necesita una hora de apertura' }));
      return false;
    }

    return true;
  };

  const validateCloseTime = (value) => {
    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, closeTime: 'Se necesita una hora de cierre' }));
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
      setErrors((lastVal) => ({ ...lastVal, cityId: 'Se necesita una ciudad para el lugar' }));
      return false;
    }

    return true;
  };

  const validateDistance = (value) => {
    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, distanceFromCityCenter: 'Se necesita una distancia desde el centro' }));
      return false;
    }

    return true;
  };

  const editPlace = (
    id,
    name,
    address,
    openTime,
    closeTime,
    parking,
    urbanArea,
    dangerArea,
  ) => {
    setPlaceToEdit({
      idLocation: id,
      name,
      address,
      openTime,
      closeTime,
      parking,
      urbanArea,
      dangerArea,
    });
  };

  const getUser = () => {
    fetchUserData({
      uri: `${serverHost}/user`,
      headers: { authorization: token },
    });
  };

  const getLocations = () => {
    // Ya no hay filtros
    // const { country, city } = filters;
    // const paramsObj = { page: currentPage };

    /* if (country !== undefined && country !== '') {
      paramsObj.country = country;
    }

    if (city !== undefined && city !== '') {
      paramsObj.city = city;
    } */

    fetchLocations({
      uri: `${serverHost}/location`,
      headers: { authorization: token },
    });
  };

  const getCities = (country) => {
    fetchCities({
      uri: `${serverHost}/location/cities?country=${country}`,
      headers: { authorization: token },
    });
  };

  const updateLocation = () => {
    let hasError = false;

    if (!validateAddress(placeToEdit.address)) hasError = true;
    if (!validateName(placeToEdit.name)) hasError = true;
    if (!validateOpenTime(placeToEdit.openTime)) hasError = true;
    if (!validateCloseTime(placeToEdit.closeTime)) hasError = true;

    if (hasError) return;

    putLocation({
      uri: `${serverHost}/location/`,
      headers: { authorization: token },
      body: JSON.stringify(placeToEdit),
      method: 'PATCH',
      parse: false,
    });
  };

  const createLocation = () => {
    let hasError = false;

    if (!validateAddress(placeToCreate.address)) hasError = true;
    if (!validateOpenTime(placeToCreate.openTime)) hasError = true;
    if (!validateCloseTime(placeToCreate.closeTime)) hasError = true;
    if (!validateCity(placeToCreate.cityId)) hasError = true;
    if (!validateDistance(placeToCreate.distanceFromCityCenter)) hasError = true;
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
    getUser();
    setPlaces([]);
    setFilters({});
    closeEdit();
    getLocations();
  };

  const handleEditFormChange = (e) => {
    const { name } = e.target;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setPlaceToEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateFormChange = (e) => {
    const { name } = e.target;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setPlaceToCreate((prev) => ({ ...prev, [name]: value }));
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
      setPlaces(resultGet);
    }
  }, [resultGet]);

  useEffect(() => {
    setPlaces([]);
    getLocations();
  }, [currentPage, filters]);

  useEffect(() => {
    if (!resultPut && !resultPost) return;
    closeCreate();
    closeEdit();
    refreshPlaces();
  }, [resultPut, resultPost]);

  useEffect(() => {
    setErrors({});
    setPlaceToCreate({ parking: false, dangerArea: false, urbanArea: false });
    setCities([]);
  }, [isCreateOpen, isEditOpen]);

  useEffect(() => {
    if (placeToCreate.country !== undefined && placeToCreate.country !== '') getCities(placeToCreate.country);
  }, [placeToCreate.country]);

  useEffect(() => {
    if (!resultCities) {
      setCities([]);
      if (isCreateOpen) {
        setPlaceToCreate((prev) => ({ ...prev, city: '' }));
      }
      return;
    }
    setCities(resultCities);
  }, [resultCities]);

  useEffect(() => {
    if (resultGetUser) setUserdata(resultGetUser);
  }, [resultGetUser]);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.headerSection}>

        <p className={styles.title}>Lugares</p>

        <Button text="Nuevo" className={styles.newButton} onClick={openCreate} />

      </div>

      {!errorGet && (
        <div className={styles.placesContainer}>
          {places?.map((place, index) => (
            <Place
              hasHome={hasHome || undefined}
              homeId={userData?.home?.id || undefined}
              right={index % 2 === 0}
              location={`${place.city.name}, ${place.city.country}`}
              name={place.name}
              address={place.address}
              parking={place.parking}
              openTime={place.openTime}
              closeTime={place.closeTime}
              refetch={refreshPlaces}
              id={place.id}
              editPlace={() => editPlace(
                place.id,
                place.name,
                place.address,
                place.openTime,
                place.closeTime,
                place.distanceFromCityCenter,
                place.parking,
                place.urbanArea,
                place.dangerArea,
              )}
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
            <InputText
              title="Hora apertura"
              name="openTime"
              value={placeToEdit.openTime}
              onChange={handleEditFormChange}
              error={errors.openTime}
              onBlur={() => validateOpenTime(placeToEdit.openTime)}
              onFocus={clearError}
            />
            <InputText
              title="Hora cierre"
              name="closeTime"
              value={placeToEdit.closeTime}
              onChange={handleEditFormChange}
              error={errors.closeTime}
              onBlur={() => validateCloseTime(placeToEdit.openTime)}
              onFocus={clearError}
            />
            <InputCheck
              title="El lugar cuenta con parqueo"
              name="parking"
              value={placeToEdit.parking}
              checked={placeToEdit.parking}
              onChange={handleEditFormChange}
            />
            <InputCheck
              title="El lugar se encuentra en una zona roja"
              name="dangerArea"
              value={placeToEdit.dangerArea}
              checked={placeToEdit.dangerArea}
              onChange={handleCreateFormChange}
            />
            <InputCheck
              title="El lugar se encuentra en un área urbana"
              name="urbanArea"
              value={placeToEdit.urbanArea}
              checked={placeToEdit.urbanArea}
              onChange={handleCreateFormChange}
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
            <div className={styles.timesSection}>
              <InputTime
                title="Hora de apertura"
                name="openTime"
                value={placeToCreate.openTime}
                onChange={handleCreateFormChange}
                error={errors.openTime}
                onBlur={() => validateOpenTime(placeToCreate.openTime)}
                onFocus={clearError}
              />
              <InputTime
                title="Hora de cierre"
                name="closeTime"
                value={placeToCreate.closeTime}
                onChange={handleCreateFormChange}
                error={errors.closeTime}
                onBlur={() => validateCloseTime(placeToCreate.closeTime)}
                onFocus={clearError}
              />
            </div>
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
            {cities.length > 0 && (
              <>
                <InputSelect
                  title="Ciudad"
                  className={styles.inputSelect}
                  options={cities.map((city) => (
                    { value: city.id, title: city.name }))}
                  name="cityId"
                  value={placeToCreate.cityId}
                  onChange={handleCreateFormChange}
                  error={errors.cityId}
                  onBlur={() => validateCity(placeToCreate.cityId)}
                  onFocus={clearError}
                />
                <InputNumber
                  title="Distancia desde el centro (km)"
                  name="distanceFromCityCenter"
                  value={placeToCreate.distanceFromCityCenter}
                  onChange={handleCreateFormChange}
                  error={errors.distanceFromCityCenter}
                  onBlur={() => validateDistance(placeToCreate.distanceFromCityCenter)}
                  onFocus={clearError}
                />
              </>
            )}
            <InputCheck
              title="El lugar cuenta con parqueo"
              name="parking"
              value={placeToCreate.parking}
              onChange={handleCreateFormChange}
            />
            <InputCheck
              title="El lugar se encuentra en una zona roja"
              name="dangerArea"
              value={placeToCreate.dangerArea}
              onChange={handleCreateFormChange}
            />
            <InputCheck
              title="El lugar se encuentra en un área urbana"
              name="urbanArea"
              value={placeToCreate.urbanArea}
              onChange={handleCreateFormChange}
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
