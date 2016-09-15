function required() {
  return (value) => {
    if (Boolean(value) === true) {
      return true;
    }
    return 'Required';
  };
}

function minLength(length) {
  return (value) => {
    if (value && value.length >= length) {
      return true;
    }
    return `Must be at least ${length} characters`;
  };
}

export {required, minLength};
