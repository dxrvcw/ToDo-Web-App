if (!localStorage.getItem("todo")) {
	localStorage.setItem("todo", JSON.stringify([]));
}

let todoLists = JSON.parse(localStorage.getItem("todo"));
let todoContainer = document.querySelector(".todo-app");

let newListInputLabel = document.querySelector(".add-todo-list__input");
newListInputLabel.addEventListener("keyup", (e) => {
	if (e.key === "Enter") {
		newListInputLabel.classList.toggle("active");
		if (newListInputLabel.value.length > 0) {
			addTodoList(newListInputLabel.value);
			newListInputLabel.value = "";
		}
	}
});

document.addEventListener("click", (e) => {
	if (e.target === document.querySelector(".add-todo-list")) {
		document.querySelector(".add-todo-list__window").classList.toggle("active");
	} else if (e.target !== document.querySelector(".add-todo-list__input")) {
		document.querySelector(".add-todo-list__window").classList.remove("active");
	}
});

updateTodoList();

document.addEventListener("click", (e) => {
	if ([...e.target.classList].includes("todo-list__add-item")) {
		document.querySelectorAll(".todo-list__add-item-window").forEach((i) => {
			if (i.id === e.target.parentNode.id) {
				i.classList.add("active");
			}
		});
	} else if (![...e.target.classList].includes("todo-list__add-item-input")) {
		document.querySelectorAll(".todo-list__add-item-window").forEach((i) => {
			i.classList.remove("active");
		});
	}
});

function updateTodoList() {
	let addTodoListContainer = document.querySelector(".add-todo-list");
	todoContainer.innerHTML = "";
	for (const list of todoLists) {
		todoContainer.innerHTML += `
    <div class="todo-list" id="${list.id}">
				<div class="todo-list__title">
					<p class="todo-list__title-text">${list.title}</p>
					<button class="todo-list__delete-item-btn" onclick="deleteTodoList(${list.id})">
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
          </div>
        </div>
		</div>
    `;

		let newListItemInputLabels = document.querySelectorAll(
			".todo-list__add-item-input"
		);
		newListItemInputLabels.forEach((label) => {
			label.addEventListener("keyup", (e) => {
				if (e.key === "Enter") {
					label.parentElement.classList.toggle("active");
					if (label.value.length > 0) {
						addListItem(label.id, label.value);
					}
				}
			});
		});
	}

	todoContainer.appendChild(addTodoListContainer);
}

function generateListItems(id) {
	let html = "";
	const list = todoLists.find((list) => list.id === id);
	if (list) {
		for (const listItem of list.items) {
			html += `<li class="todo-item__list-item">
                  <p class="todo-item__list-item-text">
                    ${listItem.text}
                  </p>
                  <div class="list-item__actions">
                    <button class="list-item__action list-item__action--complete" onclick="completeListItem(${listItem.id})">
                      <img src="img/complete-icon.svg" alt="" />
                    </button>
                    <button class="list-item__action list-item__action--delete" onclick="deleteListItem(${listItem.id})">
                      <img src="img/delete-icon.svg" alt="" />
                    </button>
                  </div>
                </li>`;
		}
	}
	return html;
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
	for (const list of todoLists) {
		if (list.id === id) {
			todoLists.splice(todoLists.indexOf(list), 1);
		}
	}
	localStorage.setItem("todo", JSON.stringify(todoLists));
	updateTodoList();
}

function addListItem(todoListId, listItemText) {
	for (const list of todoLists) {
		if (list.id === +todoListId) {
			list.items.push({
				id: generateID(),
				text: listItemText,
				completed: false,
			});
		}
	}
	localStorage.setItem("todo", JSON.stringify(todoLists));
	updateTodoList();
}

function completeListItem(id) {}

function deleteListItem(id) {
	for (const list of todoLists) {
		for (const listItem of list.items) {
			if (listItem.id === id) {
				list.items.splice(list.items.indexOf(listItem), 1);
			}
		}
	}
	localStorage.setItem("todo", JSON.stringify(todoLists));
	updateTodoList();
}

function generateID() {
	return Date.now();
}
