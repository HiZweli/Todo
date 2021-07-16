const saveButton = document.querySelector('#saveButton');

/**
 * Here we check what has changed in our task
 */
const observeConfig = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
  attributeOldValue: true,
  characterDataOldValue: true
}

/**
 *  addTaskToScreen .. Displays created task to screen with option to delete
 *
 * @param {Object} task
 */
function addTaskToScreen(task) {
  // create elemets that are needed and add atrributes
  let { listItem, paragraph, deleteButton,editButton, image } = createElementsForTheTask(task);
  //image.setAttribute('src', 'delete.png');
  //deleteButton.appendChild(image);
  deleteButton.innerHTML = "X"
  deleteButton = addOnClickFunctionToButton(deleteButton);
  assignIDToButton(task, deleteButton);

  editButton.innerHTML = "Edit"
  editButton.addEventListener('click', function(){
    makeTaskEditable(paragraph,editButton);
  });

  // show the task name and delete button in the list item
  // paragraph.name = task.id
  paragraph.innerHTML = task.taskName;
  paragraph.style.width = '95%';
  assignIDToparagraph(task, paragraph)
  console.dir(paragraph)
  // listItem.innerHTML = task.taskName;
  listItem.appendChild(paragraph);
  console.dir(listItem)
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);
  attachObserverToLi(listItem);
  // get the ul and put list item in the ul
  const ulList = getHtmlElement('.ulList');
  ulList.appendChild(listItem);
  console.log(ulList);
}

function listen(event) {
  console.log("[script.js] [listen] ", event)
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
* assignIDToparagraph will attach a unique identifier that links
* a task to a paragraph to make it easy to find the task and delete it
*/
function assignIDToparagraph(task, paragraph) {
  paragraph.name = task.id;
}
/**
 * createElementsForTheTask will create all neccesary elements
 * needed to render a task in the unorderd list
 *
 * @returns {HTMLElement} * 3
 */
function createElementsForTheTask(task) {
  let listItem = createElement('li', true, 'listItem');
  let paragraph = createElement('p', false, '')
  
  let deleteButton = createElement('button', false, '');
  let editButton = createElement('button', false, '');
  let image = createElement('img', false, '');

  return { listItem, paragraph, deleteButton,editButton, image };
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

      oldTasks.push(task); // [{},{},{nameofTask: task , id : 2021}]

      oldTasks = JSON.stringify(oldTasks);
      sessionStorage.setItem('tasks', oldTasks);
    } else {
      // this only hapense for the first task
      var newTasks = [];
      newTasks.push(task);  // [{tasname: '', id:''}]
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
      const { listItem, paragraph, deleteButton,editButton, image } = createElementsForTheTask();
      // image.setAttribute('src', 'delete.png');

      deleteButton.innerHTML = "X"
      // deleteButton.appendChild(image);
      assignIDToButton(task, deleteButton)
      addOnClickFunctionToButton(deleteButton)

      editButton.innerHTML = "Edit"
      editButton.addEventListener('click', function(){
        makeTaskEditable(paragraph,editButton);
      });

      paragraph.innerHTML = task.taskName;
      paragraph.style.width = '95%';
      assignIDToparagraph(task, paragraph)
      listItem.appendChild(paragraph);
      listItem.appendChild(editButton);
      // listItem.innerHTML = task.taskName;
      listItem.appendChild(deleteButton);
      attachObserverToLi(listItem);
      console.dir(listItem)
      // select the ul and append task (list item) to it
      const ulList = getHtmlElement('.ulList');
      ulList.appendChild(listItem);
    }
  }
}

function attachObserverToLi(listItem) {

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(updateSessionUponChange);
  // Start observing the target node for configured mutations
  observer.observe(listItem, observeConfig);
}

function updateSessionUponChange(mutationsList, observe) {
  console.log("Observed change", mutationsList, observe)
  const tasks = getItemsInSessionStorage('tasks')
  // Use traditional 'for loops' for IE 11
  for (const mutation of mutationsList) {
    console.log(mutation.type);
    console.log(mutation.target.parentNode.name);
    const idOfTaskChange = mutation.target.parentNode.name;

    console.time("Looping through tasks")
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id === idOfTaskChange) {

        tasks[i].taskName = mutation.target.data
        console.log('changing task name to ', mutation.target.data)
        break

      }
    }
    console.timeEnd("Looping through tasks")

    saveToSessionStorage('tasks',tasks);

  }
}

/**
 * saveToSessionStorage is responsible for saving anything to session storage
 * @param {String} key 
 * @param {*} item 
 * 
 */
function saveToSessionStorage(key, item) {
  if (typeof item !== 'string') {
    item = JSON.stringify(item)
  }

  sessionStorage.setItem(key, item);
}


/**
 * deleteTasks will tak in an even from the button and use the id of the button
 * to delete a task from session storage and from the screen
 * 
 * @param {Event} event
 */
function deleteTasks(event) {
  console.log("[script.js] [deleteTasks]", event)

  const idOfTaskToDelete = event.target.name;
  const button = event.target;
  console.log('target button : , ', button);

  // get tasks and Delete
  const tasks = getItemsInSessionStorage('tasks');
  if (tasks) {
    // loop through tasks till you find a match
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === idOfTaskToDelete) {
        console.log("deleting task : ", tasks[i])
        removeTaskFromScreen(button);
        removeTaskFromSessionStorage(tasks, tasks[i]);
        break
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
function removeTaskFromScreen(button) {
  const unorderdList = getHtmlElement('.ulList');
  const listItem = button.parentNode;
  unorderdList.removeChild(listItem);
}

/**
 * removeTaskFromSessionStorage ..
 *
 * @paragraph.style.width = '95%';param {Array} tasks
 * @param {Object} taskToBeDelete
 */
function removeTaskFromSessionStorage(tasks, taskToBeDelete) {
  const remainingTasks = tasks.filter((taskInList) => {
    return taskInList.id !== taskToBeDelete.id;
  });

  const remainingTasksString = JSON.stringify(remainingTasks);
  sessionStorage.setItem('tasks', remainingTasksString);
}

// lets get tasks once we load the app
getTasks();

/* *************** EVENT LISTENERS **************** */
saveButton.addEventListener('click', saveTask);

//  const listItem = document.querySelector('#demo')
// const changingText = p.name;
// let changedText = MutationEvent.target.name
// create a new instance of `MutationObserver` named `observer`,
// passing it a callback function
// const observer = new MutationObserver(reactToEditChange);

// function reactToEditChange(mutationRecords) {

//   for (let record of mutationRecords) {
//     console.log("[scrit.js] [reactToEditChange] i was called ! ", record)

//   }

// }

// call `observe()` on that MutationObserver instance,
// passing it the element to observe, and the options object
// observer.observe(changingText, );


function makeTaskEditable(paragraph,editButton) {

  if (paragraph.contentEditable !== 'true') {
    paragraph.setAttribute("contenteditable", "true")
    editButton.innerHTML = "Save"
  }else{
    paragraph.setAttribute("contenteditable", "false")
    editButton.innerHTML = "Edit"
  }
}




