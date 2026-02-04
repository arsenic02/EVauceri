import React from 'react';
import { useLogout } from '../hooks/useLogout'

function Footer() {
  const { logout } = useLogout()

    const handleClick = () => {
      logout()
    }
  return (
    <footer>
      <div className='footer'>
      <p>Copyright 2024 . Sva prava zadrzana.</p>
    {/* <button onClick={handleClick}>Log out</button>*/} 
                     
      </div>
    </footer>
  );
}

export default Footer;