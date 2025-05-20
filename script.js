document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const filterAll = document.getElementById('filter-all');
    const filterActive = document.getElementById('filter-active');
    const filterCompleted = document.getElementById('filter-completed');

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

    // Фільтрація завдань
    filterAll.addEventListener('click', () => filterTasks('all'));
    filterActive.addEventListener('click', () => filterTasks('active'));
    filterCompleted.addEventListener('click', () => filterTasks('completed'));

    // Додавання завдання до списку
    function addTask(taskText, isCompleted = false, creationTime = new Date()) {
        const li = document.createElement('li');
        const timeString = creationTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const dateString = creationTime.toLocaleDateString();
        
        li.innerHTML = `
            <span class="task-text ${isCompleted ? 'completed' : ''}">${taskText}</span>
            <span class="task-time">${dateString} ${timeString}</span>
            <button class="edit-btn">Редагувати</button>
            <button class="delete-btn">Видалити</button>
        `;
        
        // Додаємо обробник події для позначення виконаним
        li.querySelector('.task-text').addEventListener('click', function() {
            this.classList.toggle('completed');
            saveTasks();
        });
        
        // Додаємо обробник події для редагування
        li.querySelector('.edit-btn').addEventListener('click', function() {
            const textSpan = li.querySelector('.task-text');
            const currentText = textSpan.textContent;
            const newText = prompt('Редагувати завдання:', currentText);
            
            if (newText !== null && newText.trim() !== '') {
                textSpan.textContent = newText.trim();
                saveTasks();
            }
        });
        
        // Додаємо обробник події для видалення
        li.querySelector('.delete-btn').addEventListener('click', function() {
            li.remove();
            saveTasks();
        });
        
        taskList.appendChild(li);
    }

    // Функція фільтрації завдань
    function filterTasks(filter) {
        const tasks = document.querySelectorAll('#task-list li');
        
        tasks.forEach(task => {
            const isCompleted = task.querySelector('.task-text').classList.contains('completed');
            
            switch(filter) {
                case 'active':
                    task.style.display = isCompleted ? 'none' : 'flex';
                    break;
                case 'completed':
                    task.style.display = isCompleted ? 'flex' : 'none';
                    break;
                default:
                    task.style.display = 'flex';
            }
        });
    }

    // Збереження завдань у локальне сховище
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('#task-list li').forEach(function(taskLi) {
            const text = taskLi.querySelector('.task-text').textContent;
            const isCompleted = taskLi.querySelector('.task-text').classList.contains('completed');
            const timeText = taskLi.querySelector('.task-time').textContent;
            
            // Парсимо час з тексту (формат "dd.mm.yyyy hh:mm")
            const [datePart, timePart] = timeText.split(' ');
            const [day, month, year] = datePart.split('.');
            const [hours, minutes] = timePart.split(':');
            
            const creationTime = new Date(year, month-1, day, hours, minutes);
            
            tasks.push({
                text,
                isCompleted,
                creationTime: creationTime.getTime() // Зберігаємо як timestamp
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Завантаження завдань з локального сховища
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(function(task) {
            addTask(
                task.text, 
                task.isCompleted, 
                new Date(task.creationTime)
            );
        });
    }
});
