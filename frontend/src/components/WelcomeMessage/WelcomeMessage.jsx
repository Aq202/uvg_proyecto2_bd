import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { IoClose as CloseIcon } from 'react-icons/io5';
import ConfettiGenerator from 'confetti-js';
import logo from '../../assets/logo/logo_blanco.png';
import styles from './WelcomeMessage.module.css';
import useSessionData from '../../hooks/useSessionData';

function WelcomeMessage({ isOpen, close }) {
  const session = useSessionData();

  const canvasRef = useRef();

  useEffect(() => {
    if (!canvasRef.current) return;
    const confettiSettings = {
      target: canvasRef.current,
      max: '80',
      size: '1',
      animate: true,
      props: ['circle', 'square', 'triangle', 'line'],
      colors: [
        [165, 104, 246],
        [230, 61, 135],
        [0, 199, 228],
        [253, 214, 126],
      ],
      clock: '15',
      rotate: true,
      width: '1536',
      height: '707',
      start_from_edge: false,
      respawn: true,
    };
    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();

    // eslint-disable-next-line consistent-return
    return () => confetti.clear();
  }, [canvasRef.current, isOpen]);

  return (
    isOpen && (
      <div className={styles.welcomeMessage}>
        <canvas ref={canvasRef} className={styles.confettiCanvas} />
        {session && (
          <div className={styles.container}>
            <CloseIcon
              className={styles.closeIcon}
              onClick={close}
              onKeyUp={close}
              tabIndex={0}
              role="button"
            />
            <img src={logo} alt="Logo asigbo" className={styles.logo} />
            <h1 className={styles.mainTitle}>
              {`¡Hola, ${session?.name}!`}
            </h1>
            <p className={styles.content}>
              ¡Te damos una calurosa bienvenida a
              <span style={{ fontFamily: 'Open Sans', textTransform: 'uppercase' }}>
                {' '}
                Carpool
                <span style={{ color: '#FFD600' }}>It</span>
              </span>
              , tu destino para
              compartir viajes y hacer que cada trayecto cuente! 🚗✨
              <br />
              <br />
              Imagina un mundo donde cada auto en la carretera tiene más de un
              ocupante, reduciendo la congestión, disminuyendo las emisiones y
              ahorrando dinero. ¡Eso es lo que estamos construyendo juntos!
              <br />
              <br />
              Así que, únete a nosotros para viajes más eficientes, conexiones
              significativas y un impacto positivo en nuestro planeta. ¡
              <span style={{ fontFamily: 'Open Sans', textTransform: 'uppercase' }}>
                Carpool
                <span style={{ color: '#FFD600' }}>It </span>
              </span>
              es tu viaje, tu elección, nuestro futuro!
              <br />
              <br />
              ¡Bienvenido a bordo y que tus viajes estén llenos de buenos momentos
              y experiencias compartidas! 🌎🚗✨
            </p>
          </div>
        )}
      </div>
    )
  );
}

export default WelcomeMessage;

WelcomeMessage.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
};

WelcomeMessage.defaultProps = {
  isOpen: false,
  close: null,
};
