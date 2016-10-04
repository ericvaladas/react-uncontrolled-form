function required() {
  return (value) => {
    if (Boolean(value) === false) {
      return 'Required';
    }
  };
}

function minLength(length) {
  return (value) => {
    if (!value || value.length < length) {
      return `Must be at least ${length} characters`;
    }
  };
}

export {required, minLength};
