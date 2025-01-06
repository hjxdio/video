<template>
   <el-dialog
    v-model="ok"
    title="提示"
    width="500"
  >
  正在发布中，请稍等...
  <n-spin size="large" />
    
  </el-dialog>

  <n-upload action="https://" @finish="handleFinish" response-type="json"
    @before-upload="beforeUpload">
    <n-upload-dragger>
      <div style="margin-bottom: 12px">
        <n-icon size="48" :depth="3">
          <Link />
        </n-icon>
      </div>
      <n-text style="font-size: 16px">
        点击或者拖动文件到该区域来上传
      </n-text>
      <n-p depth="3" style="margin: 8px 0 0 0">
        请不要上传敏感数据
      </n-p>
    </n-upload-dragger>
  </n-upload>
  <div v-if="isupload" style="display: flex;flex-direction: column;" :v-loading="!ok">
    <n-divider title-placement="left">
      <h1>文件信息</h1>
    </n-divider>
    <h3>
      视频名称：{{ filedata.name }}
    </h3>
    <h3>
      视频大小：{{ formatFileSize(filedata.size) }}
    </h3>
    <n-divider title-placement="left">

      <h1>视频信息</h1>
    </n-divider>
    <div class="form">
      <n-form ref="formRef" :model="formValue" label-placement="left" :rules="rules">
        <n-form-item label="视频名称" path="name">
          <n-input v-model:value="formValue.name" placeholder="输入视频名称" />
        </n-form-item>

        <n-form-item label="是否原创" path="isori">
          <n-switch v-model:value="formValue.isori" />
          <div style="width:10px"></div>
          <n-text v-if="formValue.isori">原创视频</n-text>
          <n-text v-else>非原创视频</n-text>
        </n-form-item>

        <n-form-item label="作者" v-if="!formValue.isori" path="author">
          <n-input v-model:value="formValue.author" placeholder="输入作者" />
        </n-form-item>
        <n-form-item label="视频描述" path="description">
          <n-input type="textarea" v-model:value="formValue.description" placeholder="输入视频描述" />
        </n-form-item>
        <n-form-item label="封面地址" path="poster">
          <div>
            <n-upload :show-file-list="false" action="https://api.tmzjy.cn/video/upload/index"
              @finish="handleFinishpost" response-type="json" @before-upload="beforeUploadpost">
              <n-upload-dragger>
                <n-text style="font-size: 16px">
                  点击或者拖动文件到该区域来上传
                </n-text>
              </n-upload-dragger>
            </n-upload>

            <el-image v-if='postdata' style="width: 300px; height: 200px" :src="postdata.url" fit="scale-down" />
          </div>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" type="primary" @click="upload" :disabled="ok">
            发布视频
          </n-button>
        </n-form-item>
      </n-form>
    </div>

  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue';
import { uploadVideo} from '@/api/api';
import { formatFileSize } from '@/utils/tools';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
const ok = ref(false);
const isupload = ref(false)
const formRef = ref(null)
const filedata = ref();
const postdata = ref();
const progress=ref();
const formValue = reactive({
  name: '',
  author: '',
  poster: '',
  postername: '',
  description: '',
  isori: false,
  userid: userStore.userId
})
const rules = reactive({
  name: {
    required: true,
    message: '请输入视频名称',
    trigger: 'blur'
  }
})
const handleFinish = async ({
  file,
  event
}) => {
  isupload.value = true
  filedata.value = event.currentTarget.response.data
  console.log(filedata)
}
async function beforeUpload(data) {
  if (data.file.file?.type !== 'video/mp4') {
    ElMessage.error('只能上传mp4格式');
    return false
  }
  return true
}

const handleFinishpost = async ({
  file,
  event
}) => {
  postdata.value = event.currentTarget.response.data
  formValue.poster = postdata.value.path
  formValue.postername = postdata.value.name
  console.log(postdata.value.path)
}
async function beforeUploadpost(data) {
  if (data.file.file?.type !== 'image/jpeg') {
    ElMessage.error('只能上传jpg格式');
    return false
  }
  return true
}

async function upload(e) {
  ok.value = true
  e.preventDefault();

  formRef.value?.validate(async (errors) => {
    if (!errors) {
      if(formValue.isori){
        formValue.author = userStore.user
      }
      const datas = {
        data: filedata.value,
        video: formValue
      }
      console.log(datas)
      try {
        const res = await uploadVideo(datas, (progressEvent) => {
          if (progressEvent.lengthComputable) {
            progress.value = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          }
        });
        if (res.code == 200) {
          ElMessage.success('发布成功');
          isupload.value = false;
          filedata.value = null;
          postdata.value = null;
          ok.value = false;
          progress.value = 0;
          Object.assign(formValue, {
            name: '',
            author: '',
            poster: '',
            postername: '',
            description: '',
            isori: false,
            userid: userStore.userId
          });
        } else {
          ElMessage.error('发布失败');
          ok.value = false;
        }
        console.log(res.data)
      } catch (error) {
        ElMessage.error('发布失败');
        ok.value = false;
      }
    }
    else {
      ElMessage.error('请输入信息');
    }
  })
}

</script>
<style scoped>

</style>
