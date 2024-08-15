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


function deleteTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.splice(index, 1);


    localStorage.setItem('tasks', JSON.stringify(tasks));

    displayTasks();
}

window.onload = function() {
    displayTasks();
};
