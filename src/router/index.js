import { createRouter, createWebHistory } from 'vue-router'
import Test from '../views/Test.vue'
import Main from '../views/Main.vue'
import Brief from '../views/Brief.vue'
import Detail from '../views/Detail.vue'

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
        children: [
          {
            path: "/",
            redirect: "/detail"
          },
          {
            path: "/detail",
            component: Detail,
          },
          {
            path: "/brief",
            component: Brief,
          }
        ]
      }
    ]
})

export default router