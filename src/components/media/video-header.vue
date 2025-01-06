<template>
<div class="video-header">
      <h1 class="video-title">{{ title }}</h1>
      <div class="author">
        <el-avatar :size="32" :src="avatarUrl" />
        <span class="author-name">{{ author }}</span>
  </div>
</div>
</template>
<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String,
  }
})
</script>
<style scoped>
.video-header {
  margin-bottom: 16px;
}

.video-title {
  font-size: 24px;
  margin: 0 0 12px 0;
  color: #303133;
}

.author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-name {
  font-size: 16px;
  font-weight: 500;
  color: #606266;
}
@media (max-width: 768px) {
  .video-title {
    font-size: 20px;
  }
}
</style>