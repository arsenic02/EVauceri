import { Link } from "react-router-dom"
import { useLogout } from '../hooks/useLogout'
import { ImExit } from 'react-icons/im';

const Navbar = () => {
    const { logout } = useLogout()

    const handleClick = () => {
      logout()
    }
    return (
        <header>
            <div className="container">
                <Link to="/pocetna"> 
                    <h1>Е ваучери/ E vaučeri</h1>
                </Link>   
                <div>
                     <ImExit onClick={handleClick} style={{ cursor: 'pointer' }} />
                </div>        
            </div>
            
        </header>
    )
}

export default Navbar