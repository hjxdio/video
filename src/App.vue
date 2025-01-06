<template>
    <header-vue />
    <router-view class="main-content"></router-view>
    <!-- <footer-vue /> -->
</template>
<script lang="ts" setup>

import HeaderVue from './components/common/header.vue'
import { getWeb } from './api/live';
import { onMounted } from 'vue';

onMounted(async () => {
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const domain = url.hostname;
  console.log(domain);
  const res = await getWeb();
  if(res.url != domain){
    ElNotification({
      position: 'bottom-left',
      dangerouslyUseHTMLString: true,
      title: '错误',
      message: res.notice.errordomain, 
      type: 'error',
      showClose: false,
      duration: 0,
    })
  }
  if(res.notice.isnotice == true){
    ElNotification({
      dangerouslyUseHTMLString: true,
      title: res.notice.title,
      message: res.notice.content,
      type: 'info',
      duration: 10000,
  })
  }
  console.log(res);
});
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>