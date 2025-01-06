<template>
    <div class="launch-container">
      <n-card class="launch-card">
        <n-tabs type="line" animated>
          <n-tab-pane name="profile" tab="个人信息">
            <updatemyinfo />
          </n-tab-pane>
          <n-tab-pane name="videos" tab="投稿管理">
            <manage-videos />
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </div>
  </template>