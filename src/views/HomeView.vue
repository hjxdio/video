<template>
  <div class="outer">
    <swiper />
    <n-divider title-placement="left">
      <h1 style="">推荐视频</h1>
    </n-divider>
    <videolist :isr="true" />
    <n-divider />
    <n-divider title-placement="left">
      <h1 style="">推荐直播</h1>
    </n-divider>
    <Livelist />
    <n-divider />  
  </div>
</template>
