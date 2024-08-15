document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('Description').value;
    const dueDate = document.getElementById('DueDate').value;
    const priority = document.getElementById('Priority').value;

    const task = { title, description, dueDate, priority };

    // Get existing tasks from local storage or initialize an empty array
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Add new task to the array
    tasks.push(task);

    // Save the updated task list to local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Update the task list UI
    displayTasks();

    // Reset the form
    document.getElementById('taskForm').reset();
});

// Function to display tasks
function displayTasks() {
    const itemsList = document.getElementById('Items');
    itemsList.innerHTML = ''; // Clear current list

    // Get tasks from local storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <strong>Title:</strong> ${task.title}<br>
            <strong>Description:</strong> ${task.description}<br>
            <strong>Due Date:</strong> ${task.dueDate}<br>
            <strong>Priority:</strong> ${task.priority}<br>
            <button onclick="deleteTask(${index})">Delete</button>
        `;
        itemsList.appendChild(taskItem);
    });
}

// Function to delete a task
function deleteTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Remove the task at the specified index
    tasks.splice(index, 1);

    // Save the updated tasks array back to local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Update the task list UI
    displayTasks();
}

// Fetch and display tasks on page load
window.onload = function() {
    displayTasks();
};
