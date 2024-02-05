function handleError(error) {
  let err = {
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
  };
  if (error.message.includes("User validation failed")) {
    Object.values(error.errors).forEach(({ properties }) => {
      err[properties.path] = properties.message;
    });
  } else if (error.code === 11000) {
    err = { email: "This email already exists in our database" };
  } else if (error.message.includes("Invalid user credentials")) {
    err.password = "Please input the right password";
  } else if (error.message.includes("User does not exist")) {
    err.email = "User does not exist";
  }

  return err;
}

module.exports = {
  handleError,
};
