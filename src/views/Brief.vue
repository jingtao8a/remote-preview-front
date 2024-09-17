<template>
        <ul>
            <li v-for="item in data.list" :key="item.fileId" @click.stop="preview(item)">
                <Icon class="cover" v-if="item.folderType == 0 && (item.fileType == 1 || item.fileType == 3)" :width="35" :cover="item.fileId + '.jpg'"></Icon>
                <Icon class="cover" v-else-if="item.folderType == 1" :fileType="0" :width="35"></Icon>
                <Icon class="cover" v-else :fileType="item.fileType"></Icon>
                <span>
                    {{item.fileName.length > 50 ? item.fileName.substring(0, 50) + "..." : item.fileName}}
                </span>
            </li>
        </ul>
</template>

<script setup>
import Icon from '../components/Icon.vue'

const props = defineProps({
    data: {
        type: Object,
    },
})

const emit = defineEmits()

const preview = (item) => {
    emit("preview", item)
}
</script>

<style lang="scss" scoped>

ul {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    padding-left: 0;
    margin: 0;
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
        word-wrap: break-word;
        font-weight: bold;
    }
}
}

</style>