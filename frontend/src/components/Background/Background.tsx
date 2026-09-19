import React from 'react';
import "./Background.css";

export interface Props extends React.HTMLAttributes<HTMLDivElement> {}

function Background({ children, ...rest }: Props) {
	return (
		<div className='Background' {...rest}>
			{children}
		</div>
	);
}

export default Background;
