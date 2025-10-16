const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

function loadTodos() {
  return JSON.parse(localStorage.getItem('todos') || '[]');
}

function saveTodos(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  const todos = loadTodos();
  todoList.innerHTML = '';
  todos.forEach((todo, i) => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.done ? ' done' : '');
    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', () => {
      todos[i].done = checkbox.checked;
      saveTodos(todos);
      renderTodos();
    });

    // Label
    const label = document.createElement('span');
    label.className = 'todo-label';
    label.textContent = todo.text;
    label.addEventListener('dblclick', () => startEditTodo(i, todo.text));
    // Delete button
    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.setAttribute('aria-label', 'Delete');
    del.innerHTML = '&times;';
    del.addEventListener('click', () => {
      todos.splice(i, 1);
      saveTodos(todos);
      renderTodos();
    });
    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(del);
    todoList.appendChild(li);
  });
}

function addTodo(text) {
  const todos = loadTodos();
  todos.push({ text, done: false });
  saveTodos(todos);
  renderTodos();
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = todoInput.value.trim();
  if (value) {
    addTodo(value);
  }
  todoInput.value = '';
  todoInput.focus();
});

function startEditTodo(index, oldText) {
  const todos = loadTodos();
  const li = todoList.children[index];
  const input = document.createElement('input');
  input.type = 'text';
  input.value = oldText;
  input.className = 'edit-input';
  input.style.width = '80%';
  li.replaceChild(input, li.children[1]);
  input.focus();
  input.setSelectionRange(oldText.length, oldText.length);
  input.addEventListener('blur', () => endEditTodo(index, input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      input.blur();
    } else if (e.key === 'Escape') {
      renderTodos();
    }
  });
}

function endEditTodo(index, newText) {
  const todos = loadTodos();
  if (newText.trim()) {
    todos[index].text = newText.trim();
    saveTodos(todos);
  }
  renderTodos();
}

renderTodos();
