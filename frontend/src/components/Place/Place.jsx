/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FiEdit as EditIcon } from 'react-icons/fi';
import { MdAddHome, MdOutlineCancel } from 'react-icons/md';
import { FaHome } from 'react-icons/fa';
import styles from './Place.module.css';
import parseBoolean from '../../helpers/parseBoolean';
import InputText from '../InputText';
import InputCheck from '../InputCheck/InputCheck';
import {
  button, blue, red,
} from '../../styles/buttons.module.css';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import Spinner from '../Spinner/Spinner';

function Place({
  id,
  name,
  address,
  location,
  parking,
  openTime,
  closeTime,
  editPlace,
  refetch,
  hasHome,
  homeId,
  right,
}) {
  const token = useToken();
  const [showHouse, setShowHouse] = useState(false);
  const [houseData, setHouseData] = useState({
    postalCode: '',
    isOwner: false,
    livesAlone: false,
  });
  const [errors, setErrors] = useState({});
  const {
    callFetch: saveHome, result: resultHome, loading, error,
  } = useFetch();

  const clearError = (e) => {
    setErrors((lastVal) => ({ ...lastVal, [e.target.name]: null }));
  };

  const clearHouse = () => {
    setHouseData({
      postalCode: '',
      isOwner: false,
      livesAlone: false,
    });
  };

  const handleChange = (e) => {
    const { name: inputName } = e.target;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setHouseData((prev) => ({ ...prev, [inputName]: value }));
  };

  const validatePostalCode = () => {
    // Validar que sean solo números
    const regex = /^[0-9]+$/;
    if (!regex.test(houseData.postalCode) || houseData.postalCode.length === 0) {
      setErrors((prev) => ({ ...prev, postalCode: 'El código postal no es válido' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    validatePostalCode();
    if (Object.values(errors).filter((v) => v !== null).length > 0) return;

    const info = {
      idLocation: id,
      postalCode: houseData.postalCode,
      isOwner: houseData.isOwner,
      livesAlone: houseData.livesAlone,
    };
    saveHome({
      uri: `${serverHost}/location/home`,
      headers: { authorization: token },
      body: JSON.stringify(info),
      method: 'POST',
      parse: false,
    });

    clearHouse();
    setShowHouse(false);
  };

  useEffect(() => {
    if (!resultHome) return;
    refetch();
  }, [resultHome, refetch]);

  return (
    <div className={styles.placeContainer}>
      <p className={styles.name}>{name}</p>
      <p className={styles.address}>{address}</p>
      <p className={styles.location}>{location}</p>
      <p className={styles.parking}>
        Zona de parqueo:
        {parseBoolean(parking) ? ' Sí' : ' No'}
      </p>
      <p className={styles.schedule}>
        Horario de apertura:
        {` ${openTime} - ${closeTime}`}
      </p>
      <div className={styles.iconsSection}>
        <div className={styles.homeContainer}>
          {!hasHome && id !== homeId
            && <MdAddHome className={styles.homeIcon} onClick={() => setShowHouse(true)} />}
          {hasHome && id === homeId
            && <FaHome className={styles.homeIcon} />}
          <p
            className={styles.helperText}
            style={{ right: right ? 'auto' : '70%', left: right ? '70%' : 'auto' }}
          >
            {(!hasHome && id !== homeId)
              ? 'Establecer como ubicación de tu domicilio'
              : 'Ubicación de tu domicilio'}
          </p>
        </div>
        <EditIcon className={styles.editIcon} onClick={editPlace} />
      </div>
      {error && <div className={styles.errorMessage}>{error?.message ?? 'Ocurrió un error.'}</div>}
      {showHouse && !loading && (
        <div className={styles.setHouseContainer}>
          {loading && <Spinner />}
          {!loading && !error && (
            <div className={styles.formContainer}>
              <button
                type="button"
                onClick={() => { setShowHouse(false); clearHouse(); }}
                className={styles.cancel}
              >
                <MdOutlineCancel />
              </button>
              <h3 className={styles.setHouseText}>Registrar hogar como domicilio</h3>
              <form className={styles.form} onSubmit={handleSubmit}>
                <InputText
                  title="Código postal"
                  name="postalCode"
                  value={houseData.postalCode}
                  onChange={handleChange}
                  error={errors.identification}
                  onFocus={clearError}
                  onBlur={validatePostalCode}
                  className={styles.inputText}
                />
                <InputCheck
                  title="Soy el propietario de este lugar"
                  name="isOwner"
                  value={houseData.isOwner}
                  onChange={handleChange}
                  className={styles.check}
                />
                <InputCheck
                  title="Vivo solo en este lugar"
                  name="livesAlone"
                  value={houseData.livesAlone}
                  onChange={handleChange}
                  className={styles.check}
                />
                <div className={styles.buttonsContainer}>
                  <button className={`${button} ${blue}`} type="submit">
                    Guardar
                  </button>
                  <button
                    className={`${button} ${red}`}
                    type="button"
                    onClick={() => { setShowHouse(false); clearHouse(); }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

Place.defaultProps = {
  right: false,
  refetch: () => { },
  hasHome: false,
  homeId: undefined,
};

Place.propTypes = {
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  parking: PropTypes.string.isRequired,
  openTime: PropTypes.string.isRequired,
  closeTime: PropTypes.string.isRequired,
  editPlace: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  refetch: PropTypes.func,
  right: PropTypes.bool,
  hasHome: PropTypes.bool,
  homeId: PropTypes.string,
};

export default Place;
