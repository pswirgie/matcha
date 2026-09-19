import { useAuth } from '../AuthProvider'
import NavBarLogIn from "../components/NavigationBar/LogIn/navBarLogIn";
import Background from "../components/Background/Background";

function Profile() {
	const { user } = useAuth();
	if (!user)
		return;

	return (
		<>
			<header>
				<NavBarLogIn></NavBarLogIn>
			</header>
			<Background>
				<div className="image"></div>
				<div id="profile">
					<p>Profile</p>
					<div>Username: {user.username}</div>
					<div>First name: {user.first_name}</div>
					<div>Last name: {user.last_name}</div>
					<div>Email: {user.email}</div>
					<div>Gender: {user.gender}</div>
					<div>City: {user.city}</div>
				</div>
			</Background>
		</>
	);
}

export default Profile;
