document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('taskForm');
    const submitButton = document.getElementById('submitButton');
    const titleField = document.getElementById('title');
    const descriptionField = document.getElementById('description');
    const dueDateField = document.getElementById('dueDate');
    const priorityField = document.getElementById('priority');
    
    let tasks = [];
    let editingTaskId = null;

    // Fetch tasks from the server
    function fetchTasks() {
        fetch('/tasks') // Adjust the URL to match your endpoint
            .then(response => response.json())
            .then(data => {
                tasks = data;
                renderTasks();
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }

    // Fetch tasks when page loads
    fetchTasks();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = titleField.value;
        const description = descriptionField.value;
        const dueDate = dueDateField.value;
        const priority = priorityField.value;

        if (editingTaskId) {
            // Update task
            fetch(`/tasks/${editingTaskId}`, { // Adjust the URL to match your endpoint
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, dueDate, priority })
            })
            .then(response => response.json())
            .then(() => {
                editingTaskId = null;
                submitButton.textContent = 'Add Task';
                form.reset(); // Reset the form
                fetchTasks();
                showMessage('Task updated successfully!'); // Display success message
            })
            .catch(error => console.error('Error updating task:', error));
        } else {
            // Add new task
            fetch('/tasks', { // Adjust the URL to match your endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, dueDate, priority })
            })
            .then(response => response.json())
            .then(() => {
                form.reset(); // Reset the form
                fetchTasks();
                showMessage('Task added successfully!'); // Display success message
            })
            .catch(error => console.error('Error adding task:', error));
        }
    });

    function renderTasks() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = ''; // Clear existing tasks

        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            taskItem.innerHTML = `
                <div>
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <p>Due Date: ${task.dueDate}</p>
                    <p>Priority: ${task.priority}</p>
                </div>
                <div>
                    <button class="update" onclick="editTask(${task.id})">Update</button>
                    <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
                    <button class="complete" onclick="markComplete(${task.id})">Complete</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    }

    window.editTask = function(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            titleField.value = task.title;
            descriptionField.value = task.description;
            dueDateField.value = task.dueDate;
            priorityField.value = task.priority;
            editingTaskId = task.id;
            submitButton.textContent = 'Update Task';
        }
    };

    window.deleteTask = function(id) {
        fetch(`/tasks/${id}`, { // Adjust the URL to match your endpoint
            method: 'DELETE'
        })
        .then(() => {
            fetchTasks();
            showMessage('Task deleted successfully!'); // Display success message
        })
        .catch(error => console.error('Error deleting task:', error));
    };

    window.markComplete = function(id) {
        fetch(`/tasks/${id}/completed`, { 
            method: 'PATCH'
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(error => Promise.reject(error));
            }
        })
        .then(() => {
            fetchTasks();
            showMessage('Task marked as complete!'); // Display success message
        })
        .catch(error => console.error('Error marking task as complete:', error));
    };

    function showMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'success-message';
        messageElement.textContent = message;
        document.body.appendChild(messageElement);
        setTimeout(() => {
            messageElement.remove();
        }, 3000); // Remove the message after 3 seconds
    }
});
