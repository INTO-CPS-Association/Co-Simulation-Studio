import { Dropdown, Stack, ThemeProvider } from '@fluentui/react';
import * as React from "react";
import { Component } from 'react';

export class YourComponent extends Component {
	override state = {
	  reload: false,
	  hello: 'world'
	};
  
	refreshPage = () => {
	  this.setState(
		{reload: true},
		() => this.setState({reload: false, hello: 'denmark'})
	  )
	}

	override render(): React.ReactNode {
		return (
			<div>
				Here we {this.state.hello} this asdasd
				<button onClick={this.refreshPage}>Refresh Page</button>
			</div>
		);
	}
  }

  

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