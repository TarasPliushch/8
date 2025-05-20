document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Завантаження завдань з локального сховища
    loadTasks();

    // Додавання нового завдання
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        
        if (taskText !== '') {
            addTask(taskText);
            taskInput.value = '';
            saveTasks();
        }
    });

    // Додавання завдання до списку
    function addTask(taskText) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${taskText}</span>
            <button class="delete-btn">Видалити</button>
        `;
        
        li.querySelector('.delete-btn').addEventListener('click', function() {
            li.remove();
            saveTasks();
        });
        
        taskList.appendChild(li);
    }

    // Збереження завдань у локальне сховище
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('#task-list li span').forEach(function(task) {
            tasks.push(task.textContent);
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Завантаження завдань з локального сховища
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(function(task) {
            addTask(task);
        });
    }
});
