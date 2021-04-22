const saveButton = document.querySelector('#saveButton');

/**
 *  addTaskToScreen .. Displays created task to screen with option to delete
 *
 * @param {string} task
 */
function addTaskToScreen(task) {
  // create elemets that are needed and add atrributes
  let { listItem, deleteButton, image } = createElementsForTheTask();
  image.setAttribute('src', 'delete.png');
  deleteButton.appendChild(image);
  deleteButton = addOnClickFunctionToButton(deleteButton);
  assignIDToButton(task, deleteButton);

  // show the task name and delete button in the list item
  listItem.innerHTML = task.taskName;
  listItem.appendChild(deleteButton);

  // get the ul and put list item in the ul
  const ulList = getHtmlElement('.ulList');
  ulList.appendChild(listItem);
  console.log(ulList);
}

/**
 * assignIDToButton will attach a unique identifier that links
 * a task to a button to make it easy to find the task and delete it
 * @param {Object} task
 * @param {HTMLElement} deleteButton
 */
function assignIDToButton(task, deleteButton) {
  deleteButton.name = task.id;
}

/**
 * createElementsForTheTask will create all neccesary elements
 * needed to render a task in the unorderd list
 *
 * @returns {HTMLElement} * 3
 */
function createElementsForTheTask() {
  let listItem = createElement('li', true, 'listItem');
  let deleteButton = createElement('button', false, '');
  let image = createElement('img', false, '');

  return { listItem, deleteButton, image };
}

/**
 * createElement will create any type of HTML element and add a
 * className to the element if the caller sets 'addClass' to true
 *
 * @param {String} elementType
 * @param {Boolean} addClass
 * @param {String} className
 *
 * @returns {HTMLElement}
 */
function createElement(elementType, addClass, className) {
  const htmlElemt = document.createElement(elementType);
  if (addClass) {
    htmlElemt.setAttribute('class', className);
  }

  return htmlElemt;
}

/**
 * addOnClickFunctionToButton takes in a button and adds a onclick
 * listener to it.
 *
 * @param {HTMLElement} button
 * @returns {HTMLElement} - the button with and onclick listener attached
 */
function addOnClickFunctionToButton(button) {
  button.addEventListener('click', deleteTasks);
  return button;
}

/**
 * saveTask is responsible for saving a task into session storage as well as
 * rendering in the list of task task on the screen
 */
function saveTask() {
  const inputElement = getHtmlElement('.userNote');
  let taskName = inputElement.value;

  // make sure user typed in a value
  if (taskName) {
    const task = createTaskObject(taskName);
    let tasks = sessionStorage.getItem('tasks');

    if (tasks) {
      let oldTasks = JSON.parse(tasks);
      oldTasks.push(task);
      oldTasks = JSON.stringify(oldTasks);
      sessionStorage.setItem('tasks', oldTasks);
    } else {
      let newTasks = [];
      newTasks.push(task);
      newTasks = JSON.stringify(newTasks);
      sessionStorage.setItem('tasks', newTasks);
    }

    // after I am done putting it in session I am now putting it in the screen
    addTaskToScreen(task);
    removeLastInputText(inputElement);
  } else {
    alert('No value found in the input');
  }
}

/**
 * removeLastInputText will delete the text of an old task
 * @param {String} inputElement
 */
function removeLastInputText(inputElement) {
  inputElement.value = '';
}

/**
 * createTaskObject will take in a task name , create unique
 * identifier for the task and then return the task as an Object
 *
 * @param {String} taskName
 * @returns {Object}
 */
function createTaskObject(taskName) {
  return {
    taskName: taskName,
    id: new Date().toISOString(),
  };
}

/**
 * getItemsInSessionStorage will return all items (stringified) for a given item name
 * if nothing is found the function will return null.
 */
function getItemsInSessionStorage(itemName) {
  const item = sessionStorage.getItem(itemName);
  if (item) {
    return JSON.parse(item);
  }

  return null;
}

/**
 * getTasks is the first function taht is called in the program
 * it will look for tasks in sessions storage , loop through tasks
 * in order to display them in the screen
 *
 * if not tasks are found the function will exit
 */
function getTasks() {
  const oldTasks = getItemsInSessionStorage('tasks');

  if (oldTasks) {
    for (let task of oldTasks) {
      // create elemets that are needed and add atrributes
      const {listItem, deleteButton, image} = createElementsForTheTask();
      image.setAttribute('src', 'delete.png');
	  assignIDToButton(task, deleteButton)
	  addOnClickFunctionToButton(deleteButton)

      deleteButton.appendChild(image);
      listItem.innerHTML = task.taskName;
      listItem.appendChild(deleteButton);

      // select the ul and append task (list item) to it
      const ulList = getHtmlElement('.ulList');
      ulList.appendChild(listItem);
    }
  }
}

/**
 * deleteTasks will tak in an even from the button and use the id of the button
 * to delete a task from session storage and from the screen
 * 
 * @param {Event} event
 */
function deleteTasks(event) {
  const idOfTaskToDelete = event.target.name;
  const image = event.target;
  console.log('target image : , ', image);
  console.log('target name : , ', event.target.parentNode.name);


  // get tasks and Delete
  const tasks = getItemsInSessionStorage('tasks');
  if (tasks) {
    // loop through tasks till you find a match
    for (let task of tasks) {
      if (task.id === idOfTaskToDelete) {
		console.log("deleting task : ", task)
        removeTaskFromScreen(image);
        removeTaskFromSessionStorage(tasks, task);
      }
    }
  }
}

/**
 * getElement will use a CSS selector to find and return
 * any element on the DOM
 *
 * @param {String} selector
 * @returns {HTMLElement}
 */
function getHtmlElement(selector) {
  return document.querySelector(selector);
}

/**
 * removeTaskFromScreen will remove a list item from the
 * unordered list by identifying who the parant of the X image
 * which is the button , once we have the button the go up the DOM
 * tree again to find th LI , since it is the parent of the button
 *
 * @param {Object} task
 */
function removeTaskFromScreen(image) {
  const unorderdList = getHtmlElement('.ulList');
  const deleteButton = image.parentNode;
  const listItem = deleteButton.parentNode;
  unorderdList.removeChild(listItem);
}

/**
 * removeTaskFromSessionStorage ..
 *
 * @param {Array} tasks
 * @param {Object} taskToBeDelete
 */
function removeTaskFromSessionStorage(tasks, taskToBeDelete) {
  const remainingTasks = tasks.filter((taskInList) => {
    return taskInList !== taskToBeDelete.id;
  });

  const remainingTasksString = JSON.stringify(remainingTasks);
  sessionStorage.setItem('tasks', remainingTasksString);
}

// lets get tasks once we load the app
getTasks();

/* *************** EVENT LISTENERS **************** */
saveButton.addEventListener('click', saveTask);
