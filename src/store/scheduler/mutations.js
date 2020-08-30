export function setTasks (state, tasks) {
  state.tasks = tasks
}

export function setNodes (state, nodes) {
  state.nodes = nodes
}

export function setEdges (state, edges) {
  state.edges = edges
}

export function addNode (state, node) {
  state.nodes.push(node)
}

export function addEdge (state, edge) {
  state.edges.push(edge)
}

export function deleteTask (state, task) {
  task.edges.forEach(selectedEdge => {
    state.edges = state.edges.filter(edge => edge.id !== selectedEdge)
  })
  state.nodes = state.nodes.filter(node => node.id !== task.node)
}

// TODO: Deprecate multiple agent selection
export function setAgents (state, agents) {
  state.agents = agents
}

export function setAgent (state, agent) {
  state.agent = agent
}
