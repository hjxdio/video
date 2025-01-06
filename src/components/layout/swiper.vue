<template>
  <n-carousel centered-slides :transition-props="{ name: 'creative' }" show-arrow
    style="width: 100%; height: 400px;margin: auto;">
    <template v-if="loading">
      <n-skeleton height="400px" width="100%" />
    </template>
    <template v-else-if="data" v-for="item in data" :key="item.id">
      <el-image class="carousel-img" :src="item.post" fit="cover" @click="videos(item.id)" />
    </template>
  </n-carousel>
</template>

<style scoped>
.carousel-img {
  width: auto;
  height: 100%;
  object-fit: contain;
  display: block;
  margin: auto;
}

:deep(.creative-enter-from),
:deep(.creative-leave-to) {
  opacity: 0;
  transform: scale(0.8);
}

:deep(.creative-enter-active),
:deep(.creative-leave-active) {
  transition: all 0.3s ease;
}
</style>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { getSwiperList } from '@/api/api';  // Import the new function

const data = ref();
const router = useRouter();
const loading = ref(true);

onMounted(async () => {
  try {
    loading.value = true;
    data.value = await getSwiperList();
  } finally {
    loading.value = false;
  }
})

function videos(ids) {
  router.push({ name: 'watch', params: { id: ids } })
}
</script>