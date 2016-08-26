export default function() {
  return (value) => {
    if (!!value === true) {
      return true;
    }
    return "Required";
  };
};
