import { useNavigate, useSearchParams } from "react-router-dom";
import CustomButton from "../components/CustomButton/CustomButton";
import { useState } from "react";
import NavBarLogOut from "../components/NavigationBar/LogOut/navBarLogOut";
import Background from "../components/Background/Background";

function PasswordChange()
{
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');

	if (!token)
		return navigate("/");

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

	async function submit()
	{
		if (password.length == 0 || repeatPassword.length == 0)
			return alert(`You cannot leave empty fields.`);
		try
		{
			const response = await fetch("/api/db/changePassword", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({token, password})
			});
			if (!response.ok)
				throw await response.text();
		} catch (error: any)
		{
			console.error(error.message);
			return;
		}
		alert(`Password changed! You can now login.`);
		navigate("/");
	}

	return (
		<>
			<header>
				<NavBarLogOut></NavBarLogOut>
			</header>
			<Background>
				<div id="password-reset-container">
					<input type="password" placeholder="New password" autoComplete="new-password" maxLength={30} value={password}
						onChange={(event) => updatePasswordRequirements(event.target.value)}/>
					<div id="pw-requirements">
						<p id="pw-requirement-length">✗ At least 8 characters</p>
						<p id="pw-requirement-caps">✗ At least 1 capitalized letter</p>
						<p id="pw-requirement-digit">✗ At least 1 digit</p>
						<p id="pw-requirement-special">✗ At least 1 special character (@, !, %, ...)</p>
					</div>
					<input id="pw-repeat" type="password" placeholder="Repeat your password" autoComplete="off" maxLength={30} value={repeatPassword}
						onChange={(event) => updateRepeatPassword(event.target.value)}/>
					<CustomButton label="Submit" navigate={submit}></CustomButton>
				</div>
			</Background>
		</>
	);
}

export default PasswordChange;
