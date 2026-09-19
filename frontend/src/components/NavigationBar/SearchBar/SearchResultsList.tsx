import ResultPrint from "./ResultPrint";
import "./SearchResultsList.css"
import SearchResult from "./types"

interface SearchResultsListProps {
	results: SearchResult[];
}

export const SearchResultsList = ({ results }: SearchResultsListProps) => {

	return (
		<div className='results_list'>
			{results.map((result) => {
				return <ResultPrint username={result.username} />;
			}
			)}
		</div>
	);
}

export default SearchResultsList;
