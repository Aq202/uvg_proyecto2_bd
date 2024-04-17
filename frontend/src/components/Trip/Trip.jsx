import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FaLongArrowAltRight as ArrowIcon } from 'react-icons/fa';
import styles from './Trip.module.css';
import Button from '../Button';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import { serverHost } from '../../config';
import PopUp from '../PopUp/PopUp';
import usePopUp from '../../hooks/usePopUp';
import InputText from '../InputText';

function Trip({
  id,
  location,
  originName,
  originAddress,
  destinationName,
  destinationAddress,
  driver,
  passengers,
  startTime,
  arrivalTime,
  realStartTime,
  realArrivalTime,
  comment,
  joined,
  callback,
  owner,
}) {
  const { callFetch: joinRide, result: resultPost, loading: loadingPost } = useFetch();
  // const { callFetch: leaveRide, result: resultDelete, loading: loadingDelete } = useFetch();
  const [errors, setErrors] = useState({});
  const [joinMessage, setJoinMessage] = useState('Hola, ¿me podrías llevar?');
  const token = useToken();
  const [isJoinOpen, openJoin, closeJoin] = usePopUp();

  /* const leaveTrip = () => {
    leaveRide({
      uri: `${serverHost}/ride/${id}/assignment`,
      headers: { authorization: token },
      method: 'DELETE',
      parse: false,
    });
  }; */

  const handleJoinMessage = (e) => {
    const { value } = e.target;
    setJoinMessage(() => value);
  };

  const validateJoinMessage = () => {
    const value = joinMessage;

    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, joinMessage: 'Se necesita enviar un mensaje al conductor' }));
      return false;
    }

    return true;
  };

  const clearError = (e) => {
    setErrors((lastVal) => ({ ...lastVal, [e.target.name]: null }));
  };

  const joinTrip = () => {
    if (!validateJoinMessage) return;
    const body = { idRide: id, message: joinMessage };
    joinRide({
      uri: `${serverHost}/ride/request`,
      headers: { authorization: token },
      body: JSON.stringify(body),
      method: 'POST',
      parse: false,
    });
  };

  useEffect(() => {
    if (!resultPost) return;
    closeJoin();
    callback();
  }, [resultPost]);

  useEffect(() => {
    if (!isJoinOpen) return;
    setJoinMessage('Hola, ¿me podrías llevar?');
    setErrors({});
  }, [isJoinOpen]);

  useEffect(() => {
  }, [joinMessage]);

  return (
    <div className={styles.tripContainer}>
      <p className={styles.location}>{location}</p>
      <div className={styles.headerSection}>
        <div className={styles.origin}>
          <p className={styles.placeName}>{originName}</p>
          <p className={styles.placeAddress}>{originAddress}</p>
        </div>
        <ArrowIcon className={styles.arrow} />
        <div className={styles.destination}>
          <p className={styles.placeName}>{destinationName}</p>
          <p className={styles.placeAddress}>{destinationAddress}</p>
        </div>
      </div>
      <div className={styles.infoSection}>
        <div className={styles.infoBlock}>
          <p className={styles.infoTitle}>Conductor:</p>
          <p className={styles.infoDescription}>{driver}</p>
        </div>
        <div className={styles.infoBlock}>
          <p className={styles.infoTitle}>Pasajeros:</p>
          <p className={styles.infoDescription}>{passengers}</p>
        </div>
        <div className={styles.infoBlock}>
          <p className={styles.infoTitle}>Salida estimada:</p>
          <p className={styles.infoDescription}>{startTime}</p>
        </div>
        <div className={styles.infoBlock}>
          <p className={styles.infoTitle}>Llegada estimada:</p>
          <p className={styles.infoDescription}>{arrivalTime}</p>
        </div>
        {realStartTime && (
        <div className={styles.infoBlock}>
          <p className={styles.infoTitle}>Salida real:</p>
          <p className={styles.infoDescription}>{realStartTime}</p>
        </div>
        )}
        {realArrivalTime && (
        <div className={styles.infoBlock}>
          <p className={styles.infoTitle}>Llegada real:</p>
          <p className={styles.infoDescription}>{realArrivalTime}</p>
        </div>
        )}
        {comment && (
        <div className={styles.comment}>
          <p className={styles.infoTitle}>Información adicional:</p>
          <p className={styles.infoDescription}>{comment}</p>
        </div>
        )}
      </div>

      {!owner && !joined && <Button className={styles.button} text="Solicitar unirse" onClick={openJoin} disabled={loadingPost} />}

      {isJoinOpen && (
        <PopUp close={closeJoin} closeButton>
          <div className={styles.joinRequest}>
            <p className={styles.popUpTitle}>Envía un mensaje al conductor del viaje</p>
            <InputText
              name="joinMessage"
              value={joinMessage}
              error={errors.joinMessage}
              onChange={handleJoinMessage}
              onBlur={validateJoinMessage}
              onFocus={clearError}
            />
            <Button className={styles.joinButton} text="Enviar solicitud" onClick={joinTrip} disabled={loadingPost} />
          </div>
        </PopUp>
      )}
    </div>
  );
}

Trip.propTypes = {
  id: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  originName: PropTypes.string.isRequired,
  originAddress: PropTypes.string.isRequired,
  destinationName: PropTypes.string.isRequired,
  destinationAddress: PropTypes.string.isRequired,
  driver: PropTypes.string.isRequired,
  passengers: PropTypes.number.isRequired,
  startTime: PropTypes.string.isRequired,
  arrivalTime: PropTypes.string.isRequired,
  realStartTime: PropTypes.string,
  realArrivalTime: PropTypes.string,
  comment: PropTypes.string,
  joined: PropTypes.bool.isRequired,
  callback: PropTypes.func.isRequired,
  owner: PropTypes.bool,
};

Trip.defaultProps = {
  owner: false,
  realArrivalTime: '',
  realStartTime: '',
  comment: '',
};

export default Trip;
