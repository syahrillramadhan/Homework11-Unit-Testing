import { prisma } from '../config/db.js';

class User {
    static async create(params) {
        const data = await prisma.user.create({
            data: {
                name: params.name,
                email: params.email,
                password: params.password,
                role: params.role
            }
        });

        return data;
    }

    static async findEmail(email) {
        const data = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        return data;
    }

    static async findId(id) {
        const data = await prisma.user.findUnique({
            where: {
                id: id
            }
        });

        return data;
    }

    static async update(id, params) {
        const data = await prisma.user.update({
            where: {
                id: id
            }, data: {
                name: params.name,
                email: params.email,
                password: params.password,
                role: params.role
            }
        });

        return data;
    }

    static async destroy(id) {
        const data = await prisma.user.delete({
            where:{
                id: id
            }
        });

        return data;
    }
}

export {
    User
}