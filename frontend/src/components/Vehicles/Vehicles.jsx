/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import styles from './Vehicles.module.css';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import {
  button, blue, green, red,
} from '../../styles/buttons.module.css';
import { serverHost } from '../../config';
import Spinner from '../Spinner/Spinner';
import InputText from '../InputText';
import InputDate from '../InputDate';

function Vehicles() {
  const token = useToken();
  const [newVehicle, setNewVehicle] = useState({
    identification: '',
    brand: '',
    model: '',
    year: '',
    color: '#fff',
    type: 'Sedan',
    stillOwner: true,
    since: '',
    price: 0,
  });
  const [addingVehicle, setAddingVehicle] = useState(false);
  const [vehiclesData, setVehiclesData] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [errors, setErrors] = useState({});
  const vehicleTypes = ['SUV', 'Sedan', 'Pickup', 'Scooter', 'Motorbike', 'Jeep', 'Hatchback'];
  let generalError;

  const {
    callFetch: getVehicles, result: resultGetVehicles, loading, error,
  } = useFetch();
  const {
    callFetch: addVehicle, result: resultAdd, errorAdd,
  } = useFetch();

  const getVehiclesData = () => {
    getVehicles({
      uri: `${serverHost}/vehicle`,
      headers: { authorization: token },
    });
  };

  const clearError = (e) => {
    setErrors((lastVal) => ({ ...lastVal, [e.target.name]: null }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    getVehiclesData();
  }, []);

  useEffect(() => {
    if (resultAdd) getVehiclesData();
  }, [resultAdd]);

  useEffect(() => {
    if (resultGetVehicles || error?.status !== 404) {
      if (resultGetVehicles) setVehiclesData(resultGetVehicles);
      else setVehiclesData([]);
    }
  }, [resultGetVehicles, error]);

  const handleAddVehicle = () => {
    setAddingVehicle(true);
    vehiclesData.push(newVehicle);
  };

  const saveVehicle = () => {
    if (errors.length > 0) {
      generalError = 'Debe corregir los errores primero.';
    } else {
      console.log(newVehicle);
      try {
        addVehicle({
          uri: `${serverHost}/vehicle`,
          headers: { authorization: token },
          body: JSON.stringify(newVehicle),
          method: 'POST',
          parse: false,
        });
      } finally {
        setAddingVehicle(false);
        setNewVehicle({
          identification: '',
          brand: '',
          model: '',
          year: '',
          color: '#fff',
          type: 'Sedan',
          stillOwner: true,
          since: new Date(),
          price: 0,
        });
      }
    }
  };

  const haldleCancelAddVehicle = () => {
    setAddingVehicle(false);
    vehiclesData.pop();
    setNewVehicle({
      identification: '',
      brand: '',
      model: '',
      year: '',
      color: '#fff',
      type: 'Sedan',
      stillOwner: true,
      since: new Date(),
      price: 0,
    });
  };

  const setColor = (color) => {
    setNewVehicle((prev) => ({ ...prev, color }));
  };

  const validateVehiclePrice = () => {
    const reg = /^[0-9]+$/;
    if (!reg.test(newVehicle.price)) {
      setErrors((lastVal) => ({ ...lastVal, price: 'El precio debe ser un número.' }));
    }

    if (newVehicle.price < 0) {
      setErrors((lastVal) => ({ ...lastVal, price: 'El precio debe ser mayor o igual a 0.' }));
    }
  };

  const validateVehicleYear = () => {
    if (newVehicle.year > new Date().getFullYear()) {
      setErrors((lastVal) => ({ ...lastVal, year: 'El año debe ser menor o igual al actual.' }));
    }
    if (newVehicle.year.length === 0) {
      setErrors((lastVal) => ({ ...lastVal, year: 'Debe ingresar el año del vehículo.' }));
    }
  };

  const validateVehicleModel = () => {
    if (newVehicle.model.length === 0 || newVehicle.model.length > 100) {
      setErrors((lastVal) => ({ ...lastVal, model: 'El modelo debe tener entre 1 y 100 caracteres.' }));
    }
  };

  const validateVehicleBrand = () => {
    if (newVehicle.brand.length === 0 || newVehicle.brand.length > 100) {
      setErrors((lastVal) => ({ ...lastVal, brand: 'La marca debe tener entre 1 y 100 caracteres.' }));
    }
  };

  const validateVehicleId = () => {
    const reg = /^(P|M|O|C)[0-9][0-9][0-9][A-Z][A-Z][A-Z]$/;
    if (!reg.test(newVehicle.identification) || newVehicle.identification.length === 0) {
      setErrors((lastVal) => ({ ...lastVal, identification: 'La placa no es válida' }));
    }
  };

  const validateVehicleSince = () => {
    const fecha = new Date(newVehicle.since);
    if (newVehicle.since.length === 0 || fecha > new Date()) {
      setErrors((lastVal) => ({ ...lastVal, since: 'La fecha no es válida' }));
    }
  };

  console.log('vehiclesData', vehiclesData);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.headerSection}>
        <p className={styles.title}>Mis Vehículos</p>
      </div>
      {loading && <Spinner />}
      {(error || vehiclesData === undefined) && error?.status !== 404 && <div className={styles.errorMessage}>{error?.message ?? 'Ocurrió un error.'}</div>}
      {!loading && (!error || !(error?.status !== 404)) && vehiclesData !== undefined && (
        <div className={styles.vehiclesContainer}>
          <table style={{ width: addingVehicle ? '80%' : '60%' }}>
            <tbody>
              {vehiclesData.map((vehicle, index) => {
                let currentVehicleType = vehicleTypes.indexOf(newVehicle.type);
                if (index === vehiclesData.length - 1 && addingVehicle) {
                  return (
                    <tr key="adding">
                      <td style={{ paddingRight: '25px', maxWidth: '320px', position: 'relative' }}>
                        <div className={styles.slider}>
                          <button
                            className={styles.leftArrow}
                            type="button"
                            onClick={() => {
                              currentVehicleType = currentVehicleType > 0 ? currentVehicleType - 1
                                : vehicleTypes.length - 1;
                              setNewVehicle(
                                { ...newVehicle, type: vehicleTypes[currentVehicleType] },
                              );
                            }}
                          >
                            <FaAngleLeft />
                          </button>
                          <div className={styles.slide}>
                            {(() => {
                              switch (currentVehicleType) {
                                case 0:
                                  return <img style={{ backgroundColor: newVehicle.color }} src="/carTypes/suv.png" alt="SUV" />;
                                case 1:
                                  return <img style={{ backgroundColor: newVehicle.color }} src="/carTypes/sedan.png" alt="Sedan" />;
                                case 2:
                                  return <img style={{ backgroundColor: newVehicle.color }} src="/carTypes/pickup.png" alt="Pick-up" />;
                                case 3:
                                  return <img style={{ backgroundColor: newVehicle.color }} src="/carTypes/scooter.png" alt="Scooter" />;
                                case 4:
                                  return <img style={{ backgroundColor: newVehicle.color }} src="/carTypes/motorbike.png" alt="Motorbike" />;
                                case 5:
                                  return <img style={{ backgroundColor: newVehicle.color }} src="/carTypes/jeep.png" alt="Jeep" />;
                                case 6:
                                  return <img style={{ backgroundColor: newVehicle.color }} src="/carTypes/hatchback.png" alt="Hatchback" />;
                                default:
                                  return <img src="/carTypes/default.png" alt="Car" />;
                              }
                            })()}
                          </div>
                          <button
                            className={styles.rightArrow}
                            type="button"
                            onClick={() => {
                              currentVehicleType = currentVehicleType < vehicleTypes.length - 1
                                ? currentVehicleType + 1 : 0;
                              setNewVehicle(
                                { ...newVehicle, type: vehicleTypes[currentVehicleType] },
                              );
                            }}
                          >
                            <FaAngleRight />
                          </button>
                        </div>
                        <button
                          className={styles.colorpicker}
                          style={{ backgroundColor: newVehicle.color, zIndex: 99999 }}
                          type="button"
                          onClick={() => setShowColorPicker(!showColorPicker)}
                        >
                          <p className={styles.helperText}>Cambia el color de tu vehículo</p>
                          <div className={styles.colorPickerWindow} style={{ display: showColorPicker ? 'block' : 'none' }}>
                            <HexColorPicker color={newVehicle.color} onChange={setColor} />
                          </div>
                        </button>
                      </td>
                      <td className={styles.inputCell}>
                        <InputText
                          title="Placa"
                          name="identification"
                          value={newVehicle.identification}
                          onChange={handleChange}
                          error={errors.identification}
                          onFocus={clearError}
                          onBlur={validateVehicleId}
                          className={styles.inputText}
                        />
                      </td>
                      <td className={styles.inputCell}>
                        <InputText
                          title="Marca"
                          name="brand"
                          value={newVehicle.brand}
                          onChange={handleChange}
                          error={errors.brand}
                          onFocus={clearError}
                          onBlur={validateVehicleBrand}
                          className={styles.inputText}
                        />
                      </td>
                      <td className={styles.inputCell}>
                        <InputText
                          title="Modelo"
                          name="model"
                          value={newVehicle.model}
                          onChange={handleChange}
                          error={errors.model}
                          onFocus={clearError}
                          onBlur={validateVehicleModel}
                          className={styles.inputText}
                        />
                      </td>
                      <td className={styles.inputCell}>
                        <InputText
                          title="Año"
                          name="year"
                          value={newVehicle.year}
                          onChange={handleChange}
                          error={errors.year}
                          onFocus={clearError}
                          onBlur={validateVehicleYear}
                          className={styles.inputText}
                        />
                      </td>
                      <td className={styles.inputCell}>
                        <InputDate
                          title="Desde"
                          name="since"
                          onChange={handleChange}
                          error={errors.since}
                          onBlur={validateVehicleSince}
                          onFocus={clearError}
                          className={styles.inputText}
                        />
                      </td>
                      <td className={styles.inputCell}>
                        <InputText
                          title="Precio"
                          name="price"
                          value={newVehicle.price}
                          onChange={handleChange}
                          error={errors.price}
                          onFocus={clearError}
                          onBlur={validateVehiclePrice}
                          className={styles.inputText}
                        />
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={`${vehicle.identification}-${index + 0}`}>
                    {addVehicle && <td />}
                    <td style={{ paddingRight: '15px', maxWidth: '50px' }}>
                      {(() => {
                        switch (vehicle.type) {
                          case 'SUV':
                            return <img style={{ backgroundColor: `${vehicle.color.toLowerCase() !== 'white' ? vehicle.color : '#d6d6d6'}` }} src="/carTypes/suv.png" alt="SUV" />;
                          case 'Sedan':
                            return <img style={{ backgroundColor: `${vehicle.color.toLowerCase() !== 'white' ? vehicle.color : '#d6d6d6'}` }} src="/carTypes/sedan.png" alt="Sedan" />;
                          case 'Pickup':
                            return <img style={{ backgroundColor: `${vehicle.color.toLowerCase() !== 'white' ? vehicle.color : '#d6d6d6'}` }} src="/carTypes/pickup.png" alt="Pick-up" />;
                          case 'Scooter':
                            return <img style={{ backgroundColor: `${vehicle.color.toLowerCase() !== 'white' ? vehicle.color : '#d6d6d6'}` }} src="/carTypes/scooter.png" alt="Scooter" />;
                          case 'Motorbike':
                            return <img style={{ backgroundColor: `${vehicle.color.toLowerCase() !== 'white' ? vehicle.color : '#d6d6d6'}` }} src="/carTypes/motorbike.png" alt="Motorbike" />;
                          case 'Jeep':
                            return <img style={{ backgroundColor: `${vehicle.color.toLowerCase() !== 'white' ? vehicle.color : '#d6d6d6'}` }} src="/carTypes/jeep.png" alt="Jeep" />;
                          case 'Hatchback':
                            return <img style={{ backgroundColor: `${vehicle.color.toLowerCase() !== 'white' ? vehicle.color : '#d6d6d6'}` }} src="/carTypes/hatchback.png" alt="Hatchback" />;
                          default:
                            return <img src="/carTypes/default.png" alt="Car" />;
                        }
                      })()}
                    </td>
                    <td>{vehicle.identification}</td>
                    <td>{vehicle.brand}</td>
                    <td>{vehicle.model}</td>
                    <td>{vehicle.year}</td>
                  </tr>

                );
              })}
            </tbody>
          </table>
          {!addingVehicle
            && (
              <button
                className={`${button} ${blue}`}
                type="button"
                onClick={handleAddVehicle}
              >
                Nuevo vehículo
              </button>
            )}
          {(errorAdd || generalError) && <div className={styles.errorMessage}>{generalError ?? error?.message ?? 'Ocurrió un error.'}</div>}
          {addingVehicle
            && (
              <div className={styles.buttonsContainer}>
                <button
                  className={`${button} ${green}`}
                  type="button"
                  onClick={saveVehicle}
                >
                  Guardar
                </button>
                <button
                  className={`${button} ${red}`}
                  type="button"
                  onClick={haldleCancelAddVehicle}
                >
                  Cancelar
                </button>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

export default Vehicles;
