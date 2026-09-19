import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton/CustomButton";
import NavBarLogOut from "../components/NavigationBar/LogOut/navBarLogOut";
import Background from "../components/Background/Background";

function Register() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [first_name, setFirstName] = useState("");
	const [last_name, setLastName] = useState("");
	const [gender, setGender] = useState("");
	const [email, setEmail] = useState("");
	const [city, setCity] = useState("");

	const navigate = useNavigate();
	const saltRounds = 10;

	async function register() {
		try {
			if (!username || !password || !repeatPassword || !first_name || !last_name || !gender || !email || !city)
			{
				alert("Do not leave empty fields.");
				return;
			}
			else if (/\s/.test(password) || password.length > 30 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^\w]/.test(password))
			{
				alert("Invalid password.");
				return;
			}
			else if (repeatPassword != password)
			{
				alert("Passwords don't match.");
				return;
			}

			const checkEmail = await fetch(`/api/auth/checkEmail?email=${email}`);

			if (!checkEmail.ok)
			{
				alert("Invalid email.");
				throw await checkEmail.text();
			}

			const addUser = await fetch("/api/db/addUser", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({username, password, first_name, last_name, gender, email, city})
			});

			if (addUser.status === 409)
			{
				const { usernameTaken, emailTaken } = await addUser.json();
				if (usernameTaken && emailTaken)
					alert("Username and email are already taken.");
				else if (usernameTaken)
					alert("Username is already taken.");
				else if (emailTaken)
					alert("Email is already taken.");
				throw await addUser.text();
			}

			if (!addUser.ok)
			{
				alert("Error!");
				throw await addUser.text();
			}

			const sendEmail = await fetch("/api/auth/sendEmail", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({email})
			});
			if (!sendEmail.ok)
			{
				alert("Error!");
				throw await sendEmail.text();
			}

			alert(`A confirmation Email was sent to your inbox at: ${email}`);
			navigate("/");
		} catch (error) {
			console.error("Register error :", error);
		}
	}

	function testField(id: string, condition: boolean)
	{
		const field = document.getElementById(id);
		if (condition)
			field!.style.backgroundColor = "#ff869ab9"
		else
			field!.style.backgroundColor = "#ffffffff"
	}

	function updatePasswordTexts(id: string, requirement: boolean, text: string)
	{
		const element = document.getElementById(id);
		element!.textContent = (requirement ? "✔ " : "✗ ") + text;
		element!.style.color = requirement ? "#259702b9" : "#97021ab9";
	}

	function updatePasswordRequirements(newPassword : string) {
		if (/\s/.test(newPassword))
			return;

		updatePasswordTexts("pw-requirement-length", newPassword.length >= 8, "At least 8 characters");
		// Regex to get from A to Z
		updatePasswordTexts("pw-requirement-caps", /[A-Z]/.test(newPassword), "At least 1 capitalized letter");
		// Regex to get from 0 to 9
		updatePasswordTexts("pw-requirement-digit", /[0-9]/.test(newPassword), "At least 1 digit");
		// Regex to get special characters
		updatePasswordTexts("pw-requirement-special", /[^\w]/.test(newPassword), "At least 1 special character (@, !, %, ...)");

		setPassword(newPassword);
		testField("pw-repeat", repeatPassword.length > 0 && repeatPassword != newPassword);
	}

	function updateRepeatPassword(newRepeatPassword : string)
	{
		if (/\s/.test(newRepeatPassword))
			return;

		setRepeatPassword(newRepeatPassword);
		testField("pw-repeat", password.length > 0 && newRepeatPassword.length > 0 && newRepeatPassword != password);
	}

	function isEmailInvalid(newEmail: string): boolean
	{
		if (newEmail.length == 0)
			return false;
		const parts = newEmail.split('@');
		if (parts.length != 2)
			return true;
		if (parts[0].length == 0 || parts[1].length == 0)
			return true;
		const secondPart = parts[1];
		if (newEmail.length > 0 && (!newEmail.includes('.') || secondPart.endsWith('.') || secondPart.startsWith('.')))
			return true;
		return false;
	}

	async function updateEmail(newEmail : string)
	{
		if (/\s/.test(newEmail))
			return;

		testField("input-email", isEmailInvalid(newEmail));
		setEmail(newEmail);
	}

	return (
		<>
			<header>
				<NavBarLogOut></NavBarLogOut>
			</header>
			<Background>
				<div id="registration">
					<h1>Register</h1>
					<input type="text" placeholder="Username" autoComplete="username" value={username}
						onChange={(event) => setUsername(event.target.value)}/>
					<input type="password" placeholder="Password" autoComplete="new-password" maxLength={30} value={password}
						onChange={(event) => updatePasswordRequirements(event.target.value)}/>
					<div id="pw-requirements">
						<p id="pw-requirement-length">✗ At least 8 characters</p>
						<p id="pw-requirement-caps">✗ At least 1 capitalized letter</p>
						<p id="pw-requirement-digit">✗ At least 1 digit</p>
						<p id="pw-requirement-special">✗ At least 1 special character (@, !, %, ...)</p>
					</div>
					<input id="pw-repeat" type="password" placeholder="Repeat your password" autoComplete="off" maxLength={30} value={repeatPassword}
						onChange={(event) => updateRepeatPassword(event.target.value)}/>
					<input type="text" placeholder="First name" autoComplete="given-name" value={first_name}
						onChange={(event) => setFirstName(event.target.value)}/>
					<input type="text" placeholder="Last name" autoComplete="family-name" value={last_name}
						onChange={(event) => setLastName(event.target.value)}/>
					<select value={gender} onChange={(event) => setGender(event.target.value)}>
						<option value="">Gender...</option>
						<option value="F">Female</option>
						<option value="M">Male</option>
						<option value="N">Not specified</option>
					</select>
					<input id="input-email" type="text" placeholder="Email" autoComplete="email" value={email}
						onChange={(event) => updateEmail(event.target.value)}/>
					<input type="text" placeholder="City" autoComplete="address-level2" value={city}
						onChange={(event) => setCity(event.target.value)}/>
					<CustomButton label="Register" navigate={register}></CustomButton>
				</div>
			</Background>
		</>
	);
}

export default Register;
