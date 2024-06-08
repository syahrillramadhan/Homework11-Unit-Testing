import { TodoServices } from "../services/todo_services.js";

class TodoController {
    static async create(req, res, next) {
        try {
            const userId = req.token_id;
            const todo = req.body;

            const dataTodo = {
                title: todo.title,
                description: todo.description,
                dueDate: todo.dueDate,
                userId: userId,
            }

            const newTodo = await TodoServices.create(dataTodo);

            res.status(201).json({
                message: "Create Todo Success",
                newTodo
            });
        } catch (error) {
            next(error)
        }
    }

    static async softDelete(req, res, next) {
        try {
            const id = parseInt(req.params.id);

            await TodoServices.softDelete(id);
            res.status(201).json({
                message: 'Delete Todo Success'
            });
        } catch (error) {
            next(error)
        }
    }

    static async update(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const data = req.body;

            const updatedTodo = await TodoServices.update(id, data);

            res.status(200).json({
                message: 'Update Todo Success',
                updatedTodo
            });

        } catch (error) {
            next(error)
        }
    }

    static async getAll(req, res, next) {
        try {
            const todos = await TodoServices.getAll();

            res.status(200).json({
                message: 'Get All Todo Success',
                todos
            });
        } catch (error) {
            next(error)
        }
    }

    static async getById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const todo = await TodoServices.getById(id);

            res.status(200).json({
                message: 'Get Details Todo Success',
                todo
            });
        } catch (error) {
            next(error)
        }
    }
}

export {
    TodoController,
}