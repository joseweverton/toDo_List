const button = document.querySelector(".button-add-task");
const input = document.querySelector(".input-task");
const completeList = document.querySelector(".list-tasks");

let listItems = [];
let editingIndex = -1;

const addListItems = () => {
    if (input.value === "") {
        alert("Campo em branco. Gentileza preencher!");
    } else {
        if (editingIndex === -1) {
            listItems.push({
                task: input.value,
                complete: false,
            });
        } else {
            // Editar a tarefa existente
            listItems[editingIndex].task = input.value;
            editingIndex = -1; // Resetar o índice de edição
        }

        input.value = "";
        taskShow();
    }
};

const editTask = (index) => {
    input.value = listItems[index].task;
    editingIndex = index;
};

const taskShow = () => {
    let newLi = "";

    listItems.forEach((item, index) => {
        newLi =
            newLi +
            `
       <li class="task ${item.complete && "done"}">
        <p>${item.task}</p>
        <div class="icon">
          <span onclick="completeTask(${index})">&#x2705;</span>
          <span onclick="editTask(${index})">&#x1F4DD;</span>
            <span onclick="deleteTask(${index})">&#x1F6AB;</span>
        </div>
       </li>`;
    });

    completeList.innerHTML = newLi;

    localStorage.setItem("list", JSON.stringify(listItems));
};

const completeTask = (index) => {
    listItems[index].complete = !listItems[index].complete;
    taskShow();
};

const deleteTask = (index) => {
    listItems.splice(index, 1);
    taskShow();
};

const reflashList = () => {
    const taskStorageLocal = localStorage.getItem("list");

    if (taskStorageLocal) {
        listItems = JSON.parse(taskStorageLocal);
    }

    return taskShow();
};

reflashList();

button.addEventListener("click", addListItems);
