<template>
  <div class="launch-container">
    <n-card title="关于" class="launch-card">
      <template #header-extra>
        <n-text type="info">Version {{ version }}</n-text>
      </template>

      <div class="about-content">
        <h2>项目功能概览</h2>
        <p>本平台是一个集视频点播与直播功能于一体的在线系统，基于 Vue 3 和 Vite 构建，旨在提供流畅的用户体验和丰富的互动功能。</p>
        <h2>核心功能</h2>
        <n-list>
          <n-list-item>
            <n-text strong>视频管理</n-text> - 用户可以上传、播放、收藏、评论和点赞视频。
          </n-list-item>
          <n-list-item>
            <n-text strong>直播互动</n-text> - 支持创建和观看直播，实时聊天和在线人数统计。
          </n-list-item>
          <n-list-item>
            <n-text strong>用户管理</n-text> - 提供注册、登录、个人信息修改和头像上传功能。
          </n-list-item>
          <n-list-item>
            <n-text strong>智能搜索</n-text> - 支持视频内容的快速搜索。
          </n-list-item>
        </n-list>

        <h2>技术栈</h2>
        <n-space vertical>
          <n-tag type="success">Vue 3</n-tag>
          <n-tag type="info">Vite</n-tag>
          <n-tag type="warning">Element Plus</n-tag>
          <n-tag type="error">Naive UI</n-tag>
          <n-tag type="primary">php</n-tag>
          <n-tag type="default">WebSocket</n-tag>
        </n-space>

        <h2>联系我们</h2>
        <p>如有任何问题或建议，欢迎通过以下方式联系我们：</p>
        <n-space vertical>
          <n-text>邮箱: hjxwz123@126.com</n-text>
        </n-space>
      </div>
    </n-card>
  </div>
</template>

<script setup>
const version = import.meta.env.VITE_APP_VERSION;
</script>

<style scoped>


.about-content {
  padding: 20px 0;
}

.about-content h2 {
  margin: 24px 0 16px;
  color: #303133;
  font-weight: 600;
}

.about-content p {
  color: #606266;
  line-height: 1.8;
  margin-bottom: 16px;
}

.n-space {
  margin: 16px 0;
}

.n-tag {
  padding: 6px 12px;
}

@media (max-width: 768px) {
  .about-container {
    padding: 0 10px;
  }
  
  .about-content {
    padding: 16px 0;
  }
}
</style>