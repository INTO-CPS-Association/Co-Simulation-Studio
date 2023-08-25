import { Dropdown, Stack, ThemeProvider, TextField } from '@fluentui/react';
import * as React from "react";

export default function setConstraintBase(props: any) {
const [firstTextFieldValue, setFirstTextFieldValue] = React.useState('');
  const onChangeFirstTextFieldValue = React.useCallback(
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setFirstTextFieldValue(newValue || '');
	  props.props.setConstraintRate(newValue)
    },
    [],
  );
	return (
		<div>
			
			<TextField
        value={firstTextFieldValue}
        onChange={onChangeFirstTextFieldValue}
		    disabled={!props.editing}
        hidden={!props.editing}
      />
		</div>
	);
}