import { useState } from "react";
import {Eye, EyeOff} from "lucide-react";
import Cookies from 'universal-cookie';
import { useNavigate } from "react-router-dom";
import { useAuth, User } from "../AuthProvider";
import CustomButton from "../components/CustomButton/CustomButton";
import NavBarLogOut from "../components/NavigationBar/LogOut/navBarLogOut";
import Background from "../components/Background/Background";

function Login() {
	const [user, setUser] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const cookies = new Cookies();
	const handleToggle = () => setShowPassword((prev) => !prev);
	const navigate = useNavigate();
	const auth = useAuth();

	async function login() {
		try {
			const token = crypto.randomUUID();
			const response = await fetch("/api/db/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({username: user, password, token})
			});

			if (response.status == 400)
				alert("Username or password missing");
			else if (response.status == 404)
			{
				const { user, password } = await response.json();
				if (user)
					alert("Invalid username/email");
				else if (password)
					alert("Invalid password");
			}
			else if (response.status == 200)
			{
				const expirationDate = new Date();
				expirationDate.setDate(expirationDate.getDate() + 1);
				cookies.set("sessionToken", token, {
					maxAge: 3600, path: '/' });
				const value = cookies.get("sessionToken");
				const user: User = await response.json();
				auth.setUser(user);
				auth.setLoading(false);
				console.log(value);
				navigate("/profile");
			}
			else if (response.status == 500)
				throw await response.text();
		} catch (error) {
			console.error("Login error :", error);
		}
	}


	function passwordReset()
	{
		navigate("/passwordreset");
	}

	return (
		<>
			<header>
				<NavBarLogOut></NavBarLogOut>
			</header>
			<Background>
				<div id="login">
					<input
						type="text"
						placeholder="Username or email"
						value={user}
						autoComplete="username"
						onChange={(e) => setUser(e.target.value)}
					/>
					<input
						type={showPassword ? "text" : "password"}
						name="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete="current-password"
					/>
					<p id="forgot-password" onClick={(passwordReset)}>Forgot your password?</p>
					<CustomButton label="Login" navigate={login}></CustomButton>
				</div>
			</Background>
		</>
	);
}

export default Login;
