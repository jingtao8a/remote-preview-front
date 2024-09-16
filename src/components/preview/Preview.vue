<template>
  <!-- 图片 -->
  <PreviewImage
    ref="imageViewerRef"
    :imageList="[imageUrl]"
    v-if="fileInfo.fileType == 3"
  ></PreviewImage>
  <Window
    :show="windowShow"
    @close="closeWindow"
    :width="fileInfo.fileType == 1 ? 1500 : 900"
    :title="fileInfo.fileName"
    :align="fileInfo.fileType == 1 ? 'center' : 'top'"
    v-else
  >
    <!-- 视频 -->
    <PreviewVideo :url="url" v-if="fileInfo.fileType == 1"></PreviewVideo>
    <!-- excel -->
    <PreviewExcel :url="url" v-if="fileInfo.fileType == 6"></PreviewExcel>
    <!-- doc -->
    <PreviewDoc :url="url" v-if="fileInfo.fileType == 5"></PreviewDoc>
    <!-- pdf -->
    <PreviewPdf :url="url" v-if="fileInfo.fileType == 4"></PreviewPdf>
    <!-- txt -->
    <PreviewTxt :url="url" v-if="fileInfo.fileType == 7 || fileInfo.fileType == 8"></PreviewTxt>
    <!-- music -->
    <PreviewMusic :url="url" :fileName="fileInfo.fileName" v-if="fileInfo.fileType == 2"></PreviewMusic>
    <!-- zip 或 其它 -->
    <PreviewDownload
      :createDownloadUrl="createDownloadUrl"
      :downloadUrl="downloadUrl"
      :fileInfo="fileInfo"
      v-if="fileInfo.fileType == 9 || fileInfo.fileType == 10"
    ></PreviewDownload>
  </Window>
</template>

<script setup>
import PreviewDoc from "./PreviewDoc.vue";
import PreviewExcel from "./PreviewExcel.vue";
import PreviewImage from "./PreviewImage.vue";
import PreviewPdf from "./PreviewPdf.vue";
import PreviewVideo from "./PreviewVideo.vue";
import PreviewTxt from "./PreviewTxt.vue";
import PreviewDownload from "./PreviewDownload.vue";
import PreviewMusic from "./PreviewMusic.vue";
import Window from "./Window.vue";
import { ref, reactive, getCurrentInstance, nextTick, computed } from "vue";
import API from '../../js/API'



const windowShow = ref(false);
const closeWindow = () => {
  windowShow.value = false;//关闭windows
};

const url = ref(null);
const createDownloadUrl = ref(null);
const downloadUrl = ref(null);

const fileInfo = ref({});
const imageUrl = ref()
const imageViewerRef = ref();

const showPreview = (data) => {
  fileInfo.value = data;
  if (data.fileType == 3) {//预览图片
    imageUrl.value = API.getFile + data.fileId;
    nextTick(() => {
      imageViewerRef.value.show(0);
    });
  } else {//预览其它文件（包括视频)
    windowShow.value = true;//打开window
    let _url = API.getFile;
    if (data.fileType == 1) {
      _url = API.getVideo
    }
    _url = _url +  data.fileId;
    let _createDownloadUrl = API.createDownloadUrl + data.fileId;
    let _downloadUrl = API.download;

    url.value = _url;
    createDownloadUrl.value = _createDownloadUrl;
    downloadUrl.value = _downloadUrl;
  }
};
defineExpose({ showPreview });
</script>

<style lang="scss">
</style>