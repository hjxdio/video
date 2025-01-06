<template>
  <div class="video-list"> 
    <template v-if="loading">
      <n-card v-for="i in 8" :key="i" class="video-card skeleton-card">
        <template #cover>
          <div class="image-wrapper skeleton-image"></div>
        </template>
        <div class="skeleton-text"></div>
      </n-card>
    </template>
    
    <template v-else v-for="item in data" :key="item.id">
      <n-card :title="item.name" @click="video(item.id)" class="video-card">
        <template #cover>
          <div class="image-wrapper">
            <img :src="item.post" class="video-image">
            <div v-if="item.isori" class="original-tag">原创</div>
          </div>
        </template>
        <div class="card-content">
          <div class="author">作者：{{item.author}}</div>
          <div class="video-stats" v-if="!isLike">
            <n-space justify="space-between">
              <span class="stat-item">
                <n-icon><Comment /></n-icon>
                {{ item.comments }}
              </span>
              <span class="stat-item">
                <n-icon><Star /></n-icon>
                {{ item.stars }}
              </span>
            </n-space>
          </div>
        </div>
      </n-card>
    </template>
  </div>
  <el-empty v-if="noVideo" description="暂无视频" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { getVideoList, searchVideoList, getLikedVideos, getOriList, getVideoListR } from '@/api/api';
const userStore = useUserStore();
const props = defineProps({
  isr:{
    type: Boolean,
    default: false
  },
  issearch: {
    type: Boolean,
    default: false
  },
  searchname: {
    type: String,
  },
  isLike: {
    type: Boolean,
    default: false
  },
  isori: {
    type: Boolean,
    default: false
  }
});
const data = ref();
const router = useRouter();
const loading = ref(true);
const noVideo = ref(false);
onMounted(async () => {
  try {
    if (props.issearch && props.searchname) {
      data.value = await searchVideoList(props.searchname);
    } else if (props.isLike) {
      data.value = await getLikedVideos();
    } else if (props.isori) {
      data.value = await getOriList();
    } else if (props.isr) {
      data.value = await getVideoListR();
    } else {
      data.value = await getVideoList();
    }
    if(data.value.length == 0){
      noVideo.value = true;
    }
  } catch (error) {
    console.error('加载视频列表失败:', error);
  } finally {
    loading.value = false;
  }
});

function video(ids) {
  router.push({ name: 'watch', params: { id: ids } });
  console.log(ids);
}
</script>
<style scoped>
.original-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(64, 158, 255, 0.9);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.skeleton-card {
  background: #f5f5f5;
}

.skeleton-image {
  background: #e0e0e0;
  animation: pulse 1.5s infinite;
}

.skeleton-text {
  height: 16px;
  background: #e0e0e0;
  margin-top: 8px;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.author {
  margin-bottom: 8px;
}

.video-stats {
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid #eee;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 0.9em;
}
</style>