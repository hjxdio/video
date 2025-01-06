<template>
  <div id="xgPlayerWrap" class="player-container" v-if="props.src"></div>
</template>
<script setup lang="ts">
import Player from 'xgplayer'
import FlvPlugin from 'xgplayer-flv'
import Mp4Plugin from 'xgplayer-mp4'
import 'xgplayer/dist/index.min.css'
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getRoomInfo } from '@/api/live'
const props = defineProps(['src', 'islive', 'poster', 'id']);
const player = ref(null)
const emit = defineEmits(['stream-ended', 'stream-resumed', 'live-closed'])
let firstLoadRetryHandled = false;
onMounted(() => {
  init()
  if (props.islive) {
    startLiveStatusCheck()
  }
})
const streamEnded = ref(false)

const init = () => {
  player.value = new Player({
    id: 'xgPlayerWrap',
    fluid: true,
    fitVideoSize: 'fixed',
    videoFillMode: 'contain',
    url: props.src,
    isLive: props.islive,
    plugins: props.islive ? [FlvPlugin] : [Mp4Plugin],
    flv: {
      targetLatency: 5, // 直播目标延迟，默认 5 秒
      maxLatency: 10, // 直播允许的最大延迟，默认 10 秒
      disconnectTime: 0, // 直播断流时间，默认 0 秒，（独立使用时等于 maxLatency）
      retryCount: 100,
      retryDelay: 2000, // 每次重试间隔 1 秒，默认值
      loadTimeout: 1000, // 请求超时时间为 10 秒，默认值
      fetchOptions: {
        mode: 'cors'
      }
    },
    poster: props.poster,
    autoplay: true,
    autoplayMuted: true,
    videoInit: true,
    playsinline: true,
    defaultPlaybackRate: 1,
    volume: 0.72,
    loop: false,
    startTime: 0,
    videoAttributes: {},
    lang: 'zh-cn',
    seekedStatus: 'play',
    marginControls: false,
    domEventType: 'default',
    icons: {},
    i18n: [],
    commonStyle: {
      progressColor: 'green',
      playedColor: 'chocolate',
      volumeColor: 'pink',
    },
    controls: true,
    miniprogress: true,
    screenShot: false,
    rotate: true,
    pip: true,
    mini: true,
    cssFullscreen: true,
    playbackRate: [0.5, 1, 1.5, 2, 3],
    keyShortcut: false,
  })
  player.value.on('error', (error) => {
    console.log(error)
    if (props.islive) {
      errorHandler()
      startLiveStatusCheck()
    }

  })
  player.value.on('core_event', ({ eventName, ...rest }) => {
    if (eventName === 'core.loadretry') {
      if (!firstLoadRetryHandled) {
        firstLoadRetryHandled = true;
        handleFirstLoadRetry();
      }
    }
    if (eventName === 'core.buffereos') {
      attemptReconnect()
    }
    if (eventName === 'core.sourcebuffercreated') {
      streamEnded.value = false
      emit('stream-resumed')
      firstLoadRetryHandled = false
    }
  })
  player.value.on('play', () => {
    if (props.islive && streamEnded.value) {
      streamEnded.value = false
      emit('stream-resumed')
      firstLoadRetryHandled = false
      ElMessage({
        message: '直播已恢复',
        type: 'success',
      })
    }
  })
  console.log(player.value)
}
function handleFirstLoadRetry() {
  if (props.islive) {
    errorHandler()
  }
}
function errorHandler() {
  streamEnded.value = true
  emit('stream-ended')
  ElMessage({
    message: '主播暂时离开',
    type: 'info',
  })
}
function attemptReconnect() {
  if (props.islive) {
    const reconnectInterval = setInterval(() => {
      if (!streamEnded.value) {
        ElMessage({
          message: '直播已恢复',
          type: 'success',
        })
        streamEnded.value = false
        emit('stream-resumed')
        firstLoadRetryHandled = false
        clearInterval(reconnectInterval)
        return
      }
      console.log('Attempting to reconnect...')
      init()
    }, 5000)
  }
}
onUnmounted(() => {
  player.value.destroy()
})
function startLiveStatusCheck() {
  const liveStatusInterval = setInterval(async () => {
    try {
      const roomInfo = await getRoomInfo(props.id);
      console.log(roomInfo)
      if (!roomInfo) {
        console.log('直播已关闭')
        emit('live-closed')
        ElMessage({
          message: '直播间已经关闭',
          type: 'warning',
        })
        clearInterval(liveStatusInterval);
        return
      }
    } catch (error) {
      console.error('Error checking live status:', error);
    }
  }, 60000); 
}
</script>
<style scoped>
.player-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
}
</style>