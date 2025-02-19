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
                    <i class="fas fa-edit edit"></i>
                    <i class="fas fa-trash delete"></i>
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
                        <i class="fas fa-edit edit"></i>
                        <i class="fas fa-trash delete"></i>
                    </span>
                </li>`;
            $taskList.append(taskHtml);
        });
    }
});
