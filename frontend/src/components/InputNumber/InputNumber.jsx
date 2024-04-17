import React from 'react';
import PropTypes from 'prop-types';
import randomId from '../../helpers/randomString';
import styles from './InputNumber.module.css';

function InputNumber({
  title, error, value, onChange, onBlur, onFocus, name, className, disabled, ...props
}) {
  const id = randomId(15);
  return (
    <div className={`${styles.inputTextContainer} ${error ? styles.error : ''} ${className}`}>
      <input
        className={styles.inputField}
        type="number"
        step="0.1"
        {...props}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
      />
      <label className={styles.inputLabel} htmlFor={id}>
        <div className={styles.labelText}>{title}</div>
      </label>
      {error && <span className={styles.inputError}>{error}</span>}
    </div>
  );
}

InputNumber.propTypes = {
  title: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  value: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

InputNumber.defaultProps = {
  error: null,
  value: '',
  name: randomId(15),
  onChange: null,
  onBlur: null,
  onFocus: null,
  title: null,
  className: '',
  disabled: false,
};

export default InputNumber;
