import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../AuthProvider";
import { useSearchParams } from "react-router-dom";
import CustomButton from "../components/CustomButton/CustomButton";
import NavBarLogOut from "../components/NavigationBar/LogOut/navBarLogOut";
import Background from "../components/Background/Background";

function Home() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	useEffect(() => {
		const emailToken = searchParams.get('verify');

		if (!emailToken)
			return;

		navigate("/", { replace: true });
		verifyEmail(emailToken);
	})

	async function verifyEmail(token: string)
	{
		const response = await fetch("/api/db/verifyEmail", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({token})
		});
		if (!response.ok)
			alert(await response.text());
		else
			alert(`Email verified!`);
	}

	function register()
	{
		navigate("/register");
	}

	function login()
	{
		navigate("/login");
	}

	return (
		<>
			<header>
				<NavBarLogOut></NavBarLogOut>
			</header>
			<Background>
				<div id="home">
					<CustomButton label="Register" navigate={register}></CustomButton>
					<CustomButton label="Login" navigate={login}></CustomButton>
				</div>
			</Background>
		</>
	);
}

export default Home;
