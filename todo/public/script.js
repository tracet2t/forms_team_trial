document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('Description').value;
    const dueDate = document.getElementById('DueDate').value;
    const priority = document.getElementById('Priority').value;

    const task = { title, description, dueDate, priority };
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    displayTasks();
    document.getElementById('taskForm').reset();
});

function displayTasks() {
    const itemsList = document.getElementById('Items');
    itemsList.innerHTML = '';

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const currentDate = new Date();

    tasks.forEach((task, index) => {
        const taskDueDate = new Date(task.dueDate);
        const isExpired = taskDueDate < currentDate ? 'Expired' : '';

        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <strong>Title:</strong> ${task.title}<br>
            <strong>Description:</strong> ${task.description}<br>
            <strong>Due Date:</strong> ${task.dueDate} <span style="color:red">${isExpired}</span><br>
            <strong>Priority:</strong> ${task.priority}<br>
            <button class="edit-btn" onclick="editTask(${index})">Edit</button>
            <button onclick="deleteTask(${index})">Delete</button>
        `;
        itemsList.appendChild(taskItem);
    });
}

function deleteTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function editTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks[index];

    document.getElementById('editTitle').value = task.title;
    document.getElementById('editDescription').value = task.description;
    document.getElementById('editDueDate').value = task.dueDate;
    document.getElementById('editPriority').value = task.priority;

    document.getElementById('editTaskForm').style.display = 'block';
    document.getElementById('taskForm').style.display = 'none';

    document.getElementById('editTaskForm').onsubmit = function(e) {
        e.preventDefault();

        tasks[index].title = document.getElementById('editTitle').value;
        tasks[index].description = document.getElementById('editDescription').value;
        tasks[index].dueDate = document.getElementById('editDueDate').value;
        tasks[index].priority = document.getElementById('editPriority').value;

        localStorage.setItem('tasks', JSON.stringify(tasks));

        displayTasks();
        document.getElementById('editTaskForm').reset();
        document.getElementById('editTaskForm').style.display = 'none';
        document.getElementById('taskForm').style.display = 'block';
    };
}

document.getElementById('cancelEdit').addEventListener('click', function() {
    document.getElementById('editTaskForm').reset();
    document.getElementById('editTaskForm').style.display = 'none';
    document.getElementById('taskForm').style.display = 'block';
});

window.onload = function() {
    displayTasks();
};
document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    let isValid = true;

    const name = document.getElementById('fullName').value;
    const namePattern = /^[A-Za-z\s]{1,20}$/;
    if (!namePattern.test(name)) {
        document.getElementById('invalidName').textContent = 'Name should contain only lowercase and uppercase letters, should add at least 1 characters and  be up to 20 characters.';
        isValid = false;
    } else {
        document.getElementById('invalidName').textContent = '';
    }

    const mobileNumber = document.getElementById('mobileNumber').value;
    const mobilePattern = /^\d{10}$/;
    if (!mobilePattern.test(mobileNumber)) {
        document.getElementById('InvalidMobile').textContent = 'Mobile number should contain correct format';
        isValid = false;
    } else {
        document.getElementById('InvalidMobile').textContent = '';
    }

    if (isValid) {
        alert('Sign up successful!');
        
    }
});
