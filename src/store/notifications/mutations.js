
export function clearNotifications (state, integrations) {
  state.notifications = []
}

export function addNotification (state, notification) {
  state.notifications.push(notification)
}
