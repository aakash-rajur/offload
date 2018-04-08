import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
// eslint-disable-next-line import/no-webpack-loader-syntax
import workerSource from 'worker-loader!./worker'
import {configure} from 'offload';

import './index.css'
import App from './App'

configure({source: workerSource, threads: 2, tasks: 4});

ReactDOM.render(<Router><App/></Router>,
	document.getElementById('root'));
