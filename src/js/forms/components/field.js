import React from 'react';
import classNames from 'classnames';


export default React.createClass({
  children: [],

  getInitialState() {
    return {
      value: "",
      errorMessage: "",
      valid: true
    };
  },

  addPropsToChild(props) {
    this.children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, props);
    });
  },

  componentWillMount() {
    this.addPropsToChild({handleChange: this.handleChange});
  },

  componentDidMount() {
    this.validators = this.validators || [];
    let validators = this.props.validators;
    if (validators && validators.constructor === Array) {
      this.validators = this.validators.concat(validators);
    }
  },

  componentWillUpdate(nextProps, nextState) {
    if (this.state.errorMessage != nextState.errorMessage ) {
      this.addPropsToChild({
        handleChange: this.handleChange,
        errorMessage: nextState.errorMessage
      });
    }
  },

  validate() {
    for (let validator of this.validators) {
      if (!validator.validate(this.state.value)) {
        this.setState({
          valid: false,
          errorMessage: validator.errorMessage()
        });
        return false;
      }
    }
    this.setState({valid: true});
    return true;
  },

  handleChange(event) {
    switch (event.target.type) {
      case "text":
        this.setState({value: event.target.value}); break;
      case "checkbox":
        this.setState({value: event.target.checked}); break;
      default:
        break;
    }
  },

  render() {
    let className = classNames({
      'form-row': true,
      'invalid': !this.state.valid
    });

    return (
      <div className={className}>
        {this.children}
      </div>
    );
  }
});
