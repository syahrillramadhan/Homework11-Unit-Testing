import request from 'supertest';
import { app } from '../src/server.js';
import { prisma } from '../src/config/db.js';

let accessToken;

beforeAll(async () => {
    const userData = {
        name: 'testuser',
        email: 'testuser@mail.com',
        password: 'password',
        role: 'user'
    };

    const registerResponse = await request(app)
        .post('/api/register')
        .send(userData)
        .expect(200);

    console.log('Register Response:', registerResponse.body);

    const loginData = {
        email: 'testuser@mail.com',
        password: 'password'
    };

    const loginResponse = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(200);

    console.log('Login Response:', loginResponse.body);

    accessToken = loginResponse.body.accessToken;
});

afterAll(async () => {
    await prisma.todo.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
});

describe('Todo API', () => {
    it('should create a new todo', async () => {
        const todoData = {
            title: 'Mengcoding',
            description: 'Mencari error ehehe',
            dueDate: '2024-06-15T12:00:00Z'
        };

        const response = await request(app)
            .post('/api/create')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(todoData)
            .expect(201);

        console.log('Create Todo Response:', response.body);

        expect(response.body).toHaveProperty('message', 'Create Todo Success');
        expect(response.body.newTodo).toHaveProperty('title', 'Mengcoding');
    });

    it('should not create a todo with an existing title', async () => {
        const todoData = {
            title: 'Mengcoding',
            description: 'Mencari error ehehe',
            dueDate: '2024-06-15T12:00:00Z'
        };

        const response = await request(app)
            .post('/api/create')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(todoData)
            .expect(409);

        console.log('Duplicate Todo Response:', response.body);

        expect(response.body).toHaveProperty('message', 'Todo Already Exist');
    });

    it('should not create a todo without a title', async () => {
        const todoData = {
            description: 'Ga ada titlenya terus mau gimana bro??',
            dueDate: '2024-06-15T12:00:00Z'
        };

        const response = await request(app)
            .post('/api/create')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(todoData)
            .expect(400);

        console.log('Invalid Input Response:', response.body);

        expect(response.body).toHaveProperty('message', 'Invalid Input');
    });

    it('should delete a todo successfully', async () => {
        const todoData = {
            title: 'Todo untuk dihapus',
            description: 'Habis dibikin dihapus lagi :(',
            dueDate: '2024-06-15T12:00:00Z'
        };

        const createResponse = await request(app)
            .post('/api/create')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(todoData)
            .expect(201);

        const todoId = createResponse.body.newTodo.id;

        const response = await request(app)
            .delete(`/api/todo/${todoId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(201);

        console.log('Delete Todo Response:', response.body);

        expect(response.body).toHaveProperty('message', 'Delete Todo Success');
    });

    it('should update a todo successfully', async () => {
        const todoData = {
            title: 'Update todo abangkuhh',
            description: 'Harus di update sih ini',
            dueDate: '2024-06-15T12:00:00Z'
        };

        const createResponse = await request(app)
            .post('/api/create')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(todoData)
            .expect(201);

        const todoId = createResponse.body.newTodo.id;

        const updateData = {
            title: 'Mantab udah di update',
            description: 'Ini versi terbaru',
            dueDate: '2024-06-20T12:00:00Z'
        };

        const response = await request(app)
            .put(`/api/todo/update/${todoId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(updateData)
            .expect(200);

        expect(response.body).toHaveProperty('message', 'Update Todo Success');
        expect(response.body.updatedTodo).toHaveProperty('title', 'Update todo abangkuhh');
    });

    it('should not update a non-existing todo', async () => {
        const updateData = {
            title: 'Todo gaib yang tidack ada',
            description: 'This todo does not exist (student lain pakai basa enggres aku juga tipis2)',
            dueDate: '2024-06-20T12:00:00Z'
        };

        const response = await request(app)
            .put('/api/todo/update/999999')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(updateData)
            .expect(404);

        expect(response.body).toHaveProperty('message', 'Data Not Found');
    });

    it('should not update a todo with an existing title', async () => {
        const todoData = {
            title: 'Todo yang udah ada',
            description: 'This todo has an existing title (enggres lagi lah biar cakep)',
            dueDate: '2024-06-15T12:00:00Z'
        };

        await request(app)
            .post('/api/create')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(todoData)
            .expect(201);

        const anotherTodoData = {
            title: 'asdvadsoaebva (random)',
            description: 'This todo will be updated to have an existing title',
            dueDate: '2024-06-15T12:00:00Z'
        };

        const createResponse = await request(app)
            .post('/api/create')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(anotherTodoData)
            .expect(201);

        const todoId = createResponse.body.newTodo.id;

        const updateData = {
            title: 'asdvadsoaebva (random)',
            description: 'mencoba update tolong jangan error',
            dueDate: '2024-06-20T12:00:00Z'
        };

        const response = await request(app)
            .put(`/api/todo/update/${todoId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(updateData)
            .expect(409);

        expect(response.body).toHaveProperty('message', 'Todo Already Exist');
    });

    it('should get all todos', async () => {
        const response = await request(app)
            .get('/api/todos')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(response.body).toHaveProperty('message', 'Get All Todo Success');
        expect(response.body.todos).toBeInstanceOf(Array);
    });

    it('should get details of a todo by ID', async () => {
        const todoData = {
            title: 'Error tross',
            description: 'Error dimana lagi ini',
            dueDate: '2024-06-15T12:00:00Z'
        };

        const createResponse = await request(app)
            .post('/api/create')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(todoData)
            .expect(201);

        const todoId = createResponse.body.newTodo.id;

        const response = await request(app)
            .get(`/api/todo/details/${todoId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(response.body).toHaveProperty('message', 'Get Details Todo Success');
        expect(response.body.todo).toHaveProperty('id', todoId);
        expect(response.body.todo).toHaveProperty('title', 'Error tross');
    });

    it('should return 404 if todo ID is not found', async () => {
        const nonExistentId = 500;

        const response = await request(app)
            .get(`/api/todo/details/${nonExistentId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(404);

        expect(response.body).toHaveProperty('message', 'Data Not Found');
    });
});
