import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaLongArrowAltRight as ArrowIcon } from 'react-icons/fa';
import styles from './Trip.module.css';
import Button from '../Button';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import { serverHost } from '../../config';

function Trip({
  id,
  location,
  originName,
  originAddress,
  destinationName,
  destinationAddress,
  driver,
  passengers,
  time,
  joined,
  callback,
  owner,
}) {
  const { callFetch: joinRide, result: resultPost, loading: loadingPost } = useFetch();
  const { callFetch: leaveRide, result: resultDelete, loading: loadingDelete } = useFetch();
  const token = useToken();

  const joinTrip = () => {
    joinRide({
      uri: `${serverHost}/ride/${id}/assign`,
      headers: { authorization: token },
      method: 'POST',
      parse: false,
    });
  };

  const leaveTrip = () => {
    leaveRide({
      uri: `${serverHost}/ride/${id}/assignment`,
      headers: { authorization: token },
      method: 'DELETE',
      parse: false,
    });
  };

  useEffect(() => {
    if (!resultPost && !resultDelete) return;
    callback();
  }, [resultPost, resultDelete]);

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
          <p className={styles.infoTitle}>Salida:</p>
          <p className={styles.infoDescription}>{time}</p>
        </div>
      </div>
      {!owner && <Button className={styles.button} text={joined ? 'Salir' : 'Unirse'} red={joined} onClick={joined ? leaveTrip : joinTrip} disabled={loadingPost || loadingDelete} />}
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
  time: PropTypes.string.isRequired,
  joined: PropTypes.bool.isRequired,
  callback: PropTypes.func.isRequired,
  owner: PropTypes.bool,
};

Trip.defaultProps = {
  owner: false,
};

export default Trip;
