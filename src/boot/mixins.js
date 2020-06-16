import integrationsMixin from '../mixin/integrationsMixin'
import agentsMixin from '../mixin/agentsMixin'
import userMixin from '../mixin/userMixin'
import searchIntegrationsMixin from '../mixin/searchIntegrationsMixin'

// "async" is optional
export default async ({ Vue }) => {
  Vue.mixin(integrationsMixin)
  Vue.mixin(userMixin)
  Vue.mixin(agentsMixin)
  Vue.mixin(searchIntegrationsMixin)
}
