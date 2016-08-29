import 'babel-polyfill';
import React from 'react';
import ReactDom from 'react-dom';
import SimpleForm from './components/simple-form';
import ValidationForm from './components/validation-form';

const App = React.createClass({
  render() {
    return (
      <div>
        <SimpleForm/>
        <ValidationForm/>
      </div>
    );
  }
});

ReactDom.render(
  <App/>,
  document.getElementById('content')
);
