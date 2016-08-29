function minLength(length) {
  return (value) => {
    if (value && value.length >= length) {
      return true;
    }
    return `Must be at least ${length} characters`
  };
}

function passwordEquals(password) {
  return (value) => {
    if (password() === value) {
      return true;
    }
    return "Password does not match";
  };
};

function required() {
  return (value) => {
    if (!!value === true) {
      return true;
    }
    return 'Required';
  };
};

export {minLength, passwordEquals, required};
