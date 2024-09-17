<template>
    <div>
        <t-dropdown-menu>
            <t-dropdown-item :options="modelOption.options" :value="modelValue" @change="onChange" />
        </t-dropdown-menu>
        <Navigation ref="navigationRef" @navChange="onNavChange"></Navigation>
        <RouterView v-slot="{Component}">
            <component
            :is="Component"
            :data="data"
            @download="download"
            @preview="preview">
            </component>
        </RouterView>
        <el-pagination
        v-model:current-page="data.pageNo"
        v-model:page-size="data.pageSize"
        :total="data.totalCount"
        :page-sizes="[10, 20, 30, 50]"
        layout="sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        />
        <Preview ref="previewRef"></Preview>
    </div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue'
import {useRoute, useRouter } from 'vue-router';
import Reqeust from '../utils/Request'
import API from '../js/API';
import Navigation from '../components/Navigation.vue'
import Preview from '../components/preview/Preview.vue';
import Message from '../utils/Message';

const data = ref({
    pageNo: 1,
    pageSize: 10,
})
const route = useRoute()
const router = useRouter()

const modelValue = ref()

const modelOption = {
  options: [
    {
      value: 'detail',
      label: '详细信息',
    },
    {
      value: 'brief',
      label: '大图标',
    },
  ],
}

onMounted(()=>{//确保route的path和mdoelValue能相对应
    modelValue.value = route.path.substring(1)
})

const onChange = (e) => {
  let suffix = ''
  let start = route.fullPath.indexOf('?')
  if (start != -1) {
    suffix = route.fullPath.substring(start)
  }
  router.replace("/" + e + suffix)
}

const currentFolder = ref({fileId: 0})
const fileNameFuzzy = ref()
const navigationRef = ref()
const loadDataList = async () => {
    let params = {}
    if (data.value != null && typeof data.value.pageNo != undefined) {
        params.pageNo = data.value.pageNo
    }
    if (data.value != null && typeof data.value.pageSize != undefined) {
        params.pageSize = data.value.pageSize
    }
    params.fileNameFuzzy = fileNameFuzzy.value
    params.filePid = currentFolder.value.fileId
    let result = await Reqeust({
        url: API.loadDataList,
        params: params,
    })
    if (!result) {
        return
    }
    data.value = result.data
}

loadDataList()

// 下载文件
const download = async (row) => {
    let result = await Reqeust({
        url: API.createDownloadUrl + "/" + row.fileId
    })
    if (!result) {
        return
    }
    window.location.href = API.download + "/" + result.data
}
const previewRef = ref()

//预览
const preview = async (row)=> {
    if (row.folderType == 1) {//目录
        navigationRef.value.openFolder(row)
        return
    }
    if (row.fileType == 1) {//视频
        let result = await Reqeust({
            url: API.getVideo + row.fileId,
            responseType: "arraybuffer",//json 和 arraybuffer两种返回类型需要考虑
        })
        console.log("result", result)
        let transferSuccess = true
        let responseVO = null
        let str = null
        try {
            let decoder = new TextDecoder('utf-8')
            str = decoder.decode(new Uint8Array(result));
            console.log("str", str)
        }catch (error) {
            Message.error("DECODE ERROR")
            return
        }

        try {
            responseVO = JSON.parse(str)
            console.log("responseVO", responseVO)
        } catch (error) {
            transferSuccess = false
        } finally {
            if (transferSuccess) {
                Message.error(responseVO.info)
                return
            }
        }
    }
    previewRef.value.showPreview(row)
}

const onNavChange = (newCurrentFolder) => {
    currentFolder.value = newCurrentFolder
    loadDataList()
}

const handleSizeChange = (pageSize) => {
    data.value.pageSize = pageSize;
    loadDataList()
}

const handleCurrentChange = (pageNo) => {
    data.value.pageNo = pageNo
    loadDataList()
}
</script>

<style scoped>
</style>