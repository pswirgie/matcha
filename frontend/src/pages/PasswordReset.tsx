import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton/CustomButton";
import { useState } from "react";
import NavBarLogOut from "../components/NavigationBar/LogOut/navBarLogOut";
import Background from "../components/Background/Background";

function PasswordReset()
{
	const [email, setEmail] = useState("");

	async function submit()
	{
		try
		{
			const response = await fetch("/api/auth/sendPasswordEmail", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({email})
			});
			if (!response.ok)
				throw new Error(await response.text());
		} catch (error: unknown)
		{
			if (error instanceof Error)
			{
				console.error(error.message);
				alert(error.message);
			}
			else
			{
				console.error("Unknown error.");
				alert("Unknown error.");
			}
			return;
		}
		alert(`An email has been sent to ${email}`);
	}

	return (
		<>
			<header>
				<NavBarLogOut></NavBarLogOut>
			</header>
			<Background>
				<div id="password-reset-container">
					<input id="email"
						placeholder="Your email..."
						autoComplete="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<CustomButton label="Submit" navigate={submit}></CustomButton>
				</div>
			</Background>
		</>
	);
}

export default PasswordReset;
