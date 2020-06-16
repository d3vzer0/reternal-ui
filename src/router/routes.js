
const routes = [
  {
    path: '/',
    component: () => import('layouts/Main.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue'), meta: { requiresAuth: true } },
      { path: '/actors', component: () => import('pages/Actors.vue'), meta: { requiresAuth: true } },
      { path: '/mitre', component: () => import('pages/Mitre.vue'), meta: { requiresAuth: true } },
      { path: '/agents', component: () => import('pages/Agents.vue'), meta: { requiresAuth: true } },
      { path: '/techniques', component: () => import('pages/Techniques.vue'), meta: { requiresAuth: true } },
      { path: '/campaign', component: () => import('pages/Campaign.vue'), meta: { requiresAuth: true } },
      { path: '/stagers', component: () => import('pages/Stagers.vue'), meta: { requiresAuth: true } },
      { path: '/listeners', component: () => import('pages/Listeners.vue'), meta: { requiresAuth: true } },
      { path: '/coverage', component: () => import('pages/Coverage.vue'), meta: { requiresAuth: true } },
      { path: '/validations', component: () => import('pages/Validations.vue'), meta: { requiresAuth: true } },
      { path: '/results', component: () => import('pages/Results.vue'), meta: { requiresAuth: true } },
      { path: '/lifecycle', component: () => import('pages/Lifecycle.vue'), meta: { requiresAuth: true } }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/Login.vue'),
    children: []
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
