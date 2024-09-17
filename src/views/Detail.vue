<template>
    <div>
        <Navigation ref="navigationRef" @navChange="onNavChange"></Navigation>
        <t-table
            row-key="index"
            :data="data != null && typeof data.list != undefined ? data.list : null"
            :columns="columns"
            :show-header="false"
            :max-height="650"
            cell-empty-content="-"
            @row-click="handleRowClick"
            @cell-click="handleCellClick"
            @scroll="handleScroll"
            >
            <!-- 插槽方式 自定义单元格：cell 的值为插槽名称，参数有：{col, colIndex, row, rowIndex}  -->
            <template  #fileName="{ col, row }">
                <div class="fileName" >
                    <Icon class="cover" v-if="row.fileType == 1 || row.fileType == 3" :cover="row.fileId + '.jpg'"></Icon>
                    <Icon class="cover" v-else-if="row.folderType == 1" :fileType="0" :width="25"></Icon>
                    <Icon class="cover" v-else :fileType="row.fileType"></Icon>
                    <p class="name" @click.stop="preview(row)">
                        {{ row[col.colKey].length > 50 ? 
                        row[col.colKey].substring(0, 50) + "..." : row[col.colKey] }}
                    </p>
                </div>
            </template>

            <!-- 插槽方式 自定义单元格， colKey 的值默认为插槽名称  -->
            <template #fileSize="{ col, row }">
                <div class="fileSize" v-if="row.folderType == 0">
                    <span class="iconfont icon-download" @click="download(row)" ></span>
                    <span class="size"> {{ Utils.size2Str(row[col.colKey]) }} </span>
                </div>
            </template>
        </t-table>
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
import Utils from '../utils/Utils'
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

const columns = [
    {
        colKey: 'fileName',
        title: 'fileName',
        width: '70vw',
    },
    {
        colKey: "fileSize",
        title: 'fileSize',
        width: '30vw',
    }
]

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
const handleRowClick = (e) => {
  console.log('row-cliek=====', e);
}

const handleCellClick = (e) => {
  console.log('cell-cliek=====', e);
}

const handleScroll = (e) => {
  console.log('scroll=====', e);
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

.fileName {
    // background-color: blue;
    display: flex;
    flex-direction: row;
    height: 22vw;
    align-items: center;
    .cover {
        margin: auto 0;
    }
    .name {
        height: 20vw;
        line-height: 16px;
        letter-spacing: 1px;
        padding-left: 2vw;
        width: 38vw;
        font-size: 12px;
        word-wrap: break-word;
    }
}

.fileSize {
    // background-color: orange;
    display: flex;
    flex-direction: column;
    .iconfont {
        text-align: center;
    }
    .size {
        font-size: 12px;
        text-align: center;
    }
}

</style>