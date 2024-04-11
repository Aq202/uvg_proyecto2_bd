import { useEffect } from 'react';
import { serverHost } from '../config';
import useFetch from './useFetch';
import consts from '../helpers/consts';

function useSignUp() {
  const {
    callFetch, result, error, loading,
  } = useFetch();

  useEffect(() => {
    if (!result?.id) return;
    sessionStorage.setItem(consts.firstAccessKey, '');
  }, [result]);

  const signup = async ({
    name, email, phone, password, photo,
  }) => {
    const uri = `${serverHost}/user`;
    const body = new FormData();

    body.append('name', name);
    body.append('email', email);
    body.append('phone', phone);
    body.append('password', password);
    body.append('photo', photo);
    callFetch({
      uri, method: 'POST', body, removeContentType: true,
    });
  };

  return {
    signup, success: result, error, loading,
  };
}
export default useSignUp;
