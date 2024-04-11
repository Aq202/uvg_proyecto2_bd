import React, { useEffect, useState } from 'react';
import { BiSolidCloudUpload } from 'react-icons/bi';
import jschardet from 'jschardet';
import styles from './UploadUsers.module.css';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import { serverHost } from '../../config';
import Spinner from '../Spinner/Spinner';

function Profile() {
  const token = useToken();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [users, setUsers] = useState([]);
  const {
    callFetch: uploadUsers, result: success, loading, error: errorUpload,
  } = useFetch();

  const clean = () => {
    setError(false);
    setErrorMessage('');
  };

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (file.type !== 'text/csv') {
      setError(true);
      setErrorMessage('Tipo de archivo incorrecto, debe adjuntar un archivo de tipo .csv');
      return;
    }
    const fileURL = URL.createObjectURL(file);
    const response = await fetch(fileURL);
    const buffer = await response.arrayBuffer();
    const detectedEncoding = jschardet.detect(new Uint8Array(buffer));
    const text = new TextDecoder(detectedEncoding.encoding).decode(buffer);
    const content = text.trim().split('\n');
    const headers = content[0].trim().split(',');
    if (headers.toString() !== ['name', 'email', 'phone', 'password'].toString()) {
      setError(true);
      setErrorMessage('Formato incorrecto. Se espera que los encabezados sean: "name, email, phone y password"');
      return;
    }
    const rows = content.slice(1).map((row) => row.trim().split(','));
    const data = rows.map((row) => headers.reduce((acc, header, index) => {
      acc[header] = row[index];
      return acc;
    }, {}));
    setUsers(data);
    clean();
  };

  useEffect(() => {
    const data = users.map((user) => ({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password,
    }));

    if (users.length) {
      uploadUsers({
        uri: `${serverHost}/user/upload`,
        headers: { authorization: token },
        body: JSON.stringify({ data }),
        method: 'POST',
        parse: false,
      });
    }
  }, [users]);

  return (
    <div className={styles.mainContainer}>
      {loading && <Spinner />}
      {errorUpload && <div className={styles.error}>{errorUpload.message ?? 'Error al agregar usuarios'}</div>}
      {success && !errorUpload && users.length !== 0
        && <div className={styles.success}>Usuarios agregados</div>}
      {users.length === 0 && !loading && !success && (
        <div className={styles.container}>
          <label htmlFor="importCSV">
            <BiSolidCloudUpload style={{ fontSize: '10em', color: '#16337F', margin: '-20px 0' }} />
            <h2>Importar información</h2>
            <p>Haz click o arrastra y suelta el archivo.</p>
            <input
              id="importCSV"
              type="file"
              onChange={handleChange}
            />
          </label>
          <p style={{
            color: 'red',
            display: `${error ? 'block' : 'none'}`,
            fontSize: '0.8em',
            textAlign: 'center',
          }}
          >
            {errorMessage}
          </p>
        </div>
      )}
    </div>
  );
}

export default Profile;
