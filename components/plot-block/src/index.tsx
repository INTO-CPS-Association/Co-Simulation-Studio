import React from 'react';
import ReactDOM from 'react-dom';
import { spec, barData } from './App';
import { mergeStyles } from '@fluentui/react';
import reportWebVitals from './reportWebVitals';
import {Vega, VegaLite, createClassFromSpec} from 'react-vega';



// Inject some global styles
mergeStyles({
  ':global(body,html,#root)': {
    margin: 0,
    padding: 0,
    height: '100vh',
  },
});

//ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(
  <Vega spec={spec} data={barData} />,
  document.getElementById('bar-container')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
