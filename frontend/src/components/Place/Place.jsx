import React from 'react';
import PropTypes from 'prop-types';
import { FiEdit as EditIcon } from 'react-icons/fi';
import { RiDeleteBin6Line as DeleteIcon } from 'react-icons/ri';
import styles from './Place.module.css';

function Place({
  name, address, location, editPlace, deletePlace,
}) {
  return (
    <div className={styles.placeContainer}>
      <p className={styles.name}>{name}</p>
      <p className={styles.address}>{address}</p>
      <p className={styles.location}>{location}</p>
      <div className={styles.iconsSection}>
        <EditIcon className={styles.editIcon} onClick={editPlace} />
        <DeleteIcon className={styles.deleteIcon} onClick={deletePlace} />
      </div>
    </div>
  );
}

Place.propTypes = {
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  editPlace: PropTypes.func.isRequired,
  deletePlace: PropTypes.func.isRequired,
};

export default Place;
