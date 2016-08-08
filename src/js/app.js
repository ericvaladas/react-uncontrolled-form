import 'babel-polyfill';
import React from 'react';
import ReactDom from 'react-dom';
import Form from './components/form';

ReactDom.render(
  <Form/>,
  document.getElementById('content')
);

