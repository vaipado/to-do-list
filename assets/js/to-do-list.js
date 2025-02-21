$(function () {
    const $body = $("body");
    const $container = $(".container");
    const $addTaskBtn = $("#addTask");
    const $taskInput = $("#taskInput");
    const $taskList = $("#taskList");
    const $categorySelect = $("#categorySelect");
    const $toggleTheme = $("#toggleTheme");

    // Carregar tarefas e configurar tema
    loadTasks();
    loadTheme();

    // Adicionar tarefa
    $addTaskBtn.click(addTask);
    $taskInput.keypress(function (event) {
        if (event.which === 13) addTask();
    });

    // Alternar tema
    $toggleTheme.change(toggleTheme);

    // Função para alternar tema
    function toggleTheme() {
        $body.toggleClass("dark-mode-body");
        $container.toggleClass("dark-mode");
        $categorySelect.toggleClass("dark-mode-select");
        $addTaskBtn.toggleClass("dark-mode-select");
        localStorage.setItem("darkMode", $body.hasClass("dark-mode"));
    }

    // Carregar tema do localStorage
    function loadTheme() {
        if (localStorage.getItem("darkMode") === "true") {
            $body.addClass("dark-mode-body");
            $container.addClass("dark-mode");
            $categorySelect.addClass("dark-mode-select");
            $addTaskBtn.addClass("dark-mode-select");
            $toggleTheme.prop("checked", true);
        }
    }

    // Adicionar tarefa
    function addTask() {
        const taskText = $taskInput.val().trim();
        const category = $categorySelect.val();
        if (taskText === "") return;

        const taskHtml = `
            <li class="task">
                <span class="task-text d-inline-block text-truncate">${taskText}</span>
                <span class="category">(${category})</span>
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square edit" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill delete" viewBox="0 0 16 16">
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                    </svg>
                </span>
            </li>`;
        $taskList.append(taskHtml);
        saveTasks();
        $taskInput.val("");
    }

    // Marcar tarefa como completada
    $(document).on("click", ".task-text", function () {
        $(this).toggleClass("completed");
        saveTasks();
    });

    // Deletar tarefa com animação
    $(document).on("click", ".delete", function () {
        const $taskItem = $(this).closest("li");
        $taskItem.addClass("breaking");

        setTimeout(function () {
            $taskItem.remove();
            saveTasks();
        }, 1000);
    });

    // Editar tarefa
    $(document).on("click", ".edit", function () {
        const $taskText = $(this).closest("li").find(".task-text");
        const newTaskText = prompt("Editar tarefa:", $taskText.text());
        if (newTaskText) {
            $taskText.text(newTaskText);
            saveTasks();
        }
    });

    // Salvar tarefas no localStorage
    function saveTasks() {
        const tasks = [];
        $(".task").each(function () {
            tasks.push({
                text: $(this).find(".task-text").text(),
                category: $(this).find(".category").text(),
                completed: $(this).find(".task-text").hasClass("completed")
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Carregar tarefas do localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => {
            const taskHtml = `
                <li class="task">
                    <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                    <span class="category">${task.category}</span>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square edit" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill delete" viewBox="0 0 16 16">
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                        </svg>
                    </span>
                </li>`;
            $taskList.append(taskHtml);
        });
    }
});