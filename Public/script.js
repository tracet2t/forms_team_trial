document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.getElementById('priority').value;

    fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title,
            description,
            dueDate,
            priority
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Task added:', data);
        // Clear the form
        document.getElementById('taskForm').reset();
    })
    .catch(error => console.error('Error:', error));
});
