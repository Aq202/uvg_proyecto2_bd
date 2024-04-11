/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import { FaCarSide as CarIcon } from 'react-icons/fa6';
import { BsPersonRaisedHand as PersonIcon } from 'react-icons/bs';
import styles from './NavBar.module.css';

function NavBar({ handleNavBar }) {
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className={styles.mainContainer}>

      <div className={styles.iconContainer}>
        <CarIcon className={styles.carIcon} />
        <PersonIcon className={styles.personIcon} />
      </div>

      <div className={styles.bar}>

        <div className={styles.section} onClick={handleLogout}>
          <p>Cerrar Sesión</p>
        </div>
        <div className={styles.options}>
          <div className={styles.section} onClick={() => handleNavBar('findTrips')}>
            <p>Encontrar viajes</p>
          </div>

          <div className={styles.section} onClick={() => handleNavBar('userTrips')}>
            <p>Mis viajes</p>
          </div>

          <div className={styles.section} onClick={() => handleNavBar('places')}>
            <p>Lugares</p>
          </div>

          <div className={styles.section} onClick={() => handleNavBar('profile')}>
            <p>Perfil</p>
          </div>
          <div className={styles.section} onClick={() => handleNavBar('charts')}>
            <p>Dashboard</p>
          </div>
          <div className={styles.section} onClick={() => handleNavBar('upload')}>
            <p>Subir CSV</p>
          </div>
        </div>
      </div>
    </div>
  );
}

NavBar.propTypes = {
  handleNavBar: PropTypes.func.isRequired,
};

export default NavBar;
