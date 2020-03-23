import { authGuard } from '../auth/authGuard'

const routes = [
  {
    path: '/',
    // beforeEnter: authGuard,
    component: () => import('layouts/Main.vue'),
    beforeEnter: authGuard,
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/actors', component: () => import('pages/Actors.vue') },
      { path: '/mitre', component: () => import('pages/Mitre.vue') },
      { path: '/agents', component: () => import('pages/Agents.vue') },
      { path: '/techniques', component: () => import('pages/Techniques.vue') },
      { path: '/campaign', component: () => import('pages/Campaign.vue') },
      { path: '/payloads', component: () => import('pages/Payloads.vue') },
      { path: '/listeners', component: () => import('pages/Listeners.vue') },
      { path: '/coverage', component: () => import('pages/Coverage.vue') }
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