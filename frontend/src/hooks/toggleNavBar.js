import { useState } from 'react';

function toggleNavBar() {
  const [section, setSection] = useState('userTrips');
  const switchSection = (newSection) => setSection(newSection);

  return [section, switchSection];
}

export default toggleNavBar;
