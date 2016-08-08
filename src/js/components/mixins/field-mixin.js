export default {
  getInitialState() {
    return {
      value: "",
      message: "",
      valid: true
    };
  },

  componentDidMount() {
    this.validators = this.validators || [];
    let validators = this.props.validators;
    if (validators && validators.constructor === Array) {
      this.validators = this.validators.concat(validators);
    }
  },

  validate() {
    for (let validator of this.validators) {
      if (!validator.validate(this.state.value)) {
        this.setState({
          valid: false,
          message: validator.errorMessage()
        });
        return false;
      }
    }
    this.setState({valid: true});
    return true;
  }
};
