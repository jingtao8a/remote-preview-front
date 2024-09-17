<template>
    <div>
        <Navigation ref="navigationRef" @navChange="onNavChange"></Navigation>
        <ul>
            <li v-for="item in data.list" :key="item.fileId" @click.stop="preview(item)">
                <Icon class="cover" v-if="item.fileType == 1 || item.fileType == 3" :width="35" :cover="item.fileId + '.jpg'"></Icon>
                <Icon class="cover" v-else-if="item.folderType == 1" :fileType="0" :width="35"></Icon>
                <Icon class="cover" v-else :fileType="row.fileType"></Icon>
                <span>
                    {{item.fileName.length > 50 ? item.fileName.substring(0, 50) + "..." : item.fileName}}
                </span>
            </li>
        </ul>
        <el-pagination
        v-model:current-page="data.pageNo"
        v-model:page-size="data.pageSize"
        :total="data.totalCount"
        :page-sizes="[10, 20, 30, 50]"
        layout="sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        />
        </div>
        <Preview ref="previewRef"></Preview>
</template>

<script setup>
import {ref, reactive} from 'vue'
import Reqeust from '../utils/Request'
import API from '../js/API';
import Icon from '../components/Icon.vue'
import Navigation from '../components/Navigation.vue'
import Preview from '../components/preview/Preview.vue';
import Message from '../utils/Message';

const data = ref({
    pageNo: 1,
    pageSize: 10,
})

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

<style lang="scss" scoped>

li {
    list-style: none;
    display: flex;
    flex-direction: column;
    margin-bottom: 5vh;
    span {
        padding-top: 2vh;
        width: 35vw;
        height: 10vh;
        text-align: center;
    }
}
ul {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    padding-left: 0;
    margin: 0;
}

</style>