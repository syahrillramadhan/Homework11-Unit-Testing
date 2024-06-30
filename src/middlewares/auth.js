import { User } from "../repositories/user_repositories.js";
import { verifyToken } from "../lib/jwt.js";

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) throw { name: "tokenRequired" };

    const accessToken = token.split(" ")[1];

    if (!accessToken) throw { name: "invalidToken" };

    const decoded = verifyToken(accessToken);

    const data = await User.findId(decoded.id);

    if (!data) throw { name: "notFound" };

    req.data = data;
    req.token_id = decoded.id;

    next();
  } catch (error) {
    next(error);
  }
};

const authorization = async (req, res, next) => {
  try {
    const userId = req.token_id;
    const todoId = parseInt(req.params.id);

    const todo = await Todo.findById(todoId);

    if (!todo) {
      throw { name: "notFound" };
    }

    if (todo.userId !== userId) {
      throw { name: "unauthorized" };
    }

    next();
  } catch (error) {
    next(error);
  }
};

export { authentication, authorization };
