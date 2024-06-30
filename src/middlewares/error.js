const errorHandler = (error, req, res, next) => {
  console.log(error);

  if (error.name === "invalidInput")
    return res.status(400).json({
      message: "Invalid Input",
    });

  if (error.name === "exist")
    return res.status(409).json({
      message: "Email Already Use",
    });

  if (error.name === "notFound")
    return res.status(404).json({
      message: "Data Not Found",
    });

  if (error.name === "tokenRequired")
    return res.status(400).json({
      message: "Authentication Token Required",
    });

  if (error.name === "invalidToken")
    return res.status(400).json({
      message: "Invalid Token",
    });

  if (error.name === "invalidCredentials")
    return res.status(401).json({
      message: "Invalid Credentials",
    });

  if (error.name === "existTodo")
    return res.status(409).json({
      message: "Todo Already Exist",
    });

  if (error.name === "unauthorized")
    return res.status(403).json({
      message: "You are not authorized to access this todo",
    });

  res.status(500).json({
    message: "Internal Server Error",
  });
};

export { errorHandler };
