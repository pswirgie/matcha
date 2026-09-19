import React from 'react';
import "./CustomButton.css";

export interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	label: string;
	navigate?: () => void;
}

function CustomButton(props: Props) {
	 const { label, navigate, ...rest } = props;

	return (
		<div className='customButton' onClick={navigate}>
			{label}
		</div>
	);
}

export default CustomButton;
