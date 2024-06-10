import { prisma } from '../config/db.js';

class Todo {
    static async create(params) {
        const data = await prisma.todo.create({
            data: params,
        });

        return data;
    }

    static async softDelete(id) {
        const data = await prisma.todo.update({
            where: {
                id: id
            },
            data: {
                deletedAt: new Date()
            },
        });

        return data;
    }

    static async update(id, params) {
        const data = await prisma.todo.update({
            where: {
                id: id
            },
            data: params,
        });

        return data;
    }
    static async update(id) {
        const data = await prisma.todo.update({
            where: {
                id: id
            },
            data: {
                deletedAt: null
            },
        });

        return data;
    }

    static async findAll() {
        const data = await prisma.todo.findMany({
            where: {
                deletedAt: null
            },
        });

        return data;
    }

    static async findById(id) {
        const data = await prisma.todo.findUnique({
            where: {
                id: id, deletedAt: null
            },
        });

        return data;
    }

    static async findTitle(title) {
        const data = await prisma.todo.findFirst({
            where: {
                title: title, deletedAt: null
            },
        });

        return data;
    }
}

export {
    Todo
}