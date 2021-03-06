


var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");

var tasks = [];

var completeEditTask = function(taskName, taskType, taskId) {
    // find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
          tasks[i].name = taskName;
          tasks[i].type = taskType;
        }
    };    
    saveTasks();
    alert("Task Updated!");
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task"
};

var createFormHandler = function (event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  // check if input values are empty strings
  if (!taskNameInput || !taskTypeInput) {
      alert("You need to fill out the task form!");
      return false;
  }

  formEl.reset();

  var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput,
    status: "to do"
  };
  
  var isEdit = formEl.hasAttribute("data-task-id");
  
  // PUT THIS BELOW `var isEdit = ...` in `taskFormHandler()`

// has data attribute, so get task id and call function to complete edit process
if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  } 
  // no data attribute, so create object as normal and pass to createTaskEl function
  else {
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do"
    };
  
    createTaskEl(taskDataObj);
  }
  
};

var createTaskEl = function(taskDataObj) {
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML =
    "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);

  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);

  switch (taskDataObj.status) {
    case "to do":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
      tasksToDoEl.append(listItemEl);
      break;
    case "in progress":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
      tasksInProgressEl.append(listItemEl);
      break;
    case "completed":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
      tasksCompletedEl.append(listItemEl);
      break;
    default:
      console.log("Something went wrong!");
  }
};

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    //creat delete button
    var deleteButtonEl = document.createElement("button")
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);
    
    // select element
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    var statusChoises = ["to do", "in progress", "completed"];

    for (var i = 0; i < statusChoises.length; i++) {
        //create option elements
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoises[i];
        statusOptionEl.setAttribute("value", statusChoises[i]);

        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    actionContainerEl.appendChild(statusSelectEl);
    return actionContainerEl;
};

var deleteTask = function(taskId) {
    //actually removed the task
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
    // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
     if (tasks[i].id !== parseInt(taskId)) {
     updatedTaskArr.push(tasks[i]);
     }
    saveTasks();
}

// reassign tasks array to be the same as updatedTaskArr
tasks = updatedTaskArr;
    
};

var editTask = function(taskId) {

    
    //get list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);
    

};

var taskButtonHandler = function(event) {
    var targetEl = event.target;

    // edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    // if delete button is pressed
    else if (event.target.matches(".delete-btn")) {
        //get the element's task id
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    };
};

var taskStatusChangeHandler = function(event) {
    
  // get the task item's id
  var taskId = event.target.getAttribute("data-task-id");

  // get the currently selected option's value and convert to lowercase
  var statusValue = event.target.value.toLowerCase();

  // find the parent task item element based on the id
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
        
    } 
      
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
        
    } 
     
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
        
    }

    //update task's in tasks arry
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
          tasks[i].status = statusValue;
        }
      }
saveTasks();
};


// saves data locally
var saveTasks = function() {
  // converts items from an array into a string  
  localStorage.setItem("tasks", JSON.stringify(tasks));
}



// converts tasks from the string format back into an array of objects.

// Iterates through a tasks array and creates task elements on the page from it.

var loadTasks = function() {
  var savedTasks = localStorage.getItem("tasks");
  // JSON.parse turns items from a string into an array
  if (!savedTasks) {
    return false;
  }
  console.log ("Loading saved tasks."); 
  // pars into an array of objects
  savedTasks = JSON.parse(savedTasks);
    
  for (var i = 0; i < tasks.length; i++) {
    createTaskEl(savedTasks[i]);
  }
  
};

// for changing status
pageContentEl.addEventListener("change", taskStatusChangeHandler);
// for edit delete buttons
pageContentEl.addEventListener("click", taskButtonHandler);
// create new task
formEl.addEventListener("submit", createFormHandler);

loadTasks();