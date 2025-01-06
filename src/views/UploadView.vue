<template>
    <div class="upload-container">
      <n-card title="视频投稿" class="upload-card">
        <template #header-extra>
          <n-text type="info">请确保视频内容符合规范</n-text>
        </template>
        
        <uploadvideo />
      </n-card>
    </div>
  </template>
  
  <style scoped>
  .upload-container {
    max-width: 1200px;
    margin: 20px auto;
    padding: 0 20px;
  }
  
  .upload-card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    .upload-container {
      padding: 0 10px;
    }
  }
  </style>