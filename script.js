let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentEditIndex = null;
let currentDeleteIndex = null;

function addTodo() {
    const todoInput = document.getElementById('newTodo');
    const errorMessage = document.getElementById('error-message');
    const text = todoInput.value.trim();

    if (text.length === 0) {
        errorMessage.textContent = '⛔ Task cannot be empty';
        return;
    } else if (text.length < 5) {
        errorMessage.textContent = '⛔ Task must be at least 5 characters long';
        return;
    } else if (/^\d/.test(text)) {
        errorMessage.textContent = '⛔ Task cannot start with a number';
        return;
    }
    
    errorMessage.textContent = '';
    todos.push({ text, done: false });
    saveTodos();
    todoInput.value = '';
    renderTodos();

    showMessage('Task added successfully 🎉');
}


function renderTodos(filter = 'all') {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    const filteredTodos = todos.filter(todo => 
        filter === 'all' || 
        (filter === 'done' && todo.done) || 
        (filter === 'todo' && !todo.done)
    );

    if (filteredTodos.length === 0) {
        todoList.innerHTML = 'No Tasks 📝';
        return; 
    }

    filteredTodos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.done ? 'done' : ''}`;

        li.innerHTML = `
            <span>${todo.text}</span>
            <div class="todo-actions">
                <button class="toggle" onclick="toggleDone(${index})">${todo.done ? '<i class="fa-regular fa-square-check"></i>' : '<i class="fa-regular fa-square"></i>'}</button>
                <button class="edit" onclick="openEditModal(${index})"><i class="fa-solid fa-pen"></i></button>
                <button class="delete" onclick="deleteTodo(${index})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        todoList.appendChild(li);
    });
}


function showMessage(message) {
    const container = document.querySelector('.container');

    const existingMessageBox = container.querySelector('.message-box');
    if (existingMessageBox) {
        
        container.removeChild(existingMessageBox);
    }

    const messageBox = document.createElement('div');
    messageBox.className = 'message-box';

    const successMessages = [
        'Task added successfully 🎉',
        'Task has been deleted.',
        'Task has been edited.'
    ];
    
    if (successMessages.includes(message)) {
        messageBox.style.backgroundColor = '#d4edda';
        messageBox.style.color = '#155724';
        messageBox.style.border = '1px solid #c3e6cb';
    }
    

    messageBox.textContent = message;
    container.appendChild(messageBox);

    setTimeout(() => {
        container.removeChild(messageBox);
    }, 3000);
}




function toggleDone(index) {
    todos[index].done = !todos[index].done;
    saveTodos();
    renderTodos();
}

function deleteTodo(index) {
    currentDeleteIndex = index;
    document.getElementById('deleteModal').style.display = 'flex';
}

function confirmDeleteTodo() {
    todos.splice(currentDeleteIndex, 1);
    closeDeleteModal();
    showMessage("Task has been deleted.");

    saveTodos();
    renderTodos();
}

function deleteDoneTodos() {
    todos = todos.filter(todo => !todo.done);
    saveTodos();
    renderTodos();
}

function deleteDoneTodos() {
    const doneTasks = todos.filter(todo => todo.done);

    if (doneTasks.length === 0) {
        showMessage("No done tasks to delete.");
        return;
    }
    document.getElementById('deleteAllDoneModal').style.display = 'flex';
}

function deleteAllTodos() {
    todos = [];
    saveTodos();
    renderTodos();
}
function deleteAllTodos() {
    if (todos.length === 0) {
        showMessage("No tasks to delete.");
        return;
    }
    document.getElementById('deleteAllModal').style.display = 'flex';
}

function confirmDeleteAll() {
    todos = [];
    saveTodos();
    closeDeleteAllModal();
    renderTodos();
}

function closeDeleteAllModal() {
    document.getElementById('deleteAllModal').style.display = 'none';
}


function confirmDeleteAllDone() {
    todos = todos.filter(todo => !todo.done);
    closeDeleteAllDoneModal();
    showMessage("All done Tasks has been deleted.")
    saveTodos();
    renderTodos();
}

function closeDeleteAllDoneModal() {
    document.getElementById('deleteAllDoneModal').style.display = 'none';
}


function filterTodos(filter) {
    const buttons = document.querySelectorAll('.filter-buttons button');
    buttons.forEach(button => button.classList.remove('active'));

    document.querySelector(`.filter-buttons button[onclick="filterTodos('${filter}')"]`).classList.add('active');

    renderTodos(filter);
}

function openEditModal(index) {
    currentEditIndex = index;
    const editTodoInput = document.getElementById('editTodoInput');
    const errorMessage = document.getElementById('edit-error-message');
    errorMessage.textContent = '';

    editTodoInput.value = todos[index].text;
    document.getElementById('editModal').style.display = 'flex';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

function saveEditTodo() {
    const editTodoInput = document.getElementById('editTodoInput');
    const errorMessage = document.getElementById('edit-error-message');
    const newText = editTodoInput.value.trim();

    if (newText.length < 5) {
        errorMessage.textContent = '⛔ Task must be at least 5 characters long';
        return;
    }

    todos[currentEditIndex].text = newText;
    showMessage("Task has been edited.");
    saveTodos();
    closeEditModal();
    renderTodos();
}

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
});
