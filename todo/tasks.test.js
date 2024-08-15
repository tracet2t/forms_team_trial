const request = require('supertest');
const app = require('./tasks'); 

describe('Tasks API', () => {
    let task = {
        title: "Test Task",
        description: "This is a test task.",
        dueDate: "2024-08-31",
        priority: "High"
    };

    it('should create a new task', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .send(task);
        
        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject(task);
    });

    it('should retrieve the list of tasks', async () => {
        const response = await request(app)
            .get('/api/tasks');
        
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]).toMatchObject(task);
    });

    it('should delete a task', async () => {
        const response = await request(app)
            .delete('/api/tasks/0'); 
        
        expect(response.statusCode).toBe(204);

        const getResponse = await request(app).get('/api/tasks');
        expect(getResponse.body.length).toBe(0);
    });
});
