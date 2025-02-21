const isBuildNative = process.env.BUILD_NATIVE === 'true';
const isWeapp = process.env.TARO_ENV === 'weapp';

export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/chatflow/index',

    'pages/markdown/index',
    'pages/ui/index',
    'pages/chat/index',
  ],
  components:
    isBuildNative && isWeapp
      ? ['exports/weapp/chat-framework/index']
      : ['exports/index'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  permission: {
    'scope.album': {
      desc: '用于从相册选择图片，为用户提供[具体功能说明]服务',
    },
    'scope.camera': {
      desc: '用于拍照获取图片，为用户提供[具体功能说明]服务',
    },
    'scope.record': {
      desc: '用于录制音频，为用户提供[具体功能说明]服务',
    },
  },
});
