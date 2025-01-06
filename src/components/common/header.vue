<template>
  <el-menu :default-active="activeIndex" mode="horizontal" class="header-menu">
    <el-menu-item index="0" class="logo-item">
      <el-icon><VideoCameraFilled /></el-icon>
      在线直播系统
    </el-menu-item>

    <el-menu-item class="search-wrapper">
      <el-input v-model="searchinput" class="search-input" placeholder="输入搜索内容">
      </el-input>
      <div style="width: 10px;"></div>
      <el-button type="primary" round @click="search">搜索</el-button>
    </el-menu-item>

    <el-menu-item index="home" @click="goto('home')"><el-icon>
        <HomeFilled />
      </el-icon>首页</el-menu-item>
    <el-menu-item index="video" @click="goto('video')"><el-icon>
        <VideoCameraFilled />
      </el-icon>视频</el-menu-item>
    <el-menu-item index="join" @click="goto('join')"><el-icon>
        <Stopwatch />
      </el-icon>直播</el-menu-item>

      <el-menu-item index="my/newlive" @click="goto('my/newlive')">
        <el-icon>
          <VideoCamera />
        </el-icon>
        发起直播
      </el-menu-item>
      
      <el-sub-menu index="my" class="user-menu">
      <template #title>
        <template v-if="userStore.islogin">
          <el-avatar :size="30" :src="userStore.avatar" />
          <el-badge :value="userStore.unReadMsg" :hidden="userStore.unReadMsg == 0" :offset="[-10, -10]">
            <div style="width: 10px;"></div>
          </el-badge>
          <div>{{ userStore.user }}</div>
        </template>
        <template v-else>
          <el-icon><User /></el-icon>
          我的
        </template>
      </template>


      <el-menu-item index="my/points" @click="goto('my/points')" v-if="userStore.islogin">
      <!--@click="goto('my/points')-->
      <el-icon><Coin /></el-icon>
      积分: {{ userStore.points || 0 }}
    </el-menu-item>

      <el-menu-item index="upload" v-if="userStore.islogin" @click="goto('my/upload')">
        <el-icon><Upload /></el-icon>
        投稿视频
      </el-menu-item>

      <el-menu-item index="my/favorite" v-if="userStore.islogin" @click="goto('my/favorite')">
        <el-icon><Star /></el-icon>
        我的收藏
      </el-menu-item>

      <el-menu-item index="my/messages" v-if="userStore.islogin" @click="goto('my/messages')">
        <el-badge :value="userStore.unReadMsg" :hidden="userStore.unReadMsg == 0" :offset="[-10, 10]"><el-icon><Bell /></el-icon></el-badge>
消息中心
      </el-menu-item>

      <el-menu-item index="my/setting" v-if="userStore.islogin" @click="goto('my/setting')">
        <el-icon><Setting /></el-icon>
        管理
      </el-menu-item>

      <el-menu-item index="logout" v-if="userStore.islogin" @click="logout">
        <el-icon><SwitchButton /></el-icon>
        注销
      </el-menu-item>

      <el-menu-item index="login" v-if="!userStore.islogin" @click="loginModel">
        <el-icon> <User /></el-icon>
        登录
      </el-menu-item>

    </el-sub-menu>

     

    

    <el-menu-item index="logout" @click="aboutus">
      <el-icon><Service /></el-icon>
      关于
    </el-menu-item>
  </el-menu>

  <n-modal v-model:show="showModal" preset="card" style="width: 700px">
    <template #header>
      <div>{{ isLogin ? '登录' : '注册' }}</div>
    </template>
    <login v-if="isLogin" @callBack="callBackFun" @switch-mode="switchMode" />
    <reg v-else @callBack="callBackFun" @switch-mode="switchMode" />
  </n-modal>

</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import login from '@/components/forms/login.vue';
import { getUnreadCount } from '@/api/api';

const searchinput = ref('');
let userStore = useUserStore();
const showModal = ref(false);

const route = useRoute();
const router = useRouter();
const isLogin = ref(true)
const activeIndex = ref('home');

watch(route, (newRoute) => {
  activeIndex.value = newRoute.name;
}, { immediate: true });

function callBackFun(newmsg) {
  if (newmsg === 1) {
    showModal.value = false;
  }
}
function switchMode() {
  isLogin.value = !isLogin.value
}
function goto(target) {
  if (route.name !== target) {
    router.push({ name: target }).catch(err => {
      if (err.name !== 'NavigationDuplicated') {
        console.error(err);
      }
    });
  }
}
function logout() {
  userStore.logout();
  ElMessage.success('注销成功');
  router.push({ name: 'home' });
}
function loginModel() {
  showModal.value = true;
}
function search() {
  router.push({ name: 'search', params: { name: searchinput.value } });
}
function aboutus() {
  router.push({ name: 'about' })
}
onMounted(async () => {
  const unread=await getUnreadCount()
  userStore.setUnReadMsg(unread.data)
})
</script>
<style scoped>
.header-menu {
  border-bottom: 1px solid var(--el-border-color-light);
  padding: 0 20px;
}

.logo-item {
  margin-right: auto;
  font-size: 18px;
  font-weight: 600;
}

.logo-item :deep(.el-icon) {
  margin-right: 8px;
  font-size: 20px;
  color: var(--el-color-primary);
}

.search-wrapper {
  padding: 0 20px;
}

.search-input {
  width: 300px;
}

.search-input :deep(.el-input-group__append) {
  padding: 0;
}

:deep(.el-menu-item) {
  height: 60px;
  line-height: 60px;
}

:deep(.el-menu-item.is-active) {
  font-weight: 500;
}

:deep(.el-sub-menu__title) {
  height: 60px;
  line-height: 60px;
}

:deep(.el-menu--popup) {
  min-width: 140px;
}

:deep(.el-menu-item .el-icon),
:deep(.el-sub-menu__title .el-icon) {
  margin-right: 6px;
  width: 16px;
  height: 16px;
}

.user-menu :deep(.el-sub-menu__title):hover {
  background-color: var(--el-menu-hover-bg-color);
}

.modal-header {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.live-input {
  width: 100%;
  margin-bottom: 20px;
}

.centered-button {
  display: block;
  margin: 0 auto;
}
</style>