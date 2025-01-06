import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from '@/stores/user';
import {checklogin} from '@/api/login';
import { ElMessage } from 'element-plus'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    alias: '/home',
    component: HomeView
  },
  {
    path: '/join',
    name: 'join',
    component: () => import('../views/JoinView.vue')
  },
  {
    path: '/search/:name',
    name: 'search',
    component: () => import('../views/SearchView.vue')
  },
  {
    path: '/video',
    name: 'video',
    component: () => import('../views/VideoView.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/my',
    children: [
      {
        path: 'setting',
        name: 'my/setting',
        component: () => import('../views/LaunchView.vue'),
      },
      {
        path: 'favorite',
        name: 'my/favorite',
        component: () => import('../views/FavoriteView.vue'),
      },
      {
        path: 'upload',
        name: 'my/upload',
        component: () => import('../views/UploadView.vue'),
      },
      {
        path: 'messages',
        name: 'my/messages',
        component: () => import('../views/MessageView.vue'),
      },
      {
        path: 'newlive',
        name: 'my/newlive',
        component: () => import('../views/CreateLiveView.vue'),
      },
      {
        path: 'points',
        name: 'my/points',
        component: () => import('../views/PointsView.vue'),
      },
      {
        path: 'addCredit/:type/:token',
        name: 'my/addCredit',
        component: () => import('../views/addCredit.vue'),
      }
    ],
  },

  {
    path: '/watch/:id',
    name: 'watch',
    component: () => import('../views/testvue.vue'),
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'home' }
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const result = await checklogin();
  if (to.name !== 'join' && to.name !== 'home' && to.name !== 'video' && to.name !== 'about' && to.name !== 'watch' && (result === 1)) {
    next({ name: 'home' });
    ElMessage.error("你还没有登录")
    userStore.logout()
  } else {
    next();
  }
});
export default router
