import 'babel-polyfill';
import React from 'react';
import ReactDom from 'react-dom';
import SimpleForm from './components/simple-form';
import ValidationForm from './components/validation-form';
import AdvancedForm from './components/advanced-form';

const App = React.createClass({
  render() {
    return (
      <div style={{marginBottom: "100px"}}>
        <SimpleForm/>
        <ValidationForm/>
        <AdvancedForm/>
      </div>
    );
  }
});

ReactDom.render(
  <App/>,
  document.getElementById('content')
);
