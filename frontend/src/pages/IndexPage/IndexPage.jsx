import React, { useEffect } from 'react';
import MainPage from '../MainPage/MainPage';
import useToken from '../../hooks/useToken';
import UnloggedIndexPage from '../UnloggedIndexPage/UnloggedIndexPage';
import WelcomeMessage from '../../components/WelcomeMessage/WelcomeMessage';
import usePopUp from '../../hooks/usePopUp';
import consts from '../../helpers/consts';

function IndexPage() {
  const token = useToken();
  const [isWelcomeOpen, openWelcome, closeWelcome] = usePopUp();
  let page;

  if (token === null) page = <UnloggedIndexPage />;
  else page = <MainPage />;

  useEffect(() => {
    if (!token) return;

    const firstAccess = sessionStorage.getItem(consts.firstAccessKey);

    if (firstAccess === null) return;

    // Si hay un valor 'firstAccess' es sessionStorage, mostrar mensaje
    sessionStorage.removeItem(consts.firstAccessKey);
    openWelcome();
  }, [token]);

  return (
    <>
      {page}
      <WelcomeMessage isOpen={isWelcomeOpen} close={closeWelcome} />
    </>
  );
}

export default IndexPage;
