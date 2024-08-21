document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('taskForm');
    const submitButton = document.getElementById('submitButton');
    const titleField = document.getElementById('title');
    const descriptionField = document.getElementById('description');
    const dueDateField = document.getElementById('dueDate');
    const priorityField = document.getElementById('priority');
    const expirationField = document.getElementById('expirationDate');
    const searchField = document.getElementById('search');

    let tasks = [];
    let editingTaskId = null;

    // Fetch tasks from the server
    function fetchTasks() {
        const status = document.getElementById('statusFilter').value;
        const sortBy = document.getElementById('sortFilter').value;
        const search = searchField.value.trim();

        fetch(`/tasks?status=${status}&sortBy=${sortBy}&search=${search}`)
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
        const expirationDate = expirationField.value;

        if (editingTaskId) {
            // Update task
            fetch(`/tasks/${editingTaskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, dueDate, priority, expirationDate })
            })
            .then(response => response.json())
            .then(() => {
                editingTaskId = null;
                submitButton.textContent = 'Add Task';
                fetchTasks();
            })
            .catch(error => console.error('Error updating task:', error));
        } else {
            // Add new task
            fetch('/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, dueDate, priority, expirationDate })
            })
            .then(response => response.json())
            .then(() => {
                fetchTasks();
            })
            .catch(error => console.error('Error adding task:', error));
        }

        form.reset(); // Reset the form
    });

    function renderTasks() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = ''; // Clear existing tasks

        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            taskItem.setAttribute('data-id', task.id);
            taskItem.innerHTML = `
                <div>
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <p>Due Date: ${task.dueDate}</p>
                    <p>Priority: ${task.priority}</p>
                    <p>Expiration: ${task.expirationDate || 'No expiration set'}</p>
                </div>
                <div>
                    <button class="update" onclick="editTask(${task.id})">Update</button>
                    <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
                    <button class="complete" onclick="markComplete(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
                </div>
            `;

            if (task.completed) {
                taskItem.classList.add('completed');
            }

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
            expirationField.value = task.expirationDate;
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
        })
        .catch(error => console.error('Error deleting task:', error));
    };

    window.markComplete = function(id) {
        fetch(`/tasks/${id}/completed`, {
            method: 'PATCH'
        })
        .then(response => {
            if (response.ok) {
                const taskItem = document.querySelector(`.task-item[data-id="${id}"]`);
                if (taskItem) {
                    taskItem.classList.add('completed');
                }
            } else {
                return response.json().then(error => Promise.reject(error));
            }
        })
        .catch(error => console.error('Error marking task as complete:', error));
    };

    // Event listeners for filters, sorting, and search
    document.getElementById('statusFilter').addEventListener('change', fetchTasks);
    document.getElementById('sortFilter').addEventListener('change', fetchTasks);
    searchField.addEventListener('input', fetchTasks);
});
