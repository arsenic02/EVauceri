import React from 'react';
import GostProfil from '../komponente/GostProfil';
import StanodavacProfil from '../komponente/StanodavacProfil';
import InspektorProfil from '../komponente/InspektorProfil';
import { useAuthContext } from '../hooks/useAuthContext';

const Profil = () => {
  const { user } = useAuthContext();
  if (!user) {
    return <div>Loading...</div>;
  }

  let ProfileComponent;
  if (user.role === 'gost') {
    ProfileComponent = GostProfil;
  } else if (user.role === 'stanodavac') {
    ProfileComponent = StanodavacProfil;
  } else if (user.role === 'inspektor') {
    ProfileComponent = InspektorProfil;
  } else {
    ProfileComponent = () => <div>Unknown role</div>;
  }

  return (
    <div>
      <ProfileComponent />
    </div>
  );
};

export default Profil;
