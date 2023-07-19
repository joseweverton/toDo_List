const button = document.querySelector(".button-add-task")
const input = document.querySelector(".input-task")
const completeList = document.querySelector(".list-tasks")


let listItems = []

    const addListItems = () => {

        if (input.value === ""){
            console.log(alert("Campo em branco. Gentileza preencher!"))
        }
        else{
        listItems.push({
            task: input.value,
            complete: false
        })//o método posh vai add. item dentro do array

        input.value = ""

        taskShow()
    }
}

const taskShow = () => {

    let newLi = ""

    listItems.forEach((item, index) => {
        newLi = newLi + `

            <li class="task ${item.complete && "done"}">
                <img src="./img/checked.png" class="icon-img" alt="check-na-tarefa" onclick="completeTask(${index})">
                <p>${item.task}</p>
                <img src="./img/trash.png" class="icon-img" alt="tarefa-para-fazer" onclick="deleteTask(${index})">
            </li>    

        `
    })

    completeList.innerHTML = newLi

    localStorage.setItem("list", JSON.stringify(listItems))

}

const completeTask = (index) => {
    listItems[index].complete = !listItems[index].complete

    taskShow()
}

const deleteTask = index => {
    listItems.splice(index, 1)//permite deletar itens dentro do array a partir daposição passada que neste caso foi 1 item 

    taskShow()

}

const reflashList = () => {
    const taskStorageLocal = localStorage.getItem("list")

    if (taskStorageLocal) {
        listItems = JSON.parse(taskStorageLocal)
    }

    return taskShow()
}

reflashList()

button.addEventListener("click", addListItems)