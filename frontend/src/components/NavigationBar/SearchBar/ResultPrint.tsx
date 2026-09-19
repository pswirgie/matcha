import "./ResultPrint.css";

interface ResultPrintProps {
	username: string;
}

export const ResultPrint = ( {username}: ResultPrintProps ) => {
	return (<div className="result_print" onClick={(e) => alert(`You clicked on ${username}`)}> {username} </div>)

}

export default ResultPrint;



