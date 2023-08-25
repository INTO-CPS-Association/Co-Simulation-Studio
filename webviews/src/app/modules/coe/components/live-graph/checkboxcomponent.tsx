import { Checkbox, Dropdown, Stack, TextField, ThemeProvider } from '@fluentui/react';
import * as React from "react";
import{ useState } from 'react';

export default function checkboxcompoent(props: any) {

	const [isChecked, setIsChecked] = React.useState(false);
	const onChange = React.useCallback(
	  (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, newChecked?: boolean) => {
		{
			setIsChecked(!!newChecked);
			props.props.setgraph_externalwindow(isChecked)
		  	
		}
	  },
	  [],
	);
  

	return (
		<div>
			<Checkbox
			 name="externalWindow"
        	 checked={isChecked}
			 //disabled= {!props.editing}
			 onChange={onChange}
     	 />
		</div>
	);
}