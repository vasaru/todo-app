// public/app.js
const API_URL = '/api/todos';

// Load todos on page load
document.addEventListener('DOMContentLoaded', loadTodos);

async function loadTodos() {
  try {
    const response = await fetch(API_URL);
    const todos = await response.json();
    displayTodos(todos);
  } catch (error) {
    console.error('Error loading todos:', error);
    document.getElementById('todoList').innerHTML = 
      '<p class="empty">❌ Failed to load todos</p>';
  }
}

function displayTodos(todos) {
  const todoList = document.getElementById('todoList');
  
  if (todos.length === 0) {
    todoList.innerHTML = '<p class="empty">No todos yet. Add one above! 👆</p>';
    return;
  }
  
  todoList.innerHTML = todos.map(todo => `
    <div class="todo-item ${todo.completed ? 'completed' : ''}">
      <input 
        type="checkbox" 
        class="todo-checkbox"
        ${todo.completed ? 'checked' : ''}
        onchange="toggleTodo(${todo.id})"
      >
      <span class="todo-text">${escapeHtml(todo.title)}</span>
      <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
    </div>
  `).join('');
}

async function addTodo() {
  const input = document.getElementById('todoInput');
  const title = input.value.trim();
  
  if (!title) return;
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    
    if (response.ok) {
      input.value = '';
      loadTodos();
    }
  } catch (error) {
    console.error('Error adding todo:', error);
    alert('Failed to add todo');
  }
}

async function toggleTodo(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: 'PUT' });
    loadTodos();
  } catch (error) {
    console.error('Error toggling todo:', error);
  }
}

async function deleteTodo(id) {
  if (!confirm('Delete this todo?')) return;
  
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadTodos();
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    addTodo();
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}