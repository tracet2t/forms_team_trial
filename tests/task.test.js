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
                priority: 'high'
            })
            .expect('Content-Type', /json/)
            .expect(201);

        createdTaskId = response.body.id;
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('Test Task');
        expect(response.body.description).toBe('This is a test task');
        expect(response.body.dueDate).toBe('2024-12-31');
        expect(response.body.priority).toBe('high');
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
                priority: 'high'
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
                priority: 'medium'
            })
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.title).toBe('Updated Task');
        expect(response.body.description).toBe('This task has been updated');
        expect(response.body.dueDate).toBe('2025-01-01');
        expect(response.body.priority).toBe('medium');
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

    // test cases for expirationDate

    it('should create a new task with expirationDate', async () => {
        const response = await request(app)
            .post('/tasks')
            .send({
                title: 'Test Task with Expiration',
                description: 'This is a test task with expiration date',
                dueDate: '2024-12-31',
                priority: 'high',
                expirationDate: '2024-12-30'
            })
            .expect('Content-Type', /json/)
            .expect(201);

        createdTaskId = response.body.id;
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('Test Task with Expiration');
        expect(response.body.description).toBe('This is a test task with expiration date');
        expect(response.body.dueDate).toBe('2024-12-31');
        expect(response.body.priority).toBe('high');
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
                priority: 'high',
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
                priority: 'medium',
                expirationDate: '2025-01-01'
            })
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.title).toBe('Updated Task with New Expiration');
        expect(response.body.description).toBe('This task has been updated with a new expiration date');
        expect(response.body.dueDate).toBe('2025-01-01');
        expect(response.body.priority).toBe('medium');
        expect(response.body.expirationDate).toBe('2025-01-01');
    });

    it('should get the updated task and verify the new expirationDate', async () => {
        const response = await request(app)
            .get(`/tasks/${createdTaskId}`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.expirationDate).toBe('2025-01-01');
    });

    //test cases for viewing task list with filter and sort

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
        const response = await request(app).get('/tasks?sortBy=priority');
        expect(response.status).toBe(200);

        const tasks = response.body;
        expect(tasks[0].priority).toBe('high');
        expect(tasks[1].priority).toBe('medium');
        expect(tasks[2].priority).toBe('low');
    });

    // test case for task notifications
    it('should send a notification for a task approaching its expiration date', async () => {
        // Create a new task with an expiration date
        const response = await request(app)
            .post('/tasks')
            .send({
                title: 'Test Task for Notifications',
                description: 'This task will have a notification sent.',
                dueDate: '2024-12-31',
                priority: 'high',
                expirationDate: '2024-12-30'
            })
            .expect('Content-Type', /json/)
            .expect(201);

        const taskId = response.body.id;

        const notifyResponse = await request(app)
            .get(`/tasks/${taskId}/notifications`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(notifyResponse.body).toHaveProperty('notification');
        expect(notifyResponse.body.notification).toBe('Reminder: Task "Test Task for Notifications" is approaching its expiration date.');
    });

    // test cases for search functionality
    it('should search tasks by title', async () => {
        // Create tasks
        await request(app)
            .post('/tasks')
            .send({
                title: 'Search Task 1',
                description: 'This is the first search task.',
                dueDate: '2024-12-31',
                priority: 'low'
            })
            .expect(201);

        await request(app)
            .post('/tasks')
            .send({
                title: 'Search Task 2',
                description: 'This is the second search task.',
                dueDate: '2024-12-31',
                priority: 'high'
            })
            .expect(201);

        // Search by title
        const response = await request(app)
            .get('/tasks?search=Search Task 1')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                title: 'Search Task 1'
            })
        ]));
    });

    it('should search tasks by description', async () => {
        // Create tasks
        await request(app)
            .post('/tasks')
            .send({
                title: 'Search Task A',
                description: 'Search description A',
                dueDate: '2024-12-31',
                priority: 'medium'
            })
            .expect(201);

        await request(app)
            .post('/tasks')
            .send({
                title: 'Search Task B',
                description: 'Search description B',
                dueDate: '2024-12-31',
                priority: 'medium'
            })
            .expect(201);

        // Search by description
        const response = await request(app)
            .get('/tasks?search=Search description A')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                description: 'Search description A'
            })
        ]));
    });


});
