<template>
    <div class="up">
        <h1 style="text-align: center;">加入直播</h1>
    </div>
    <div class="down">
        <h2 style="text-align: center;">请输入直播间号码</h2>
        <n-input style="width:30%" size="large" round placeholder="请输入直播间号码" v-model:value="liveid" />
        <br>
        <n-button color="rgb(26, 128, 245)" round size="large" @click="join">
            加入
        </n-button>
    </div>
    <br>
    <div class="fav-container">
      <n-card title="当前直播" class="fav-card">
        <Livelist />
      </n-card>
    </div>
    
</template>

<script setup>
import { useRouter } from 'vue-router';
import { getLiveList } from '@/api/api';

const router = useRouter();
const liveid = ref();

async function join() {
    console.log(liveid.value)
    const alldata = await getLiveList()
    const liveData = alldata.find(item => item.id == liveid.value)
    console.log(alldata)
    if (liveData) {
        router.push({ name: 'watch', params: { id: "live"+liveid.value } });
    }
    else {
        ElMessageBox.alert('直播不存在，请检查直播ID', '提示', {
            confirmButtonText: 'OK',
        })
    }
}

</script>
<style scoped>
.up {
    width: 100%;
    height: 30vh;
    background-color: rgb(251, 251, 251);
    display: flex;
    justify-content: center;
    align-items: center;
}

.down {
    width: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>