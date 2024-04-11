import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import parsePhoneNumber from 'libphonenumber-js';
import styles from './Profile.module.css';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import { button, blue } from '../../styles/buttons.module.css';
import { serverHost } from '../../config';
import countries from '../../assets/countries.ts';
import InputText from '../InputText/InputText';
import InputSelect from '../InputSelect/InputSelect';
import Spinner from '../Spinner/Spinner';
import useSessionData from '../../hooks/useSessionData';

function Profile() {
  const token = useToken();
  const [userData, setUserData] = useState(useSessionData());
  const [userInfo, setUserInfo] = useState(userData);
  const [profilePic, setProfilePic] = useState('');
  const [editable, setEditable] = useState(false);
  const { callFetch: getProfilePic, result: resultGetPP, error: errorGetPP } = useFetch();
  const {
    callFetch: updateUser, result: successUpdate, loading, error,
  } = useFetch();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (successUpdate) {
      setUserData(userInfo);
      const newInfo = { id: userInfo.id };
      if (userInfo.name && userInfo.name.length > 0) newInfo.name = userInfo.name;
      if (userInfo.email && userInfo.email.length > 0) newInfo.email = userInfo.email;
      if (userInfo.phone && userInfo.phone.length > 0) {
        newInfo.phone = userInfo.prefix + userInfo.phone;
      }
      sessionStorage.setItem('userData', JSON.stringify(newInfo));
    }
  }, [successUpdate]);

  useEffect(() => {
    const data = { ...userData };
    if (data.phone) {
      const parsedPhone = parsePhoneNumber(data.phone);
      data.prefix = parsedPhone ? `+${parsedPhone.countryCallingCode}` : '';
      data.phone = parsedPhone ? parsedPhone.nationalNumber : data.phone;
    }
    setUserData(data);
    setUserInfo(data);
  }, []);

  const updateUserInfo = () => {
    const newInfo = {};
    if (userInfo.name && userInfo.name.length > 0) newInfo.name = userInfo.name;
    if (userInfo.email && userInfo.email.length > 0) newInfo.email = userInfo.email;
    if (userInfo.phone && userInfo.phone.length > 0) {
      newInfo.phone = userInfo.prefix + userInfo.phone;
    }
    if (userInfo.password && userInfo.password.length > 0) newInfo.password = userInfo.password;
    updateUser({
      uri: `${serverHost}/user`,
      headers: { authorization: token },
      body: JSON.stringify(newInfo),
      method: 'PATCH',
      parse: false,
    });
  };

  const handleuserInfoChange = (e) => {
    const field = e.target.name;
    const { value } = e.target;
    setUserInfo((lastValue) => ({ ...lastValue, [field]: value }));
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
    if (userInfo?.name?.trim().length > 0) return true;
    setErrors((lastVal) => ({ ...lastVal, name: 'El nombre es obligatorio.' }));
    return false;
  };
  const validateEmail = () => {
    // validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (userInfo?.email?.trim().length > 0 && emailRegex.test(userInfo?.email)) return true;
    if (userInfo?.email?.trim().length > 0) return true;
    if (!userInfo.email || userInfo.email.trim().length <= 0) {
      setErrors((lastVal) => ({ ...lastVal, email: 'El email es obligatorio.' }));
      return false;
    }
    setErrors((lastVal) => ({ ...lastVal, email: 'El email no es válido.' }));
    return false;
  };
  const validatePhone = () => {
    // validate if phone is a number
    const phoneRegex = /^[0-9]+$/;
    if (userInfo?.phone?.trim().length > 0 && phoneRegex.test(userInfo?.phone)) return true;
    if (!userInfo.phone || userInfo.phone.trim().length <= 0) {
      setErrors((lastVal) => ({ ...lastVal, phone: 'El teléfono es obligatorio.' }));
      return false;
    }
    setErrors((lastVal) => ({ ...lastVal, phone: 'El teléfono debe ser un número.' }));
    return false;
  };
  const validatePassword = () => {
    if (!userInfo?.password?.trim().length || userInfo?.password?.trim().length <= 0) return true;
    if (userInfo?.repeatPassword !== userInfo?.password) {
      setErrors((lastVal) => ({ ...lastVal, password: 'Las contraseñas no coinciden.', repeatPassword: 'Las contraseñas no coinciden' }));
      return false;
    }
    if (userInfo?.password === userInfo?.repeatPassword) {
      delete errors.repeatPassword; delete errors.password;
    }
    return true;
  };
  const validateRepeatedPassword = () => {
    if (!userInfo?.password?.trim().length || userInfo?.password?.trim().length <= 0) return true;
    if (!userInfo?.repeatPassword?.trim().length || userInfo?.repeatPassword?.trim().length <= 0) {
      setErrors((lastVal) => ({ ...lastVal, repeatPassword: 'Debes verificar tu contraseña.' }));
      return false;
    }
    if (userInfo?.repeatPassword !== userInfo?.password) {
      setErrors((lastVal) => ({ ...lastVal, password: 'Las contraseñas no coinciden.', repeatPassword: 'Las contraseñas no coinciden' }));
      return false;
    }
    if (userInfo?.repeatPassword === userInfo?.password) {
      delete errors.repeatPassword;
      delete errors.password;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editable) {
      setEditable(true);
      return;
    }
    clearErrors();
    if (!(validateEmail() && validatePassword()
      && validateName() && validatePhone())) return;
    updateUserInfo();
    setEditable(false);
  };

  const prefixes = countries.map((country) => ({
    value: country.prefix,
    title: `${country.prefix} (${country.name})`,
  }));

  // const token = useToken();

  const getProfilePicture = () => {
    getProfilePic({
      uri: `${serverHost}/user/${userInfo.id}/image`,
      toJson: false,
      parse: false,
    });
  };

  useEffect(() => {
    (async () => {
      if (resultGetPP && !errorGetPP) {
        const blob = await resultGetPP.blob();
        const src = URL.createObjectURL(blob);
        setProfilePic(src);
      }
    })();
  }, [resultGetPP]);

  useEffect(() => {
    if (userInfo?.id) getProfilePicture();
  }, [userInfo]);

  useEffect(() => {
    if (error) setUserInfo(userData);
  }, [error]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.headerSection}>
        <p className={styles.title}>Mi Perfil</p>
      </div>
      <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
        <div className={styles.mainInfo}>
          <img src={profilePic || 'https://www.4x4.ec/overlandecuador/wp-content/uploads/2017/06/default-user-icon-8.jpg'} alt={userInfo.name} />
          <InputText
            disabled={!editable}
            title="Nombre"
            name="name"
            onChange={handleuserInfoChange}
            value={userInfo?.name}
            error={errors?.name}
            onBlur={validateName}
            onFocus={clearError}
            style={{ maxWidth: '560px' }}
          />
        </div>
        <div className={styles.aditionalInfo}>
          <InputText
            disabled={!editable}
            title="Correo electrónico"
            name="email"
            onChange={handleuserInfoChange}
            value={userInfo?.email}
            error={errors?.email}
            onBlur={validateEmail}
            onFocus={clearError}
            style={{ maxWidth: '560px' }}
          />
          <div className={styles.phone}>
            <InputSelect
              disabled={!editable}
              title="Prefijo"
              name="prefix"
              onChange={handleuserInfoChange}
              error={errors?.prefix}
              value={userInfo?.prefix}
              onFocus={clearError}
              options={prefixes}
              placeholder="Prefix"
              className={styles.prefix}
            />
            <InputText
              disabled={!editable}
              title="Teléfono"
              name="phone"
              onChange={handleuserInfoChange}
              value={userInfo?.phone}
              error={errors?.phone}
              onBlur={validatePhone}
              onFocus={clearError}
              style={{ maxWidth: '560px' }}
            />
          </div>
          <InputText
            disabled={!editable}
            title="Contraseña"
            name="password"
            type="password"
            onChange={handleuserInfoChange}
            value={userInfo?.password}
            error={errors?.password}
            onBlur={validatePassword}
            onFocus={clearError}
            style={{ maxWidth: '560px' }}
          />
          <InputText
            disabled={!editable || !userInfo.password}
            title="Confirmar Contraseña"
            name="repeatPassword"
            type="password"
            onChange={handleuserInfoChange}
            value={userInfo?.repeatPassword}
            error={errors?.repeatPassword}
            onBlur={validateRepeatedPassword}
            onFocus={clearError}
            style={{ maxWidth: '560px' }}
          />
        </div>
        {error && <div className={styles.errorMessage}>{error?.message ?? 'Ocurrió un error.'}</div>}
        <div className={styles.buttonWrapper}>
          {!loading
            && !editable && (
              <button className={`${button} ${blue}`} type="submit">Editar</button>)}
          {!loading && editable
            && (
              <>
                <button
                  className={`${button} ${blue}`}
                  type="button"
                  onClick={() => {
                    setEditable(false);
                    setUserInfo(userData);
                  }}
                >
                  Cancelar
                </button>
                <button className={`${button} ${blue}`} type="submit">Guardar</button>
              </>
            )}
          {loading && <Spinner />}
        </div>
      </form>
    </div>
  );
}

export default Profile;
