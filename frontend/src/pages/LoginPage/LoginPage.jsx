import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import waves from '../../assets/wave-haikei.svg';
import logo from '../../assets/logo/Logo.png';
import { button, blue } from '../../styles/buttons.module.css';
import useLogin from '../../hooks/useLogin';
// import BackgroundImg from '../../assets/fondos/fondo6.webp';
import InputText from '../../components/InputText/InputText';
import BottomWave from '../../components/BottomWave/BottomWave';
import styles from './LoginPage.module.css';

/* Componente de la página de login.
Maneja errores de inputs (usuario y contraseña) y utiliza el hook de useLogin para llamar a la API
y obtener un access token y un refresh token */
function LoginPage() {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const {
    login, error, loading,
  } = useLogin();

  const handleFormChange = (e) => {
    const field = e.target.name;
    const { value } = e.target;
    setForm((lastValue) => ({ ...lastValue, [field]: value }));
  };

  const clearErrors = () => {
    setErrors({});
  };

  const clearError = (e) => {
    setErrors((lastVal) => ({ ...lastVal, [e.target.name]: null }));
  };

  const validateEmail = () => {
    if (form?.email?.trim().length > 0) return true;
    setErrors((lastVal) => ({ ...lastVal, email: 'El email es obligatorio.' }));
    return false;
  };

  const validatePassword = () => {
    if (form?.password?.trim().length > 0) return true;
    setErrors((lastVal) => ({ ...lastVal, password: 'La contraseña es obligatoria.' }));
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearErrors();
    if (!(validateEmail() && validatePassword())) return;
    login(form);
  };

  return (
    <div className={styles.loginPageContainer}>
      <div className={styles.formContainer}>
        <img alt="CarpoolIt logo" className={styles.logoMobile} src={logo} />
        <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
          <img alt="CarpoolIt logo" className={styles.logo} src={logo} />
          <h1>Iniciar sesión</h1>
          <span
            className={styles.infoSpan}
          >
            Inicia sesión con tus credenciales.
          </span>
          <InputText
            title="Correo electrónico"
            name="email"
            onChange={handleFormChange}
            value={form?.email}
            error={errors?.email}
            onBlur={validateEmail}
            onFocus={clearError}
            style={{ maxWidth: '560px' }}
          />
          <InputText
            title="Contraseña"
            name="password"
            type="password"
            onChange={handleFormChange}
            value={form?.password}
            error={errors?.password}
            onBlur={validatePassword}
            onFocus={clearError}
            style={{ maxWidth: '560px' }}
          />
          {error && <div className={styles.errorMessage}>{error?.message ?? 'Ocurrió un error.'}</div>}
          <div className={styles.buttonWrapper}>
            {!loading && (<button className={`${button} ${blue}`} type="submit">Iniciar sesión</button>)}
            {loading && <Spinner />}
          </div>
          <p className={styles.newAccount}>
            ¿No tienes una cuenta?
            <Link className={styles.signUp} to="/signup">
              ¡Regístrate aquí!
            </Link>
          </p>
        </form>
      </div>
      <div className={styles.bottomWaveWrapper}>
        <BottomWave className={styles.wave} />
        <div className={styles.waveBody} />
      </div>
      <div className={styles.wavesWrapper}>
        <img alt="waves" className={styles.waves} src={waves} />
      </div>
      <div className={styles.backgroundWrapper} style={{ backgroundImage: 'url(https://transportation.ucla.edu/sites/default/files/styles/sf_landscape_16x9/public/media/images/carpool_0.jpg?h=69f2b9d0&itok=ZfWvGlfK)' }}>
        <div className={styles.backgroundFilter} />
      </div>
    </div>
  );
}

export default LoginPage;
