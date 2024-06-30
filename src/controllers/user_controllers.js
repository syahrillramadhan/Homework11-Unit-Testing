import { UserService } from "../services/user_services.js";

class UserController {
  static async registerUser(req, res, next) {
    try {
      const data = req.body;

      const newUser = await UserService.register(data);

      res.status(200).json({
        message: "Register Success",
        newUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async loginUser(req, res, next) {
    try {
      const data = req.body;

      const accessToken = await UserService.login(data);

      res.status(200).json({
        message: "Login Success",
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req, res, next) {
    try {
      const id = req.token_id;
      const data = req.body;

      const editUser = await UserService.edit(id, data);

      res.status(200).json({
        message: "Update User Success",
        editUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const id = req.token_id;

      const dropUser = await UserService.delete(id);

      res.status(200).json({
        message: "Delete User Success",
      });
    } catch (error) {
      next(error);
    }
  }
}

export { UserController };
