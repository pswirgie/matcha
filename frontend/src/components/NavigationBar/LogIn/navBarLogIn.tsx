import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthProvider";
import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import SearchResultsList from "../SearchBar/SearchResultsList";
import SearchResult from "../SearchBar/types";
import "./navBarLogIn.css";

function NavBarLogIn() {

	const navigate = useNavigate();
	const { setUser } = useAuth();
	const { user } = useAuth();
	const [results, setResults] = useState<SearchResult[]>([]);

	async function handleDeconnexion() {
	
		const cookies = new Cookies();
		const token = cookies.get("sessionToken"); // used with api call
		try
		{
			const deleteSession = await fetch ("/api/db/deleteSession", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify( { username: user?.username} ),
			});
			if (!deleteSession.ok)
			{
				console.error(await deleteSession.text());
				return;
			}
			setUser(null);
			navigate("/");
		}
		catch (error)
		{
			console.error("Logout error :", error);
		}

	};

	return (
		<nav className="navbarLogIn">
			<div className="navbarLogIn-left">
				<a href="#logo-clownder" className="navbarLogIn_logo"></a>
				<div className="navbarLogIn-searchbar">
					<SearchBar setResults={setResults} />
					{/* avoir la searchbar ici pose probleme avce les input de register et login (case beaucoup + grandes)*/}
					{results.toString() != "" &&
						<div className="navbarLogIn-searchresults">
							<SearchResultsList results={results}/>
							{/* {results.toString() } */}
						</div>
					}
				</div>
				<div id="navbarLogIn-left">
					{/* <input className="search" placeholder="Search..">
					</input> */}
				</div>
				<a href="#meet" className="navbarLogIn_meet"></a>
			</div>
			<div className="navbarLogIn-right">
				<a href="#messageBox" className="navbarLogIn_messageBox"></a>
				<a href="#likes" className="navbarLogIn_heart"></a>
				<a href="#notifications" className="navbarLogIn_notifs"></a>
				<a href="#myProfile" className="navbarLogIn_myProfile"></a>
				<a
					href="#disconnect" className="navbarLogIn_deco"
					onClick={(e) => {
						e.preventDefault();
						handleDeconnexion();
					}}
				></a>
			</div>
		</nav>
	);
}

export default NavBarLogIn;