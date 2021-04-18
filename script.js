
const saveNote = document.querySelector("#saveNote");

/**
 *  addTaskToScreen .. Displays created task to screen with option to delete
 * @param {string} task 
 */
 function addTaskToScreen(task) {
	let li = document.createElement("LI")
	li.setAttribute("class", "listItem")
	let deleteButton = document.createElement("button");
	let ulList = document.querySelector('.ulList')
	let img = document.createElement("img");
	img.setAttribute("src", "delete.png");
	deleteButton.appendChild(img)
	li.innerHTML = task;

	li.appendChild(deleteButton);
	console.log(li.task)
	// put list item in the ul 
	ulList.appendChild(li)
	console.log(ulList)
}

function saveData() {
	const inputValue = document.querySelector('.userNote');
	let task = inputValue.value
	// check if we already have tasks
	// if there are tasks in session storage

	// make sure user typed in a value 
	if (task) {
		let tasks = sessionStorage.getItem('tasks')
		if (tasks) {
			console.log("stringified Tasks :", tasks)
			let oldTasks = []
			oldTasks = JSON.parse(tasks)     // ['task ', 'task3']
			console.log("json Tasks :", oldTasks)


			// push the new task to the array    // ['task ', 'task3', 'task4']
			oldTasks.push(task)
			console.log("after push :", oldTasks)

			// stringify the new array "['task ', 'task3', 'task4']"
			oldTasks = JSON.stringify(oldTasks)
			console.log("2nd stringified Tasks :", oldTasks)

			// save the tasks back into sessionStorage // 
			sessionStorage.setItem("tasks", oldTasks)
		} else {
			let newTasks = []

			// push this task to the task array 
			newTasks.push(task)
			// save the tasks into session storage 
			newTasks = JSON.stringify(newTasks)
			sessionStorage.setItem("tasks", newTasks)
		}

		// after I am done putting it in session I am now putting it in the screen
		addTaskToScreen(task);
		inputValue.value = '';
	} else {
		alert("Input task")
	}
}







/**
 * 
 */
function getItems() {
	let tasks = sessionStorage.getItem('tasks')
	// check if there are tasks
	if (tasks) {
		console.log("stringified Tasks :", tasks)
		//make tasks array
		let oldTasks = []
		oldTasks = JSON.parse(tasks)     // ['task ', 'task3']
		console.log("json Tasks :", oldTasks)
		// display each task on the page
		const ulList = document.querySelector('.ulList')

		return oldTasks
		console.log("LIst ", ulList)
	} else {
		console.log('No tasks')

		return []
	}

}


function getTasks() {

	const oldTasks = getItems()

	// loop through tasks and create li's that will then be appended to the ul
	for (i = 0; i < oldTasks.length; i++) {
		console.log(oldTasks[i])
		let taskNme = oldTasks[i]

		// crete a list item 
		let li = document.createElement("LI")
		li.setAttribute("class", "listItem")
		let deleteButton = document.createElement("button");
		let ulList = document.querySelector('.ulList')
		let img = document.createElement("img");
		img.setAttribute("src", "delete.png");
		deleteButton.appendChild(img)
		li.innerHTML = taskNme;

		li.appendChild(deleteButton);
		// put list item in the ul 
		ulList.appendChild(li)
	}
}

//We are going to delete the items we have added
function deleteB(){

	const getTasksProperties = getTasks();
	deleteButton.addEventListener('click' , function(){
		console.log('worked!');
	})
}

deleteB();
//first lets get the items we have in session
//Next loop through the array of tasks and the one that matches our current li.task will be removed 
//We are going to edit the items we have added


getTasks();




saveNote.addEventListener('click', saveData)