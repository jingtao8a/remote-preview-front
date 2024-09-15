import { Message } from 'tdesign-mobile-vue';

const showMessage = (theme, content = '这是一条普通通知信息', duration = 5000) => {
    if (Message[theme]) {
      Message[theme]({
        offset: [10, 16],
        content,
        duration,
        icon: true,
        zIndex: 20000,
        // context: document.querySelector('.button-demo'),
      });
    }
  };
  

  export default {
    info: (content) => { showMessage("info", content) },
    success: (content) => { showMessage("success", content)},
    warning: (content) => { showMessage("warning", content)},
    error: (content) => { showMessage("error", content) }
  }