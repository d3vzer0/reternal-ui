
export function rawr (context, payload) {
  console.log(123123)
  context.commit('enabled', payload)
}
