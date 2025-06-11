const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const dueDateInput = document.getElementById("due-date");
const todoList = document.getElementById("todo-list");
const themeToggle = document.getElementById("theme-toggle");
const filterButtons = document.querySelectorAll(".filter-btn");
const toast = document.getElementById("toast");
const searchInput = document.getElementById("search");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "all";

function showToast(message) {
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), 3000);
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = todoInput.value.trim();
  const due = dueDateInput.value;
  if (!task) return;
  todos.push({
    text: task,
    completed: false,
    timestamp: new Date().toLocaleString(),
    dueDate: due || "Not Set",
  });
  todoInput.value = "";
  dueDateInput.value = "";
  saveAndRender();
  showToast("Task Added ✅");
});

function toggleComplete(index) {
  todos[index].completed = !todos[index].completed;
  saveAndRender();
}

function editTodo(index) {
  const updatedText = prompt("Edit your task:", todos[index].text);
  if (updatedText) {
    todos[index].text = updatedText.trim();
    todos[index].timestamp = new Date().toLocaleString();
    saveAndRender();
    showToast("Task Updated ✏️");
  }
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveAndRender();
  showToast("Task Deleted 🗑️");
}

function saveAndRender() {
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos();
}

function renderTodos() {
  todoList.innerHTML = "";
  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  }).filter(todo => {
    return todo.text.toLowerCase().includes(searchInput.value.toLowerCase());
  });

  filteredTodos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.completed ? " completed" : "");
    li.innerHTML = `
      <div class="todo-content" onclick="toggleComplete(${index})">
        <span>${todo.text}</span>
        <small>🕒 ${todo.timestamp}</small><br>
        <small>📅 Due: ${todo.dueDate}</small>
      </div>
      <div class="todo-actions">
        <button onclick="editTodo(${index})"><i class="fas fa-edit"></i></button>
        <button onclick="deleteTodo(${index})"><i class="fas fa-trash-alt"></i></button>
      </div>
    `;
    todoList.appendChild(li);
  });
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active");
    btn.classList.add("active");
    filter = btn.dataset.filter;
    renderTodos();
  });
});

searchInput.addEventListener("input", renderTodos);

function exportTasks() {
  const blob = new Blob([JSON.stringify(todos, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "todos.json";
  a.click();
}

function importTasks(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      todos = JSON.parse(e.target.result);
      saveAndRender();
      showToast("Tasks Imported 🔄");
    } catch {
      alert("Invalid JSON file");
    }
  };
  reader.readAsText(file);
}

renderTodos();
