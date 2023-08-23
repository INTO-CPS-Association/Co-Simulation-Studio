import { Dropdown, Stack, ThemeProvider } from '@fluentui/react';
import * as React from "react";

export default function ReactExample(props: any) {
	return (
		<div>
			<h1>{props.name}</h1>
			<ThemeProvider>
			<Stack tokens={props.stackTokens}>
				<Dropdown
					placeholder="Select an option"
					label="Basic uncontrolled example"
					options={props.options}
					styles={props.dropdownStyles}
				/>
			</Stack>
			</ThemeProvider>
		</div>
	);
}