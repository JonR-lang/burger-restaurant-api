function handleError(error) {
  let err = {
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    message: "",
  };
  if (error.message.includes("User validation failed")) {
    Object.values(error.errors).forEach(({ properties }) => {
      err[properties.path] = properties.message;
    });
  } else if (error.code === 11000) {
    err = { email: "This user already exists in our database" };
    err.message = "This user already exists";
  } else if (error.message.includes("Invalid user credentials")) {
    err.password = "Please input the right password";
    err.message = "Invalid Credentials";
  } else if (error.message.includes("User does not exist")) {
    err.email = "User does not exist";
    err.message = "Invalid Credentials";
  } else {
    err.message = error.message;
  }

  return err;
}

module.exports = {
  handleError,
};
