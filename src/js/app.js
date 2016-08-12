import 'babel-polyfill';
import React from 'react';
import ReactDom from 'react-dom';
import TestForm from './components/test-form';

ReactDom.render(
  <TestForm/>,
  document.getElementById('content')
);
