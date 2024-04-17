import React, { useEffect, useState } from 'react';
import { FcBusinesswoman, FcBusinessman } from 'react-icons/fc';
import styles from './Users.module.css';
import Spinner from '../Spinner/index';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import { serverHost } from '../../config';
import {
  button, green, red,
} from '../../styles/buttons.module.css';
import getRandomColor from '../../utils/getRandomColor';
import useSessionData from '../../hooks/useSessionData';

function Users() {
  const myInfo = useSessionData();
  const [users, setUsers] = useState([]);
  const {
    callFetch: fetchUsers,
    result: resultGet,
    error: errorGet,
    loading: loadingGet,
  } = useFetch();
  const {
    callFetch: fetchaddFriend,
    result: resultAdd,
    error: errorAdd,
    loading: loadingAdd,
  } = useFetch();
  const {
    callFetch: fetchRemoveFriend,
    result: resultRemove,
    error: errorRemove,
    loading: loadingRemove,
  } = useFetch();

  const token = useToken();

  const getUsers = () => {
    fetchUsers({
      uri: `${serverHost}/user/list`,
      headers: { authorization: token },
    });
  };

  const addFriend = (id) => {
    const newFriend = {
      idUser: id,
      relation: 'Amigo',
      closeLevel: 1,
    };
    fetchaddFriend({
      uri: `${serverHost}/user/addFriend`,
      method: 'POST',
      headers: { authorization: token },
      body: JSON.stringify(newFriend),
      parse: false,
    });
  };

  const removeFriend = (id) => {
    fetchRemoveFriend({
      uri: `${serverHost}/user/friend/${id}`,
      method: 'DELETE',
      headers: { authorization: token },
      parse: false,
    });
  };

  useEffect(() => {
    if (resultGet) {
      setUsers(resultGet);
    }
  }, [resultGet]);

  useEffect(() => {
    getUsers();
  }, [resultAdd, resultRemove]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.headerSection}>

        <p className={styles.title}>Usuarios</p>

      </div>
      {errorAdd && <div className={styles.errorMessage}>{errorAdd?.message ?? 'Ocurrió un error.'}</div>}
      {errorRemove && <div className={styles.errorMessage}>{errorRemove?.message ?? 'Ocurrió un error.'}</div>}
      {!errorGet && !loadingGet && !loadingAdd && !loadingRemove && (
        <div className={styles.subContainer}>
          <table className={styles.table}>
            {users?.map((user) => {
              const colors = getRandomColor();
              if (user.id === myInfo.id) {
                return null;
              }
              return (
                <tr className={styles.userContainer}>
                  <td>
                    <div className={styles.icon}>
                      {user.gender === 'F' && (
                        <FcBusinesswoman />
                      )}
                      {user.gender === 'M' && (
                        <FcBusinessman />
                      )}
                      <div
                        className={styles.letter}
                        style={{ backgroundColor: colors.background, color: colors.text }}
                      >
                        {user.name[0]}
                      </div>
                    </div>
                  </td>
                  <td>
                    {user.name}
                  </td>
                  <td>
                    {user.email}
                  </td>
                  <td>
                    {user.phone}
                  </td>
                  <td>
                    {user.isFriend ? (
                      <button
                        className={`${button} ${red}`}
                        type="button"
                        onClick={() => removeFriend(user.id)}
                      >
                        Eliminar amigo
                      </button>
                    ) : (
                      <button
                        className={`${button} ${green}`}
                        type="button"
                        onClick={() => addFriend(user.id)}
                      >
                        Agregar amigo
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
      )}
      {errorGet && <p>No se encontraron resultados</p>}
      {loadingGet && <Spinner />}
    </div>
  );
}

export default Users;
