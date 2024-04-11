import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import waves from '../../assets/wave-haikei.svg';
import logo from '../../assets/logo/Logo.png';
import { button, blue } from '../../styles/buttons.module.css';
// import BackgroundImg from '../../assets/fondos/fondo6.webp';
import InputText from '../../components/InputText/InputText';
import BottomWave from '../../components/BottomWave/BottomWave';
import styles from './SignUpPage.module.css';
import useSignUp from '../../hooks/useSignUp';
import InputSelect from '../../components/InputSelect/InputSelect';
import countries from '../../assets/countries.ts';
import useLogin from '../../hooks/useLogin';
import InputPhoto from '../../components/InputPhoto/InputPhoto';

/* Componente de la página de signUp.
Maneja errores de inputs (nombre, email, teléfono y contraseña) y utiliza el hook
de useSignUp para llamar a la API y obtener un access token. */
function SignUpPage() {
  const [form, setForm] = useState({ prefix: '+502' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const {
    signup, success, error, loading,
  } = useSignUp();
  const {
    login, success: loginSuccess, error: loginError, loading: loginLoading,
  } = useLogin();

  useEffect(() => {
    if (error || !success) return;
    login({ email: form.email, password: form.password });
  }, [success]);

  useEffect(() => {
    if (loginError || !loginSuccess) return;
    navigate('/');
  }, [loginSuccess]);

  const handleFormChange = (e) => {
    const field = e.target.name;
    const { value } = e.target;
    setForm((lastValue) => ({ ...lastValue, [field]: value }));
  };

  const handleImageChange = (value) => {
    setForm((lastVal) => ({ ...lastVal, photo: value }));
  };

  const clearErrors = () => {
    setErrors({});
  };

  const clearError = (e) => {
    const { name } = e.target;
    if (name === 'password' || name === 'repeatPassword') {
      delete errors.repeatPassword;
      delete errors.password;
    } else {
      delete errors[name];
    }
  };

  const validateName = () => {
    if (form?.name?.trim().length > 0) return true;
    setErrors((lastVal) => ({ ...lastVal, name: 'El nombre es obligatorio.' }));
    return false;
  };
  const validateEmail = () => {
    // validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (form?.email?.trim().length > 0 && emailRegex.test(form?.email)) return true;
    if (form?.email?.trim().length > 0) return true;
    if (!form.email || form.email.trim().length <= 0) {
      setErrors((lastVal) => ({ ...lastVal, email: 'El email es obligatorio.' }));
      return false;
    }
    setErrors((lastVal) => ({ ...lastVal, email: 'El email no es válido.' }));
    return false;
  };
  const validatePhone = () => {
    // validate if phone is a number
    const phoneRegex = /^[0-9]+$/;
    if (form?.phone?.trim().length > 0 && phoneRegex.test(form?.phone)) return true;
    if (!form.phone || form.phone.trim().length <= 0) {
      setErrors((lastVal) => ({ ...lastVal, phone: 'El teléfono es obligatorio.' }));
      return false;
    }
    setErrors((lastVal) => ({ ...lastVal, phone: 'El teléfono debe ser un número.' }));
    return false;
  };
  const validatePassword = () => {
    if (!form?.password?.trim().length || form?.password?.trim().length <= 0) {
      setErrors((lastVal) => ({ ...lastVal, password: 'La contraseña es obligatoria.' }));
      return false;
    }
    if (form?.repeatPassword !== form?.password) {
      setErrors((lastVal) => ({ ...lastVal, password: 'Las contraseñas no coinciden.', repeatPassword: 'Las contraseñas no coinciden' }));
      return false;
    }
    if (form?.password === form?.repeatPassword) {
      delete errors.repeatPassword; delete errors.password;
    }
    return true;
  };
  const validateRepeatedPassword = () => {
    if (!form?.repeatPassword?.trim().length || form?.repeatPassword?.trim().length <= 0) {
      setErrors((lastVal) => ({ ...lastVal, repeatPassword: 'Debes verificar tu contraseña.' }));
      return false;
    }
    if (form?.repeatPassword !== form?.password) {
      setErrors((lastVal) => ({ ...lastVal, password: 'Las contraseñas no coinciden.', repeatPassword: 'Las contraseñas no coinciden' }));
      return false;
    }
    if (form?.repeatPassword === form?.password) {
      delete errors.repeatPassword;
      delete errors.password;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearErrors();
    if (!(validateEmail() && validatePassword()
      && validateName() && validatePhone() && validateRepeatedPassword())) return;
    signup({
      name: form.name,
      email: form.email,
      phone: form.prefix + form.phone,
      password: form.password,
      photo: form.photo,
    });
  };

  const prefixes = countries.map((country) => ({
    value: country.prefix,
    title: `${country.prefix} (${country.name})`,
  }));

  return (
    <div className={styles.loginPageContainer}>
      <div className={styles.formContainer}>
        <img alt="CarpoolIt logo" className={styles.logoMobile} src={logo} />
        <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
          <img alt="CarpoolIt logo" className={styles.logo} src={logo} />
          <h1>Crear Usuario</h1>

          <InputPhoto onChange={handleImageChange} />
          <InputText
            title="Nombre"
            name="name"
            onChange={handleFormChange}
            value={form?.name}
            error={errors?.name}
            onBlur={validateName}
            onFocus={clearError}
            style={{ maxWidth: '560px' }}
          />
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
          <div className={styles.phone}>
            <InputSelect
              title="Prefijo"
              name="prefix"
              onChange={handleFormChange}
              error={errors?.prefix}
              value={form?.prefix}
              onFocus={clearError}
              options={prefixes}
              placeholder="Prefix"
              className={styles.prefix}
            />
            <InputText
              title="Teléfono"
              name="phone"
              onChange={handleFormChange}
              value={form?.phone}
              error={errors?.phone}
              onBlur={validatePhone}
              onFocus={clearError}
              style={{ maxWidth: '560px', minWidth: 0 }}
            />
          </div>
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
          <InputText
            title="Confirmar Contraseña"
            name="repeatPassword"
            type="password"
            onChange={handleFormChange}
            value={form?.repeatPassword}
            error={errors?.repeatPassword}
            onBlur={validateRepeatedPassword}
            onFocus={clearError}
            style={{ maxWidth: '560px' }}
          />
          {(error || loginError) && <div className={styles.errorMessage}>{error?.message ?? 'Ocurrió un error.'}</div>}
          <div className={styles.buttonWrapper}>
            {(!loading && !loginLoading) && (<button className={`${button} ${blue}`} type="submit">Registrarse</button>)}
            {(loading || loginLoading) && <Spinner />}
          </div>
          <p className={styles.newAccount}>
            ¿Ya tienes una cuenta?
            <Link className={styles.signUp} to="/login">
              ¡Inicia sesión!
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
      <div className={styles.backgroundWrapper} style={{ backgroundImage: 'url(https://pagregion.com/wp-content/uploads/sites/6/2022/10/car-pool-1500x1000.jpg)' }}>
        <div className={styles.backgroundFilter} />
      </div>
    </div>
  );
}

export default SignUpPage;
