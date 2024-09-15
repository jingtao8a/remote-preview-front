import { createRouter, createWebHistory } from 'vue-router'
import Test from '../views/Test.vue'
import Main from '../views/Main.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/test',
        name: 'test',
        component: Test,
      },
      {
        path: '/',
        name: "main",
        component: Main,
      }
    ]
})

export default router