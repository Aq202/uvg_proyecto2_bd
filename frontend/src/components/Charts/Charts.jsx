import React, { useEffect, useState } from 'react';
import styles from './Charts.module.css';
import Table from '../Table';
import TableRow from '../TableRow';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import Spinner from '../Spinner';

function Charts() {
  const [top, setTop] = useState([]);
  const token = useToken();
  const {
    callFetch: getTop,
    result: resultGet,
    error: errorGet,
    loading: loadingGet,
  } = useFetch();

  const getUserTop = () => {
    getTop({
      uri: `${serverHost}/ride/user/top`,
      headers: { authorization: token },
    });
  };

  useEffect(() => {
    if (resultGet) {
      setTop(resultGet);
    }
  }, [resultGet]);

  useEffect(() => {
    getUserTop();
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.headerSection}>
        <p className={styles.title}>Dashboard</p>
      </div>
      {loadingGet && <Spinner />}
      {errorGet && <p>{`Ha ocurrido un error ${errorGet}`}</p>}
      {!errorGet && !loadingGet && top && top.length > 0 && (
        <>
          <div className={styles.headerSection}>
            <p className={styles.subTitle}>Top usuarios con más viajes completados</p>
          </div>
          <Table minCellWidth="50px" breakPoint="700px" showCheckbox={false} header={['Usuario', 'Viajes completados']}>
            {top.map((row) => (
              <TableRow key={row.user.id} id={row.user.id}>
                <td
                  className={styles.tableCell}
                >
                  {row.user.name}
                </td>
                <td
                  className={styles.tableCell}
                >
                  {row.totalTrips}
                </td>
              </TableRow>
            ))}
          </Table>
        </>
      )}
      <iframe
        title="dashboard"
        style={{
          background: '#F1F5F4',
          border: 'none',
          borderRadius: '2px',
          boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)',
          width: '100%',
          height: '160vh',
          overflow: 'visible',
        }}
        src="https://charts.mongodb.com/charts-project-0-iaphq/embed/dashboards?id=26679249-5e20-4228-8a57-acda8dffe230&theme=light&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=false&scalingWidth=fixed&scalingHeight=fixed"
      />
    </div>
  );
}

export default Charts;
