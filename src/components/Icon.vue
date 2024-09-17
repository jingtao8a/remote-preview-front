<template>
    <span :style="{ width: width + 'vw', height: width + 'vw' }" class="icon">
      <img :src="getImage()" :style="{ 'object-fit': fit }" />
    </span>
  </template>
  
  <script setup>
  import API from '../js/API'
  
  const props = defineProps({
    fileType: {
      type: Number,
    },
    iconName: {
      type: String,
    },
    cover: {
      type: String,
    },
    width: {
      type: Number,
      default: 20,
    },
    fit: {
      type: String,
      default: "cover",
    },
  });
  
  const fileTypeMap = {
    0: { desc: "目录", icon: "folder" },
    1: { desc: "视频", icon: "video" },
    2: { desc: "音频", icon: "music" },
    3: { desc: "图片", icon: "image" },
    4: { desc: "exe", icon: "pdf" },
    5: { desc: "doc", icon: "word" },
    6: { desc: "excel", icon: "excel" },
    7: { desc: "纯文本", icon: "txt" },
    8: { desc: "程序", icon: "code" },
    9: { desc: "压缩包", icon: "zip" },
    10: { desc: "其他文件", icon: "others" },
  };
  
  const getImage = () => {
    if (props.cover) {
      return API.getCover + props.cover;
    }
    let icon = "unknow_icon";
    if (props.iconName) {
      icon = props.iconName;
    } else {
      const iconMap = fileTypeMap[props.fileType];
      if (iconMap != undefined) {
        icon = iconMap["icon"];
      }
    }
    return new URL(`/src/assets/icon-image/${icon}.png`, import.meta.url).href;
  };
  </script>
  
  <style lang="scss" scoped>
  .icon {
    padding-top: 0;
    text-align: center;
    display: inline-block;
    border-radius: 3vw;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  </style>