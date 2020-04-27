export function getTasks (state) {
  var tasks = []
  state.nodes.forEach(task => {
    tasks.push(task.taskData)
  })
  return tasks
}

export function getNodes (state) {
  var allNodes = []
  state.nodes.forEach(node => {
    allNodes.push({ 'id': node.id, 'label': node.label, 'taskData': node.taskData })
  })
  return allNodes
}

export function getEdges (state) {
  var allEdges = []
  state.edges.forEach(edge => {
    allEdges.push({ 'source': edge.from, 'to': edge.to })
  })
  return allEdges
}

export function getAgents (state) {
  var allAgents = []
  state.agents.forEach(agent => {
    allAgents.push({ 'id': agent.value, 'name': agent.value, 'integration': agent.integration })
  })
  return allAgents
}

export function getDependencies (state) {
  var dependencies = []
  state.edges.forEach(dep => {
    dependencies.push(dep.dependencyData)
  })
  return dependencies
}

export function taskOptions (state) {
  var tasks = []
  state.nodes.forEach(node => {
    tasks.push(node.id)
  })
  return tasks
}
