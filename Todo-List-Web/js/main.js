import ToDoItem from "./todoitem";
import ToDoList from "./todolist";

const toDoList = new ToDoList();

// launch app
document.addEventListener("readystatechange", (event) => {
    if(event.target.readyState == "complete"){
        initApp();
    }
});

const initApp = () => {
    //add listener
    const itemEntryForm = document.getElementById("itemEntryForm");
    itemEntryForm.addEventListener("submit", (event) => {
        event.preventDefault();
        processSubmission();
    })

    const clearItems = document.getElementById("clearItems");
    clearItems.addEventListener("click", (event) => {
        const list = toDoList.getList();
        if(list.length){
            const confirm = confirm("Clear all the list?");
            if(confirm){
                toDoList.clearList();
            }
        }
    })
    //procedural
    //load list objects
    refreshThePage();
}

const refreshThePage = () => {
    clearListDisplay();
    renderList();
    clearItemEntryField();
    setFocusOnItemEntryField();
}

const clearListDisplay = () => {
    const parentElement = document.getElementById("itemList");
    deleteContents(parentElement);
}

const deleteContents = (parentElement) => {
    let child = parentElement.lastElementChild;
    while(child){
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
}

const renderList = () => {
    const list = toDoList.getList();
    list.forEach(item => {
        buildListItem(item);
    });
}

const buildListItem = (item) => {
    const div = document.createElement("div");
    div.className = "item";
    const check = document.createElement("input");
    check.type = "checkbox";
    check.id = item.getId();
    check.tabIndex = 0;
    addClickListenerToCheckbox(check);
    const label = document.createElement("label");
    label.htmlFor = item.getId();
    label.textContent = item.getItem();
    div.appendChild(check);
    div.appendChild(label);
    const container = document.getElementById("listItems");
    container.appendChild(div);
}

const addClickListenerToCheckbox = (checkbox) => {
    checkbox.addEventListener("click", (event) => {
        toDoList.removeItem(checkbox.id);
        //TODO remove persistent data
        setTimeout(() => {
            refreshThePage();
        }, 1000)
    });
}

const clearItemEntryField = () => {
    document.getElementById("newItem").value = "";
}

const setFocusOnItemEntryField = () => {
    document.getElementById("newItem").focus();
}

const processSubmission = () => {
    const newEntryText = getNewEntry();
    if(!newEntryText.length) return;
    const nextItemId = calcNextItemId();
    const todoItem = createNewItem(nextItemId, newEntryText);
    toDoList.addNewItem(todoItem);
    //Todo update persistent data
    refreshThePage();
}

const getNewEntry = () => {
    return document.getElementById("newItem").value.trim();
}

const calcNextItemId = () => {
    let nextItemId = 1;
    const list = toDoList.getList();
    if(list.length > 0){
        nextItemId = list[list.length - 1].getId() + 1;
    }

    return nextItemId;
}

const createNewItem = (itemId, itemText) => {
    const todo = new ToDoItem();
    todo.setId(itemId);
    todo.setItem(itemText);
    return todo;
}