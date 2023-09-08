import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './components/app.jsx'

const rootElement = document.getElementById('app');
const root = createRoot(rootElement);

root.render(
    <App />
);