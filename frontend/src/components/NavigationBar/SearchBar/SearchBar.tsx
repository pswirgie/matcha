import { FaSearch } from "react-icons/fa";
import SearchResult from "./types";
import { useState, useEffect } from 'react';
import "./SearchBar.css";

export function useDebounce(value: string, delay = 300) {
	const [debounced, setDebounced] = useState(value);

	useEffect(() => {
		const id = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(id);
	}, [value, delay]);

	return debounced;
}

interface SearchBarProps {
	initialQuery?: string;
}

interface SearchBarProps {
	setResults: (results: SearchResult[]) => void;
}


export const SearchBar = ({ setResults }: SearchBarProps) => {
	const [ input, setInput ] = useState("");
	const debouncedQuery = useDebounce(input, 400);

	async function fetchData(value: string)
	{
		if (!value)
		{
			setResults([]);
			return ;
		}
		try
		{
			const fetchUser = await fetch (`http://localhost:3000/api/db/getUsers?input=${value}`);
			if (fetchUser.status == 400)
				return;
			console.log("Réponse reçue :", fetchUser);
			const usernames = await fetchUser.json();
			console.log(usernames);
			setResults(usernames);
		}
		catch (error)
		{
			console.error("SearchBar error :", error);
		}
	}

	// effect, always in composant directly, not in function
	useEffect(() => {
		fetchData(debouncedQuery); // launch every time input is modified
	}, [debouncedQuery]);

	const handleChange = (value: string) => {
		setInput(value);
	}

	return (
		<div className='SearchBarWrapper'>
			<FaSearch id="SearchBar-search-icon"/>
			<input
				className='SearchBar-input'
				placeholder="Search..."
				value={input}
				onChange={(e) => handleChange(e.target.value)}
				aria-label="Search input"
			/>
		</div>
	);
};

export default SearchBar;
