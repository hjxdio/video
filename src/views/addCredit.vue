<template>
    <div class="launch-container">
      <n-card title="积分" class="launch-card">
        <el-result
        :icon="status"
        :title="title"
        :sub-title="subTitle"
      >

      </el-result>
      </n-card>
    </div>
  </template>
  
  <script setup>
  import { onMounted,ref} from 'vue'
  import { useRoute } from 'vue-router';
  import { useUserStore } from '@/stores/user';
  import { addCreditByToken,addCreditByCard } from '../api/user';
  const userStore = useUserStore();
  const route = useRoute();
  const token = route.params.token;
  const status=ref('error')
  const title=ref('失败')
  const subTitle=ref('领取失败')

  onMounted(async () => {
    let res
    if(route.params.type=='1'){
      res=await addCreditByToken(token)
    }else{
      res=await addCreditByCard(token)
    }
   if(res.code==200){
    status.value='success'
    title.value='成功'
    subTitle.value='增加成功'
    userStore.setPoints(res.data)
   }
  })
  </script>
  <style scoped>

  </style>