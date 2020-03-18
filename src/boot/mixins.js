import integrationsMixin from '../mixin/integrationsMixin'
import agentsMixin from '../mixin/agentsMixin'

// "async" is optional
export default async ({ Vue }) => {
  Vue.mixin(integrationsMixin)
  Vue.mixin(agentsMixin)
}
