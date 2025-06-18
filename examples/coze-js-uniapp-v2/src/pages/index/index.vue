<template>
  <view class="home-container">
    <view class="header">
      <image class="logo" src="/static/logo.png"></image>
      <text class="title">Coze.js UniApp 演示</text>
      <text class="subtitle">选择下方功能进行体验</text>
    </view>

    <view class="card-grid">
      <!-- #ifdef H5 -->
      <view class="card" @click="navigateTo('/pages/chat-h5/index')">
        <view class="card-content">
          <text class="card-title">实时语音聊天</text>
          <text class="card-description"
            >基于 WebSocket 的实时语音对话功能</text
          >
        </view>
        <text class="card-icon">🎤</text>
      </view>
      <!-- #endif -->

      <view class="card" @click="navigateTo('/pages/webview-test/index')">
        <view class="card-content">
          <text class="card-title">Webview 测试</text>
          <text class="card-description">Webview 测试页面</text>
        </view>
        <text class="card-icon">📄</text>
      </view>
    </view>

    <view class="footer">
      <text class="footer-text">Powered by Coze</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: 'Coze.js UniApp 演示'
    };
  },
  methods: {
    // 页面跳转方法
    navigateTo(url) {
      uni.navigateTo({
        url: url
      });
    }
  }
};
</script>

<style>
.home-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
  background-color: #f8f8f8;
}

.header {
  margin-bottom: 30px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  height: 120rpx;
  width: 120rpx;
  margin-bottom: 20rpx;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  display: block;
  color: #333;
}

.subtitle {
  font-size: 16px;
  color: #666;
  display: block;
}

.card-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.card:active {
  transform: scale(0.98);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  display: block;
  color: #333;
}

.card-description {
  font-size: 14px;
  color: #666;
  display: block;
}

.card-icon {
  font-size: 28px;
  margin-left: 15px;
}

.footer {
  margin-top: auto;
  padding: 20px 0;
  text-align: center;
}

.footer-text {
  font-size: 14px;
  color: #999;
}
</style>
