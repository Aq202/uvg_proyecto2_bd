import React from 'react';
import styles from './MainPage.module.css';
import NavBar from '../../components/NavBar/NavBar';
import toggleNavBar from '../../hooks/toggleNavBar';
import BottomWave from '../../components/BottomWave';
import UserTrips from '../../components/UserTrips';
import FindTrips from '../../components/FindTrips';
import Places from '../../components/Places/Places';
import Profile from '../../components/Profile';
import Charts from '../../components/Charts';
import UploadUsers from '../../components/UploadUsers';

function MainPage() {
  const [currentSection, switchSection] = toggleNavBar();
  return (
    <div className={styles.mainPageContainer}>
      <NavBar handleNavBar={switchSection} />

      <div className={styles.bannerContainer}>
        <div className={styles.imageWrapper} />
        <BottomWave className={styles.bottomWave} />
      </div>

      <div className={styles.pageContent}>
        {currentSection === 'userTrips' && <UserTrips />}
        {currentSection === 'findTrips' && <FindTrips />}
        {currentSection === 'places' && <Places switchSection={switchSection} />}
        {currentSection === 'profile' && <Profile />}
        {currentSection === 'charts' && <Charts />}
        {currentSection === 'upload' && <UploadUsers />}
      </div>
    </div>
  );
}

export default MainPage;
