<template>
  <view class="content">
    <!-- 添加摄像头和麦克风权限 -->
    <div v-if="showIframe" class="iframe-container">
      <iframe
        :src="webviewUrl"
        class="full-iframe"
        allow="camera; microphone; display-capture"
        allowfullscreen
      ></iframe>
    </div>
    <web-view
      v-else
      :src="webviewUrl"
      :webview-styles="webviewStyles"
    ></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      webviewUrl: 'https://www.coze.cn/open-platform/realtime/playground',
      webviewStyles: {
        progress: {
          color: '#FF3333',
        },
      },
      // 在H5环境使用iframe，其他环境使用web-view
      showIframe: false,
    };
  },
  created() {
    // 检测是否在H5环境，如果是则使用iframe
    // #ifdef H5
    this.showIframe = true;
    // #endif
  },
  onLoad() {
    // 页面加载时也请求一次权限，确保权限已获取
    // this.requestMicrophonePermission();
  },
  methods: {},
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
  margin: 30rpx 0;
}

.iframe-container {
  width: 100%;
  height: calc(100vh - 100rpx);
  overflow: hidden;
  padding: 0;
  margin: 0;
  display: flex;
}

.full-iframe {
  width: 100%;
  height: 100%;
  border: none;
  margin: 0;
  padding: 0;
  display: block;
  flex: 1;
}

.text-area {
  display: flex;
  justify-content: center;
}

web-view {
  width: 100%;
  height: calc(100vh - 100rpx);
}
</style>
