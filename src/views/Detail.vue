<template>
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
                    <span class="iconfont icon-download" @click.stop="download(row)" ></span>
                    <span class="size"> {{ Utils.size2Str(row[col.colKey]) }} </span>
                </div>
            </template>
        </t-table>
</template>

<script setup>
import Utils from '../utils/Utils'
import Icon from '../components/Icon.vue'

const props = defineProps({
    data: {
        type: Object 
    },
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
const emit = defineEmits(["download", "preview"])

const preview = (row) => {
    emit("preview", row)
}

const download = (row) => {
    emit("download", row)
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
        font-weight: bold;
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