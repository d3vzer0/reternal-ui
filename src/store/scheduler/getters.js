export function getTasks (state) {
  let tasks = []
  state.nodes.forEach(task => {
    tasks.push(task.taskData)
  })
  return tasks
}

export function getNodes (state) {
  let allNodes = []
  state.nodes.forEach(node => {
    allNodes.push({ 'id': node.id, 'label': node.label, 'taskData': node.taskData })
  })
  return allNodes
}

export function getEdges (state) {
  let allEdges = []
  state.edges.forEach(edge => {
    allEdges.push({ 'source': edge.from, 'to': edge.to })
  })
  return allEdges
}

export function getAgents (state) {
  let allAgents = []
  state.agents.forEach(agent => {
    allAgents.push({ 'id': agent.value, 'name': agent.value, 'integration': agent.integration })
  })
  return allAgents
}

export function getDependencies (state) {
  let dependencies = []
  state.edges.forEach(dep => {
    dependencies.push(dep.dependencyData)
  })
  return dependencies
}

export function taskOptions (state) {
  let tasks = []
  state.nodes.forEach(node => {
    tasks.push(node.id)
  })
  return tasks
}

export function getGraph (state) {
  let nodes = []
  state.nodes.forEach(node => {
    nodes.push(node.taskData)
  })

  let edges = []
  state.edges.forEach(edge => {
    edges.push(edge.dependencyData)
  })

  return { nodes: nodes, edges: edges }
}
