// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
  return Math.random().toString(36).substr(2, 10);
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  // create a div with the class "task-card"
  const taskCard = $("<div>").addClass("task-card");
  // create a div with the class "task-header" and append it to the task card
  const taskHeader = $("<div>").addClass("task-header").text(task.name);
  taskCard.append(taskHeader);
  // create a div with the class "task-body" and append it to the task card
  const taskBody = $("<div>").addClass("task-body").html(`
    ${task.description}
    <br>
    ${task.dueDate}
  `);
  taskCard.append(taskBody);
  // create a button with the class "delete-task" and append it to the task card
  const deleteButton = $("<button>")
    .addClass("delete-task btn btn-danger")
    .text("Delete")
    .data("id", task.id);
  taskCard.append(deleteButton);
  // using DayJS, check if the due date is within 7 days, add the class "due-soon" to the task card
  // else if the due date is past, add the class "overdue" to the task card
  const dueDate = dayjs(task.dueDate);
  console.log(dueDate.diff(dayjs(), "day"))
  const diff = dueDate.diff(dayjs(), "day")
  if (diff >= 0 && diff <= 7 && task.status !== "done") {
    taskCard.addClass("due-soon");
  } else if (diff < 0 && task.status !== "done") {
    taskCard.addClass("overdue");
  }
  // return the task card
  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  // for each #todo-cards #in-progress-cards #done-cards, empty the div
  $("#todo-cards").empty();
  $("#in-progress-cards").empty();
  $("#done-cards").empty();
  // for each task in taskList, create a task card and append it to the appropriate lane
  taskList.forEach((task) => {
    const taskCard = createTaskCard(task);
    if (task.status === "to-do") {
      $("#todo-cards").append(taskCard);
    } else if (task.status === "in-progress") {
      $("#in-progress-cards").append(taskCard);
    } else {
      $("#done-cards").append(taskCard);
    }
  });
  // make cards draggable
  $(".task-card").draggable({
    revert: "invalid",
    helper: "clone",
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  // get the form submit event and add task into local storage
  event.preventDefault();
  const task = {
    id: generateTaskId(),
    name: $("#task-name").val(),
    dueDate: dayjs($("#task-due-date").val()),
    description: $("#task-description").val(),
    status: "to-do",
  };
  taskList.push(task);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
  // close modal
  $("#add-task-modal").modal("hide");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  // get the task id and remove the task from the task list
  const taskId = $(this).data('id')
  taskList = taskList.filter((task) => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  // get the task id and new status and update the task in the task list
  const taskId = ui.draggable.find(".delete-task").data("id");
  const newStatus = this.id;
  taskList = taskList.map((task) => {
    if (task.id === taskId) {
      task.status = newStatus;
    }
    return task;
  });
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  // render the task list
  renderTaskList();

  // add event listeners
  $("#add-task-form").on("submit", handleAddTask);
  $(".delete-task").on("click", handleDeleteTask);

  // make lanes droppable
  $(".lane").droppable({
    drop: handleDrop,
  });
});
