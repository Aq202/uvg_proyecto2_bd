import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FaLongArrowAltRight as ArrowIcon } from 'react-icons/fa';
import { RiDeleteBin6Line as DeleteIcon } from 'react-icons/ri';
import styles from './Trip.module.css';
import Button from '../Button';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import { serverHost } from '../../config';
import PopUp from '../PopUp/PopUp';
import usePopUp from '../../hooks/usePopUp';
import InputText from '../InputText';
import InputNumber from '../InputNumber/InputNumber';

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
  completed, // Pendiente: Verificar si ya se inició el viaje
  requests,
  deleteTrip,
  // editPlace,
}) {
  const { callFetch: joinRide, result: resultPost, loading: loadingPost } = useFetch();
  const { callFetch: acceptRequest, result: resultAccept, loading: loadingAccept } = useFetch();
  const { callFetch: submitRating, result: resultRating, loading: loadingRating } = useFetch();
  const { callFetch: submitComment, result: resultComment, loading: loadingComment } = useFetch();
  // const { callFetch: leaveRide, result: resultDelete, loading: loadingDelete } = useFetch();
  const [errors, setErrors] = useState({});
  const [joinMessage, setJoinMessage] = useState('Hola, ¿me podrías llevar?');
  const [passengerComment, setPassengerComment] = useState('¡Gracias por aceptarme!');
  const [rating, setRating] = useState(5);
  const token = useToken();
  const [isJoinOpen, openJoin, closeJoin] = usePopUp();
  const [isRequestsOpen, openRequests, closeRequests] = usePopUp();
  const [isRatingOpen, openRating, closeRating] = usePopUp();
  const [isCommentOpen, openComment, closeComment] = usePopUp();

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

  const handleComment = (e) => {
    const { value } = e.target;
    setPassengerComment(() => value);
  };

  const handleRating = (e) => {
    const { value } = e.target;
    setRating(() => value);
  };

  const validateJoinMessage = () => {
    const value = joinMessage;

    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, joinMessage: 'Se necesita enviar un mensaje al conductor' }));
      return false;
    }

    return true;
  };
  const validateComment = () => {
    const value = passengerComment;

    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, passengerComment: 'Se necesita un comentario para enviar al conductor' }));
      return false;
    }

    return true;
  };

  const validateRating = () => {
    const value = rating;

    if (!(value?.length > 0)) {
      setErrors((lastVal) => ({ ...lastVal, rating: 'Se necesita una calificación de 1 a 5' }));
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

  const assignPassenger = (rideId, userId) => {
    acceptRequest({
      uri: `${serverHost}/ride/${rideId}/assign/${userId}`,
      headers: { authorization: token },
      method: 'POST',
      parse: false,
    });
  };

  const postRating = () => {
    if (!validateRating) return;
    const body = { idRide: id, rating };
    submitRating({
      uri: `${serverHost}/ride/passenger/complete`,
      headers: { authorization: token },
      body: JSON.stringify(body),
      method: 'POST',
      parse: false,
    });
  };

  const postComment = () => {
    if (!validateRating) return;
    const body = { idRide: id, comment: passengerComment };
    submitComment({
      uri: `${serverHost}/ride/comment`,
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
    if (!resultAccept) return;
    closeRequests();
    callback();
  }, [resultAccept]);

  useEffect(() => {
    if (!resultRating) return;
    closeRating();
    callback();
  }, [resultRating]);

  useEffect(() => {
    if (!resultComment) return;
    closeComment();
    callback();
  }, [resultComment]);

  useEffect(() => {
    if (!isJoinOpen) return;
    setJoinMessage('Hola, ¿me podrías llevar?');
    setErrors({});
  }, [isJoinOpen]);

  useEffect(() => {
    if (!isRatingOpen) return;
    setRating(5);
    setErrors({});
  }, [isRatingOpen]);

  useEffect(() => {
    if (!isCommentOpen) return;
    setPassengerComment('¡Gracias por aceptarme!');
    setErrors({});
  }, [isCommentOpen]);

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

      {!owner && !joined && !completed && <Button className={styles.button} text="Solicitar unirse" onClick={openJoin} disabled={loadingPost} />}
      {!owner && joined && <Button className={styles.button} text="Enviar comentarios" onClick={openComment} disabled={loadingPost} />}
      {owner && (
        <div className={styles.actionsContainer}>
          <DeleteIcon className={styles.deleteIcon} onClick={deleteTrip} />
          <Button text="Solicitudes de pasajeros" onClick={openRequests} disabled={loadingPost} />
        </div>
      )}
      {!owner && completed && <Button className={styles.button} text="Calificar viaje" onClick={openRating} disabled={loadingPost} />}

      {isJoinOpen && (
        <PopUp close={closeJoin} closeWithBackground>
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
      {isRequestsOpen && (
        <PopUp close={closeRequests} closeWithBackground>
          <div className={styles.requestPopup}>
            <p className={styles.popUpTitle}>
              Aquí puedes aceptar o rechazar solicitudes de pasajeros para tu viaje
            </p>
            {requests && (
              <div className={styles.requestContainerTitle}>
                <p className={styles.requestTitle}>Solicitante</p>
                <p className={styles.requestTitle}>Mensaje</p>
              </div>
            )}
            {requests?.map((request) => (
              <div className={styles.requestContainer}>
                <p className={styles.requestName}>{request.user.name}</p>
                <p className={styles.requestMessage}>{request.message}</p>
                <div className={styles.requestButtonsContainer}>
                  <Button className={styles.requestButton} text="Aceptar" onClick={() => assignPassenger(id, request.user.id)} disabled={loadingAccept} />
                </div>
              </div>
            ))}
            {!requests && (
              <p>No tienes solicitudes pendientes</p>
            )}
          </div>
        </PopUp>
      )}
      {isRatingOpen && (
        <PopUp close={closeRating} closeWithBackground>
          <div className={styles.ratingPopup}>
            <p className={styles.popUpTitle}>
              ¿Cómo estuvo este viaje siendo pasajero?
            </p>
            <InputNumber
              title="Calificación"
              name="rating"
              value={rating}
              onChange={handleRating}
              error={errors.rating}
              onBlur={() => validateRating}
              onFocus={clearError}
            />
            <Button className={styles.joinButton} text="Enviar calificación" onClick={postRating} disabled={loadingRating} />
          </div>
        </PopUp>
      )}
      {isCommentOpen && (
        <PopUp close={closeComment} closeWithBackground>
          <div className={styles.joinRequest}>
            <p className={styles.popUpTitle}>
              Envía un comentario al conductor del viaje que te aceptó como pasajero
            </p>
            <InputText
              name="passengerComment"
              value={passengerComment}
              error={errors.passengerComment}
              onChange={handleComment}
              onBlur={validateComment}
              onFocus={clearError}
            />
            <Button className={styles.joinButton} text="Enviar comentario" onClick={postComment} disabled={loadingComment} />
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
  completed: PropTypes.bool.isRequired,
  deleteTrip: PropTypes.bool.isRequired,
  requests: PropTypes.arrayOf(PropTypes.shape({
    user: PropTypes.shape({
      gender: PropTypes.string,
      phone: PropTypes.string,
      name: PropTypes.string,
      id: PropTypes.string,
      email: PropTypes.string,
    }),
    date: PropTypes.string,
    approved: PropTypes.string,
    message: PropTypes.string,
  })),
};

Trip.defaultProps = {
  owner: false,
  realArrivalTime: '',
  realStartTime: '',
  comment: '',
  requests: null,
};

export default Trip;
