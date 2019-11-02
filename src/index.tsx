import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

import App from './App';
import theme from './theme';
import * as serviceWorker from './serviceWorker';

const rootElement = document.getElementById('root');

const EntryComponent = (Comp: any) => (
  <ThemeProvider theme={theme}>
    <Comp />
  </ThemeProvider>
);

ReactDOM.render(EntryComponent(App), rootElement);

if ((module as any).hot) {
  (module as any).hot.accept('./App', () => {
    const NextApp = require('./App').default; // eslint-disable-line
    ReactDOM.render(
      EntryComponent(NextApp),
      rootElement,
    );
  });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
