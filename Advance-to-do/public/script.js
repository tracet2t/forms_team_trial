document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('taskForm');
    const submitButton = document.getElementById('submitButton');
    const titleField = document.getElementById('title');
    const descriptionField = document.getElementById('description');
    const dueDateField = document.getElementById('dueDate');
    const priorityField = document.getElementById('priority');
    const expirationDateField = document.getElementById('expirationDate');
    const expirationTimeField = document.getElementById('expirationTime');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');

    let tasks = [];
    let editingTaskId = null;

    // Fetch tasks from the server
    function fetchTasks() {
        fetch('/tasks')
            .then(response => response.json())
            .then(data => {
                tasks = data;
                applyFilters();
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

    // Apply filters and sorting
    function applyFilters() {
        const status = statusFilter.value;
        const sortBy = sortFilter.value;

        let filteredTasks = tasks;

        // Filter tasks by status
        if (status !== 'all') {
            filteredTasks = tasks.filter(task => 
                (status === 'completed' && task.completed) || 
                (status === 'pending' && !task.completed)
            );
        }

        // Sort tasks
        if (sortBy) {
            filteredTasks = filteredTasks.sort((a, b) => {
                if (sortBy === 'dueDate') {
                    return new Date(a.dueDate) - new Date(b.dueDate);
                } else if (sortBy === 'priority') {
                    const priorityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                }
                return 0;
            });
        }

        renderTasks(filteredTasks);
    }

    // Render tasks
    function renderTasks(filteredTasks) {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = ''; // Clear existing tasks

        filteredTasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.innerHTML = `
                <div>
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <p>Due Date: ${task.dueDate}</p>
                    <p>Priority: ${task.priority}</p>
                    ${task.expirationDate ? `<p>Expiration Date: ${task.expirationDate}</p>` : ''}
                    ${task.expirationTime ? `<p>Expiration Time: ${task.expirationTime}</p>` : ''}
                </div>
                <div>
                    <button class="complete" onclick="markComplete(${task.id})">&#9989; Complete</button>
                    <button class="update" onclick="editTask(${task.id})">&#9998; Update</button>
                    <button class="delete" onclick="deleteTask(${task.id})">&#10060; Delete</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    }

    // Edit task
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

    // Delete task
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

    // Mark task as complete
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

    // Show message
    function showMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        document.body.appendChild(messageElement);
        setTimeout(() => {
            messageElement.remove();
        }, 3000); // Remove the message after 3 seconds
    }

    // Add event listeners for filter and sort changes
    statusFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);
});
