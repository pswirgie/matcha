import "./navBarLogOut.css";
import logo from '../../../assets/images/icons/logo.png';

function NavBarLogOut() {

	return (
		<div className="navbarLogOut">
			<img className="navbarLogOut_image" src={logo} alt="Logo" />
			<div className="navbarLogOut_text">
				Clownder
			</div>
		</div>
	);
}

export default NavBarLogOut;