import { TodoController } from "../controllers/todo_controller.js";
import express from 'express';

const todoRoutes = express.Router();

todoRoutes.get('/todos', TodoController.getAll);
todoRoutes.get('/todo/details/:id', TodoController.getById);
todoRoutes.post('/create', TodoController.create);
todoRoutes.put('/todo/update/:id', TodoController.update);
todoRoutes.delete('/todo/:id', TodoController.softDelete);

export {
    todoRoutes,
}
