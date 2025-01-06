<template>
  <div class="outer">
    <swiper />
    <n-divider title-placement="left">
      <h1 style="">最新视频</h1>
    </n-divider>
    <Videolist />
    <n-divider />

    <n-divider title-placement="left">
      <h1 style="">原创视频</h1>
    </n-divider>
    <Videolist :isori="true" />
    <n-divider />
  </div>
</template>