if (!localStorage.getItem("todo")) {
	localStorage.setItem("todo", JSON.stringify([]));
}

let todoLists = JSON.parse(localStorage.getItem("todo"));
let todoContainer = document.querySelector(".todo-app");

let newListInputBtn = document.querySelector(".add-todo-list__btn");
let newListInputLabel = document.querySelector(".add-todo-list__input");
newListInputBtn.addEventListener("click", handleNewListInput);
newListInputLabel.addEventListener("keyup", handleNewListInput);

document.addEventListener("click", toggleAddTodoListWindow);

document.addEventListener("click", toggleAddTodoItemWindow);

updateTodoList();

function handleNewListInput(e) {
	if (
		e.key === "Enter" ||
		[...e.target.classList].includes("add-todo-list__btn")
	) {
		if (newListInputLabel.value.length > 0) {
			newListInputLabel.parentElement.classList.toggle("active");
			addTodoList(newListInputLabel.value);
			newListInputLabel.value = "";
		}
	}
}

function toggleAddTodoListWindow(e) {
	const addTodoListWindow = document.querySelector(".add-todo-list__window");
	if (e.target === document.querySelector(".add-todo-list")) {
		addTodoListWindow.classList.toggle("active");
	} else if (e.target !== newListInputLabel) {
		addTodoListWindow.classList.remove("active");
	}
}

function toggleAddTodoItemWindow(e) {
	const addTodoItemWindows = document.querySelectorAll(
		".todo-list__add-item-window"
	);
	if ([...e.target.classList].includes("todo-list__add-item")) {
		console.log(e.target);
		addTodoItemWindows.forEach((window) => {
			if (window.id === e.target.parentNode.id) {
				window.classList.toggle("active");
			} else {
				window.classList.remove("active");
			}
		});
	} else if (![...e.target.classList].includes("todo-list__add-item-input")) {
		addTodoItemWindows.forEach((window) => {
			window.classList.remove("active");
		});
	}
}

function updateTodoList() {
	let addTodoListContainer = document.querySelector(".add-todo-list");
	todoContainer.innerHTML = "";
	todoLists.forEach((list) => {
		todoContainer.innerHTML += generateTodoListHTML(list);
	});
	document.querySelectorAll(".todo-list__add-item-input").forEach((label) => {
		label.addEventListener("keyup", handleAddItemInput);
	});
	document.querySelectorAll(".todo-list__add-item-btn").forEach((btn) => {
		btn.addEventListener("click", handleAddItemInput);
	});
	todoContainer.appendChild(addTodoListContainer);
}

function generateTodoListHTML(list) {
	return `
    <div class="todo-list" id="${list.id}">
      <div class="todo-list__title">
        <p class="todo-list__title-text">${list.title}</p>
        <button class="todo-list__delete-item-btn" onclick="deleteTodoList(${
					list.id
				})">
          <img src="img/trash.svg" alt="" />
        </button>
      </div>
      <ul class="todo-list__list">
        ${generateListItems(list.id)}
      </ul>
      <div class="todo-list__add-item " id="${list.id}">
        <p class="todo-list__add-item-btn-text">Add Item</p>
        <img class="todo-list__add-item-icon" src="img/plus.svg" alt="" /> 
        <div class="todo-list__add-item-window" id="${list.id}">
          <input
            type="text"
            required
            placeholder="Input text"
            class="todo-list__add-item-input"
            id="${list.id}" />
						<button class="todo-list__add-item-btn" id="${list.id}">
							<img src="img/send.svg" alt="" />
						</button>
        </div>
      </div>
    </div>
  `;
}

function generateListItems(id) {
	let html = "";
	const list = todoLists.find((list) => list.id === id);
	if (list) {
		list.items.forEach((listItem) => {
			html += generateListItemHTML(listItem);
		});
	}
	return html;
}

function generateListItemHTML(listItem) {
	return `<li class="todo-item__list-item">
    <p class="todo-item__list-item-text ${
			listItem.completed ? "completed" : ""
		}">${listItem.text}</p>
    <div class="list-item__actions">
      <button class="list-item__action list-item__action--complete" onclick="completeListItem(${
				listItem.id
			})">
        <img src="img/complete-icon.svg" alt="" />
      </button>
      <button class="list-item__action list-item__action--delete" onclick="deleteListItem(${
				listItem.id
			})">
        <img src="img/delete-icon.svg" alt="" />
      </button>
    </div>
  </li>`;
}

function addTodoList(todoListName) {
	todoLists.push({
		id: generateID(),
		title: todoListName,
		items: [],
	});
	localStorage.setItem("todo", JSON.stringify(todoLists));
	updateTodoList();
}

function deleteTodoList(id) {
	todoLists = todoLists.filter((list) => list.id !== id);
	localStorage.setItem("todo", JSON.stringify(todoLists));
	updateTodoList();
}

function handleAddItemInput(e) {
	if (
		e.key === "Enter" ||
		[...e.target.classList].includes("todo-list__add-item-btn")
	) {
		const label = e.target.parentNode.querySelector("input");
		label.parentElement.classList.toggle("active");
		if (label.value.length > 0) {
			addListItem(label.id, label.value);
		}
	}
}

function addListItem(todoListId, listItemText) {
	const list = todoLists.find((list) => list.id === +todoListId);
	if (list) {
		list.items.push({
			id: generateID(),
			text: listItemText,
			completed: false,
		});
		localStorage.setItem("todo", JSON.stringify(todoLists));
		updateTodoList();
	}
}

function completeListItem(id) {
	todoLists.forEach((list) => {
		const item = list.items.find((item) => item.id === +id);
		if (item) {
			item.completed = !item.completed;
		}
	});
	localStorage.setItem("todo", JSON.stringify(todoLists));
	updateTodoList();
}

function deleteListItem(id) {
	todoLists.forEach((list) => {
		list.items = list.items.filter((item) => item.id !== id);
	});
	localStorage.setItem("todo", JSON.stringify(todoLists));
	updateTodoList();
}

function generateID() {
	return Date.now();
}
