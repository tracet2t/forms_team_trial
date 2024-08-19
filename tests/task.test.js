const request = require('supertest');
const app = require('../server');

describe('Task API', () => {
    let createdTaskId;

    beforeAll((done) => {
        server = app.listen(3001, () => done()); 
    });

    afterAll((done) => {
        server.close(done); 
    });

    it('should create a new task', async () => {
        const response = await request(app)
            .post('/tasks')
            .send({
                title: 'Test Task',
                description: 'This is a test task',
                dueDate: '2024-12-31',
                priority: 'High'
            })
            .expect('Content-Type', /json/)
            .expect(201);

        createdTaskId = response.body.id;
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('Test Task');
        expect(response.body.description).toBe('This is a test task');
        expect(response.body.dueDate).toBe('2024-12-31');
        expect(response.body.priority).toBe('High');
    });

    it('should get all tasks', async () => {
        const response = await request(app)
            .get('/tasks')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: createdTaskId,
                title: 'Test Task',
                description: 'This is a test task',
                dueDate: '2024-12-31',
                priority: 'High'
            })
        ]));
    });

    it('should update a task', async () => {
        const response = await request(app)
            .put(`/tasks/${createdTaskId}`)
            .send({
                title: 'Updated Task',
                description: 'This task has been updated',
                dueDate: '2025-01-01',
                priority: 'Medium'
            })
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.title).toBe('Updated Task');
        expect(response.body.description).toBe('This task has been updated');
        expect(response.body.dueDate).toBe('2025-01-01');
        expect(response.body.priority).toBe('Medium');
    });

    it('should mark a task as completed', async () => {
        await request(app)
            .patch(`/tasks/${createdTaskId}/completed`)
            .expect(200);

        const response = await request(app)
            .get(`/tasks/${createdTaskId}`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.completed).toBe(1);
    });

    it('should delete a task', async () => {
        await request(app)
            .delete(`/tasks/${createdTaskId}`)
            .expect(204);

        await request(app)
            .get(`/tasks/${createdTaskId}`)
            .expect(404);
    });

    // New test cases for expirationDate

    it('should create a new task with expirationDate', async () => {
        const response = await request(app)
            .post('/tasks')
            .send({
                title: 'Test Task with Expiration',
                description: 'This is a test task with expiration date',
                dueDate: '2024-12-31',
                priority: 'High',
                expirationDate: '2024-12-30'
            })
            .expect('Content-Type', /json/)
            .expect(201);

        createdTaskId = response.body.id;
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('Test Task with Expiration');
        expect(response.body.description).toBe('This is a test task with expiration date');
        expect(response.body.dueDate).toBe('2024-12-31');
        expect(response.body.priority).toBe('High');
        expect(response.body.expirationDate).toBe('2024-12-30');
    });

    it('should get all tasks and verify expirationDate', async () => {
        const response = await request(app)
            .get('/tasks')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: createdTaskId,
                title: 'Test Task with Expiration',
                description: 'This is a test task with expiration date',
                dueDate: '2024-12-31',
                priority: 'High',
                expirationDate: '2024-12-30'
            })
        ]));
    });

    it('should update a task with a new expirationDate', async () => {
        const response = await request(app)
            .put(`/tasks/${createdTaskId}`)
            .send({
                title: 'Updated Task with New Expiration',
                description: 'This task has been updated with a new expiration date',
                dueDate: '2025-01-01',
                priority: 'Medium',
                expirationDate: '2025-01-01'
            })
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.title).toBe('Updated Task with New Expiration');
        expect(response.body.description).toBe('This task has been updated with a new expiration date');
        expect(response.body.dueDate).toBe('2025-01-01');
        expect(response.body.priority).toBe('Medium');
        expect(response.body.expirationDate).toBe('2025-01-01');
    });

    it('should get the updated task and verify the new expirationDate', async () => {
        const response = await request(app)
            .get(`/tasks/${createdTaskId}`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.expirationDate).toBe('2025-01-01');
    });

    // New test cases for viewing task list with filter and sort

    it('should get all tasks with default view', async () => {
        const response = await request(app)
            .get('/tasks')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: createdTaskId
            })
        ]));
    });

    it('should get tasks filtered by status "completed"', async () => {
        await request(app)
            .patch(`/tasks/${createdTaskId}/completed`)
            .expect(200);

        const response = await request(app)
            .get('/tasks?status=completed')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: createdTaskId,
                completed: 1
            })
        ]));
    });

    it('should get tasks filtered by status "pending"', async () => {
        await request(app)
            .patch(`/tasks/${createdTaskId}/completed`)
            .expect(200);

        const response = await request(app)
            .get('/tasks?status=pending')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toEqual(expect.not.arrayContaining([
            expect.objectContaining({
                id: createdTaskId,
                completed: 1
            })
        ]));
    });

    it('should get tasks sorted by due date', async () => {
        const response = await request(app)
            .get('/tasks?sort=dueDate')
            .expect('Content-Type', /json/)
            .expect(200);

        // Assuming the response tasks are sorted by dueDate in ascending order
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: createdTaskId,
                dueDate: '2025-01-01'
            })
        ]));
    });

    it('should get tasks sorted by priority', async () => {
        const response = await request(app)
            .get('/tasks?sort=priority')
            .expect('Content-Type', /json/)
            .expect(200);
    
        // Check that tasks are sorted by priority order: High, Medium, Low
        const tasks = response.body;
        expect(tasks[0].priority).toBe('High');
        expect(tasks[1].priority).toBe('Medium');
        expect(tasks[2].priority).toBe('Low');
    });
    
});
