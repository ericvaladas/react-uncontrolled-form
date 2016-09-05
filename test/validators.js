function required() {
  return (value) => {
    if (Boolean(value) === true) {
      return true;
    }
    return 'Required';
  };
}

export {required};
