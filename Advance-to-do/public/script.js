document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('taskForm');
    const submitButton = document.getElementById('submitButton');
    const titleField = document.getElementById('title');
    const descriptionField = document.getElementById('description');
    const dueDateField = document.getElementById('dueDate');
    const priorityField = document.getElementById('priority');
    const expirationDateField = document.getElementById('expirationDate');
    const expirationTimeField = document.getElementById('expirationTime');

    let tasks = [];
    let editingTaskId = null;

    // Fetch tasks from the server
    function fetchTasks() {
        fetch('/tasks')
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
        const expirationDate = expirationDateField.value;
        const expirationTime = expirationTimeField.value;

        if (editingTaskId) {
            // Update task
            fetch(`/tasks/${editingTaskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, dueDate, priority, expirationDate, expirationTime })
            })
            .then(response => response.json())
            .then(() => {
                editingTaskId = null;
                submitButton.textContent = 'Add Task';
                form.reset(); // Reset the form
                fetchTasks();
                showMessage('Task updated successfully!', 'success'); // Display success message
            })
            .catch(error => console.error('Error updating task:', error));
        } else {
            // Add new task
            fetch('/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, dueDate, priority, expirationDate, expirationTime })
            })
            .then(response => response.json())
            .then(() => {
                form.reset(); // Reset the form
                fetchTasks();
                showMessage('Task added successfully!', 'success'); // Display success message
            })
            .catch(error => console.error('Error adding task:', error));
        }
    });

    function renderTasks() {
        const tbody = document.getElementById('taskList').getElementsByTagName('tbody')[0];
        tbody.innerHTML = ''; // Clear existing tasks

        tasks.forEach(task => {
            const taskRow = tbody.insertRow();
            taskRow.className = task.completed ? 'task-item completed' : 'task-item';
            taskRow.innerHTML = `
                <td>${task.title}</td>
                <td>${task.description}</td>
                <td>${task.dueDate}</td>
                <td>${task.priority}</td>
                <td>${task.expirationDate ? task.expirationDate : ''}</td>
                <td>${task.expirationTime ? task.expirationTime : ''}</td>
                <td>
                    <button class="complete" onclick="markComplete(${task.id})">&#9989; Complete</button>
                    <button class="update" onclick="editTask(${task.id})">&#9998; Update</button>
                    <button class="delete" onclick="deleteTask(${task.id})">&#10060; Delete</button>
                </td>
            `;
        });
    }

    window.editTask = function(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            titleField.value = task.title;
            descriptionField.value = task.description;
            dueDateField.value = task.dueDate;
            priorityField.value = task.priority;
            expirationDateField.value = task.expirationDate;
            expirationTimeField.value = task.expirationTime;
            editingTaskId = task.id;
            submitButton.textContent = 'Update Task';
        }
    };

    window.deleteTask = function(id) {
        fetch(`/tasks/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            fetchTasks();
            showMessage('Task deleted successfully!', 'error'); // Display success message
        })
        .catch(error => console.error('Error deleting task:', error));
    };

    window.markComplete = function(id) {
        fetch(`/tasks/${id}/completed`, {
            method: 'PATCH'
        })
        .then(response => response.json())
        .then(() => {
            fetchTasks();
            showMessage('Task marked as complete!', 'success'); // Display success message
        })
        .catch(error => console.error('Error marking task as complete:', error));
    };

    function showMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        document.body.appendChild(messageElement);
        setTimeout(() => {
            messageElement.remove();
        }, 3000); // Remove the message after 3 seconds
    }
});
