
export function clear (state, taskId) {
  state.tasks = []
}

export function pull (state, taskId) {
  var filteredTasks = state.tasks.filter(task => task.taskId !== taskId)
  state.tasks = filteredTasks
}

export function add (state, taskId) {
  state.tasks.push(taskId)
}
