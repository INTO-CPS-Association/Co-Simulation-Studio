import { Dropdown, Stack, TextField, ThemeProvider } from '@fluentui/react';
import * as React from "react";

export default function textfieldcompoent(props: any) {
	
	const [firstTextFieldValue, setFirstTextFieldValue] = React.useState('');
	const onChangeFirstTextFieldValue = React.useCallback(
	  (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
		setFirstTextFieldValue(newValue || '');
		props.props.setlivestreamkey(newValue)
	  },
	  [],
	);
	
	return (
		<div>
			<TextField
        		//label="Filter"
       			value={firstTextFieldValue}
     		    onChange={onChangeFirstTextFieldValue}
   			   />
		</div>
	);
}