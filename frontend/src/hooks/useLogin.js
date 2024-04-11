import { useContext, useEffect } from 'react';
import { serverHost } from '../config';
import useFetch from './useFetch';
import SessionContext from '../context/SessionContext';

function useLogin() {
  const {
    callFetch, result, error, loading,
  } = useFetch();
  const { setAccessToken } = useContext(SessionContext);
  useEffect(() => {
    if (!result?.token) return;
    localStorage.setItem('accessToken', result.token);
    setAccessToken(result.token);
  }, [result]);

  const login = async ({
    email, password,
  }) => {
    const uri = `${serverHost}/user/login`;
    const body = JSON.stringify({ email, password });
    callFetch({
      uri, method: 'POST', body,
    });
  };

  return {
    login, success: result, error, loading,
  };
}
export default useLogin;
