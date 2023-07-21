import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from './App';
import { PartialTheme, ThemeProvider, mergeStyles } from '@fluentui/react';
import reportWebVitals from './reportWebVitals';

// Inject global theme
const formTheme: PartialTheme = {
  palette: {
    themePrimary: '#0f8387',
    themeDark: '#324c4d',
  },
};

// Inject some global styles
mergeStyles({
  ':global(body,html,#root)': {
    margin: 10,
    padding: 0,
    height: '100vh',
  },
});

ReactDOM.render(
  <ThemeProvider theme={formTheme}>
    <Form />
  </ThemeProvider>
  , document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
