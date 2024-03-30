let todoContainer = document.querySelector(".todo-app");
let todoItems = Array.from(document.querySelectorAll(".todo-item"));
let activeItem = null;
let firstIndex = null;
let secondIndex = null;
let ghostItem = null;

document.addEventListener("mousedown", (e) => {
	activeItem = null;
	if (todoItems.includes(e.target)) {
		firstIndex = todoItems.indexOf(e.target);
		activeItem = e.target;
		activeItem.classList.add("active");

		ghostItem = activeItem.cloneNode(true);
		ghostItem.classList.add("ghost");
		ghostItem.classList.remove("active");
		todoContainer.appendChild(ghostItem);
	}
});

document.addEventListener("mouseup", (e) => {
	let parent = e.target.closest(".todo-item");
	if (parent && todoItems.includes(parent) && ghostItem) {
		secondIndex = todoItems.indexOf(parent);
		todoItems.splice(secondIndex, 0, todoItems.splice(firstIndex, 1)[0]);
	}

	if (ghostItem && ghostItem.parentNode) {
		ghostItem.parentNode.removeChild(ghostItem);
	}

	updateTodoItems();

	ghostItem = null;
	if (activeItem) {
		activeItem.classList.remove("active");
		activeItem = null;
	}
});

document.addEventListener("mousemove", (e) => {
	if (ghostItem) {
		e.preventDefault();
		ghostItem.style.opacity = "0.4";
		ghostItem.style.top = `${e.clientY}px`;
		ghostItem.style.left = `${e.clientX - ghostItem.offsetWidth / 2}px`;
	}
});

function updateTodoItems() {
	todoContainer.innerHTML = "";
	todoItems.forEach((item) => {
		todoContainer.appendChild(item);
	});
}
