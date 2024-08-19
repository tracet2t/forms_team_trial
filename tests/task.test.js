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
});
