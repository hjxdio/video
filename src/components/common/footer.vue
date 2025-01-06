<template>
    <footer class="site-footer">
      <div class="footer-content">
        <div class="footer-info">
          <p class="copyright">© {{ currentYear }} 在线视频直播系统. All rights reserved.</p>
          <p class="contact">联系我: hjxwz123@126.com</p>
        </div>
      </div>
    </footer>
  </template>
  <script setup>
  import { ref} from 'vue'
  const currentYear = ref(new Date().getFullYear())
  </script>
  
  <style scoped>
  .site-footer {
    background-color: #f5f7fa;
    padding: 10px 0;
    margin-top: auto;
    width: 100%;
  }
  
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    text-align: center;
  }
  
  .footer-info {
    margin-bottom: 10px;
  }
  
  .copyright, .contact {
    color: #606266;
    margin: 5px 0;
    font-size: 14px;
  }
  
  .footer-links {
    font-size: 14px;
  }
  
  .footer-links a {
    color: #409EFF;
    text-decoration: none;
  }
  
  .footer-links a:hover {
    color: #66b1ff;
  }
  
  .divider {
    margin: 0 10px;
    color: #909399;
  }
  
  @media (max-width: 768px) {
    .footer-content {
      padding: 0 10px;
    }
  }
  </style>