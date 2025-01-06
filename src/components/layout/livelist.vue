<template>
  <div class="video-list"> 
    <template v-for="item in data" :key="item.id">
      <n-card :title="item.roomname" @click="video(item.id)" class="video-card">
        <template #cover>
          <div class="image-wrapper">
            <img :src="item.post" class="video-image">
          </div>
        </template>
        <div class="card-content">
          <div class="author">{{item.username}}</div>
          <div class="video-stats">
          </div>
        </div>
      </n-card>
    </template>
  </div>
  <el-empty v-if="noLive" description="暂无直播" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getLiveList } from '@/api/api';

const data = ref();
const router = useRouter();
const loading = ref(true);

const noLive = ref(false);

onMounted(async () => {
  try {
      data.value = await getLiveList();
      if(data.value.length == 0){
        noLive.value = true;
      }
  } catch (error) {
    console.error('加载视频列表失败:', error);
  } finally {
    loading.value = false;
  }
});

function video(ids) {
  router.push({ 
    name: 'watch', 
    params: { 
      id: 'live' + ids,
    } 
  });
}
</script>

<style scoped>


</style>