Test 1: Add new ToDo Item
Input - "Task 1" as a title "New Description" as a description and "2021-08-10" as a due date
Expected Output - A todo item with title "Task 1", description "New Description" and due date "2021-08-10" appears in the list.


Test 2: Load todo item from localStorage
Input- [{ "title": "Task Saving", "description": "Desc Saving", "dueDate": "2021-10-18" }]
Expected Output- A todo item with title "Task 1", description "New Description" and due date "2021-08-10" appears in the list.


Test 3: Toggle between Pending and Completed sections
Input-
Default: Pending button is active.
Action: Click on Completed button.
Expected Output-
Pending button no longer active. Completed button was active.