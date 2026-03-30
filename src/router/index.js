import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('@/views/LandingPage.vue'),
    meta: { layout: 'blank' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { layout: 'blank' },
  },
  {
    path: '/dashboard',
    component: () => import('@/layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
      },
      {
        path: '/projects',
        name: 'Projects',
        component: () => import('@/views/projects/ProjectsListView.vue'),
      },
      {
        path: '/projects/:id',
        name: 'ProjectDetail',
        component: () => import('@/views/projects/ProjectDetailView.vue'),
        props: true,
      },
    ],
  },
  {
    path: '/gallery/:shareId',
    name: 'ClientGallery',
    component: () => import('@/views/client/ClientGalleryView.vue'),
    meta: { layout: 'client' },
    props: true,
  },
  {
    path: '/gallery/:shareId/summary',
    name: 'SelectionSummary',
    component: () => import('@/views/client/SelectionSummaryView.vue'),
    meta: { layout: 'client' },
    props: true,
  },
  {
    path: '/gallery/:shareId/success',
    name: 'SelectionSuccess',
    component: () => import('@/views/client/SelectionSuccessView.vue'),
    meta: { layout: 'client' },
    props: true,
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () => import('@/views/legal/TermsView.vue'),
    meta: { layout: 'blank' },
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('@/views/legal/PrivacyView.vue'),
    meta: { layout: 'blank' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('ps_auth_token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/') && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
