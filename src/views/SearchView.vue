<template>
    <div class="outer">
    <n-divider title-placement="left">
      <h1 style="">搜索视频</h1>
    </n-divider>
    <Videolist :issearch="true" :searchname="name"/>
    <n-divider />
  </div>
  </template>
  
  <script setup>
  import { onMounted} from 'vue'
  import { useRoute } from 'vue-router';
  const route = useRoute();
  const name = route.params.name;
  
  onMounted(async () => {
   console.log(name)
  })
  </script>
  <style scoped>

  </style>