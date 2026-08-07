const button = document.querySelector(".button-add-task");
const resetChecksButton = document.querySelector(".button-reset-checks");
const input = document.querySelector(".input-task");
const select = document.querySelector(".select-periodicity");
const listContainers = document.querySelectorAll(".list-tasks");

let listItems = [];
let editingIndex = -1;
let nextId = 1;

const validateFields = () => {
    if (input.value.trim() === "") {
        alert("Campo em branco. Gentileza preencher a descrição!");
        return false;
    }

    if (select.value === "") {
        alert("Selecione a periodicidade!");
        return false;
    }

    return true;
};

const addListItems = () => {
    if (!validateFields()) {
        return;
    }

    if (editingIndex === -1) {
        listItems.push({
            id: nextId++,
            descricao: input.value.trim(),
            periodicidade: select.value,
            concluida: false,
        });
    } else {
        listItems[editingIndex].descricao = input.value.trim();
        listItems[editingIndex].periodicidade = select.value;
        editingIndex = -1;
    }

    input.value = "";
    select.value = "";
    taskShow();
};

const editTask = (index) => {
    input.value = listItems[index].descricao;
    select.value = listItems[index].periodicidade;
    editingIndex = index;
};

const buildTaskHtml = (item, index) => {
    return `
       <li class="task ${item.concluida && "done"}">
        <p>${item.descricao}</p>
        <div class="icon">
          <span onclick="completeTask(${index})">&#x2705;</span>
          <span onclick="editTask(${index})">&#x1F4DD;</span>
          <span onclick="deleteTask(${index})">&#x1F6AB;</span>
        </div>
       </li>`;
};

const taskShow = () => {
    const groupedHtml = {};

    listContainers.forEach((container) => {
        groupedHtml[container.dataset.periodicity] = "";
    });

    listItems.forEach((item, index) => {
        const periodicity = item.periodicidade;

        if (groupedHtml[periodicity] !== undefined) {
            groupedHtml[periodicity] += buildTaskHtml(item, index);
        }
    });

    listContainers.forEach((container) => {
        container.innerHTML = groupedHtml[container.dataset.periodicity] || "";
    });

    localStorage.setItem("list", JSON.stringify(listItems));
};

const completeTask = (index) => {
    listItems[index].concluida = !listItems[index].concluida;
    taskShow();
};

const resetChecks = () => {
    const confirmReset = confirm("Tem certeza que deseja limpar todos os checks das atividades?");

    if (!confirmReset) {
        return;
    }

    listItems.forEach((item) => {
        item.concluida = false;
    });
    taskShow();
};

const deleteTask = (index) => {
    const confirmDelete = confirm("Tem certeza que deseja excluir esta atividade?");

    if (!confirmDelete) {
        return;
    }

    if (editingIndex === index) {
        editingIndex = -1;
        input.value = "";
        select.value = "";
    } else if (editingIndex > index) {
        editingIndex--;
    }

    listItems.splice(index, 1);
    taskShow();
};

const migrateItem = (item, index) => {
    return {
        id: item.id ?? index + 1,
        descricao: item.descricao ?? item.task ?? "",
        periodicidade: item.periodicidade ?? "diario",
        concluida: item.concluida ?? item.complete ?? false,
    };
};

const reflashList = () => {
    const taskStorageLocal = localStorage.getItem("list");

    if (taskStorageLocal) {
        const parsed = JSON.parse(taskStorageLocal);
        listItems = parsed.map(migrateItem);
        nextId = listItems.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    }

    return taskShow();
};

reflashList();

button.addEventListener("click", addListItems);
resetChecksButton.addEventListener("click", resetChecks);
