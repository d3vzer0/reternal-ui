import integrationsMixin from '../mixin/integrationsMixin'

// "async" is optional
export default async ({ Vue }) => {
  Vue.mixin(integrationsMixin)
}
