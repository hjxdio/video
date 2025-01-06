<template>
  <div class="video-container" v-if="video && video.url && isvideo&& !islive">
    <video-header :title="video.name" :author="video.author"  :avatar-url="video.avatar" />
    <div class="video-player">
      <player :src="video.url" :islive="islive" :poster="video.post" />
    </div>
    <video-footer :videoId="Number(id)" :userId="userStore.userId" :views="video.view":create-time="formatDate(video.createTime)" :description="video.description" />
    <video-comments :video-id="id" :author-id="authorId" />
  </div>
  <div class="live-container" v-if="islive && live.name">
    <video-header :title="live.name" :author="live.user" :avatar-url="live.avatar" />
     <div class="live-main">
      <div class="video-player" :class="{ 'stream-ended': streamEnded }">
        <div v-if="streamEnded"><el-empty description="主播暂时离开" /></div>
        <player :hidden="streamEnded" :src="live.url" :islive="true" :poster="live.post" @stream-ended="handleStreamEnded" @stream-resumed="handleStreamResumed" :id="liveid" @live-closed="handleLiveClosed"/>
      </div>
      <div class="live-chat">
      <chat-room :room-id="liveid" :user-id="String(userStore.userId)" :is-live-view="true" :name="live.name" />
    </div>
    </div> 
    <video-footer :description="live.description" />
  </div>
  <el-empty v-if="!isvideo && !islive" description="视频不存在" />
  <el-empty v-if="islive && !live.name" description="直播不存在或暂未开播" />
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { getVideoInfo,getUserAva,addViews, getRoomInfo } from '@/api/api';
import { useRoute,useRouter } from 'vue-router'
import { formatDate } from '@/utils/tools'
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const route = useRoute()
const router = useRouter();
const id = route.params.id;
const streamEnded = ref(false)
const liveid = ref('')
const isvideo = ref(true)
const video = ref()

const authorId = ref('')

const islive = ref(false)
const live = ref({
  name: '',
  id: '',
  url: '',
  post: ''
})
const checkIfLive = (id) => {
  if (typeof id === 'string' && id.startsWith('live')) {
    return true // 返回 'live' 后面的字符
  }
  return false
}
const handleStreamEnded = () => {
  streamEnded.value = true
}
const handleStreamResumed = () => {
  streamEnded.value = false
}
const handleLiveClosed = () => {
  router.push('/')
}
onMounted(async () => {
  if (checkIfLive(id)) {
    islive.value = true
    if(!userStore.islogin){
      ElMessage.error('请先登录');
      router.push({ name: 'home' });
    }
    liveid.value  = id.substring(4)
    const roomdata=await getRoomInfo(liveid.value)
    if(roomdata){
      const avatar = await getUserAva(roomdata.userid)
      const livadata={
      name:roomdata.roomname,
      user:roomdata.username,
      id:liveid.value,
      url:'http://39.107.142.61:8080/live/'+ roomdata.url + '.flv',
      post:roomdata.post,
      description:roomdata.roomdes,
      avatar:avatar
    }
    live.value = livadata
    }
  }
  else {
    islive.value = false
    try {
      await addViews(id)
      const data = await getVideoInfo(id)
      authorId.value = data.userid
      if (data) {
        let avatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
        if(data.isori){
          avatar = await getUserAva(data.userid)
        }
        video.value = {
            ...data,
            videoId: Number(data.videoId),
            avatar: avatar
        } 
      } else {
        isvideo.value = false
      }
    } catch (error) {
      console.error('获取视频信息失败:', error)
      isvideo.value = false
    }
  }
})
</script>

<style scoped>
.video-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.video-player {
  width: 100%;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
}

.video-player.stream-ended {
  background-color: #ffffff; /* Example: change background color */
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .video-container {
    padding: 0 10px;
  }
}

.live-container {
  flex-direction: column;
  max-width: 1600px;
  margin: 20px auto;
  padding: 0 20px;
  display: flex;
  gap: 20px;
}

.live-main {
  gap: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.live-chat {
  width: 100%;
  flex-shrink: 0;
}

@media (min-width: 1025px) {
  .live-main {
    flex-direction: row;
  }
  
  .live-chat {
    width: 350px;
  }
}
</style>