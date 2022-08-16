import React from 'react';
// import ReactDOM from 'react-dom'; // For react 17
import ReactDOM from 'react-dom/client'; // For react 18: 
import App from './App';
import './index.css';

import { FronteggProvider } from '@frontegg/react';

const contextOptions = {
  baseUrl: 'https://app-y8nl5gclroex.frontegg.com',
  clientId: 'f445b669-fce6-45db-9804-d2aa48a09c2a'
};

// // For react 18: 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
// ReactDOM.render(
    <FronteggProvider contextOptions={contextOptions} hostedLoginBox={true}>
        <App />
    </FronteggProvider>,
    // document.getElementById('root')
);