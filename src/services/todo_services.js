import { Todo } from "../repositories/todo_repositories.js";

class TodoServices {
    static async create(params) {
        if (!params.title) throw { name: 'invalidInput' }
        
        const todo = await Todo.findTitle(params.title);
        
        if (todo) throw { name: 'existTodo' }

        const newTodo = await Todo.create(params);

        return newTodo;
    }

    static async softDelete(id) {
        const todo = await Todo.findById(id);

        if (!todo) throw { name: 'notFound' }

        const deleteTodo = await Todo.softDelete(id);

        return deleteTodo;
    }

    static async update(id, params) {
        const todo = await Todo.findById(id);

        if (!params || Object.keys(params).length === 0) throw { name: 'invalidInput' }

        if (!todo) throw { name: 'notFound' }

        const existingTodo = await Todo.findTitle(params.title);

        if (existingTodo) throw { name: 'existTodo' }

        const updatedTodo = await Todo.update(id, params);

        return updatedTodo;
    }

    static async getAll() {
        const data = await Todo.findAll();

        return data;
    }

    static async getById(id) {
        const todo = await Todo.findById(id);

        if (!todo) throw { name: 'notFound' }

        return todo;
    }
}

export {
    TodoServices
}