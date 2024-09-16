<template>
  <div class="top-navigation">
    <template v-if="folderList.length > 0">
      <span class="back link" @click="backParent">返回上一级</span>
      <el-divider direction="vertical" />
    </template>
    <span v-if="folderList.length == 0" class="all-file">全部文件</span>
    <span v-if="folderList.length > 0" class="link" @click="setCurrentFolder(-1)">全部文件</span>
    <template v-for="(item, index) in folderList">
      <span class="iconfont icon-right"></span>
      <span class="link" @click="setCurrentFolder(index)" v-if="index < folderList.length - 1">
        {{ item.fileName }}</span>
      <span v-if="index == folderList.length - 1" class="text">
        {{item.fileName}}</span>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import API from "../js/API"
import Request from "../utils/Request";

const router = useRouter();
const route = useRoute();

const props = defineProps({
  watchPath: {
    type: Boolean, //是否监听路径变化
    default: true,
  },
});


//目录
const folderList = ref([]);//导航栏的目录信息
//当前目录
const currentFolder = ref();

//初始化
const init = () => {
  folderList.value = [];
  currentFolder.value = { fileId: "0" };
  // console.log("navigation init")
  navChange();
};

//点击目录
const openFolder = (data) => {
  const { fileId, fileName } = data;
  const folder = {
    fileName: fileName,
    fileId: fileId,
  };
  folderList.value.push(folder);
  currentFolder.value = folder;
  setPath();
};

defineExpose({ openFolder, init });

//返回上一级
const backParent = () => {
  let currentIndex = null;
  for (let i = 0; i < folderList.value.length; i++) {
    if (folderList.value[i].fileId == currentFolder.value.fileId) {
      currentIndex = i;
      break;
    }
  }
  setCurrentFolder(currentIndex - 1);
};

//点击导航 设置当前目录
const setCurrentFolder = (index) => {
  if (index == -1) {
    //返回全部
    currentFolder.value = { fileId: "0" };
    folderList.value = [];
  } else {
    currentFolder.value = folderList.value[index];
    folderList.value.splice(index + 1, folderList.value.length);
  }
  setPath();
};

//设置URL路径
const setPath = () => {
  if (!props.watchPath) {
    navChange()
    return;
  }
  let pathArray = [];
  folderList.value.forEach((item) => { pathArray.push(item.fileId); });
  router.push({
    path: route.path,
    query:
      pathArray.length == 0 ? "" : { path: pathArray.join("/"), },
  });
};

//获取当前路径所有目录列表的信息
const getNavigationFolder = async (path) => { //getFolderInfo
  let result = await Request({
    url: API.getFolderInfo,
    showLoading: false,
    params: {
      path: path,
    },
  });
  if (!result) {
    return;
  }
  folderList.value = result.data;
};

const emit = defineEmits(["navChange"]);
const navChange = () => {
  emit("navChange", currentFolder.value);
};

watch(
  () => route,
  (newVal, oldVal) => {
    if (!props.watchPath) {
      return;
    }
    
    const path = newVal.query.path;
    if (path == undefined) {
      init();
    } else {
      getNavigationFolder(path);
      //设置当前目录
      let pathArray = path.split("/");
      currentFolder.value = { fileId: pathArray[pathArray.length - 1],};
      navChange();
    }
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.top-navigation {
  padding-left: 15px;
  font-size: 13px;
  display: flex;
  align-items: center;
  line-height: 40px;
  .all-file {
    font-weight: bold;
  }
  .link {
    color: #06a7ff;
    cursor: pointer;
  }
  .icon-right {
    color: #06a7ff;
    padding: 0px 5px;
    font-size: 13px;
  }
}
</style>