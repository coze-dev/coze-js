import { ref } from 'vue';

import { cozeClient } from '../api/client';

const isH5 = process.env.VUE_APP_PLATFORM === 'h5';

export function useFileUpload() {
  const fileId = ref('');
  const imagePath = ref('');
  const isUploading = ref(false);

  const chooseImage = () => {
    if (isUploading.value) {
      return;
    }

    uni.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePath = res.tempFilePaths[0];
        const tempFile = (res.tempFiles as File[])[0];

        imagePath.value = tempFilePath;
        console.log('tempFilePath', tempFile, tempFilePath);
        uploadImage(isH5 ? tempFile : tempFilePath);
      },
    });
  };

  const uploadImage = async (filePath: string | File) => {
    if (!cozeClient) {
      return;
    }

    try {
      isUploading.value = true;

      const result = await cozeClient.files.upload({
        file: isH5 ? filePath : { filePath },
      });
      fileId.value = result.id;

      console.log('Upload success, file ID:', fileId.value);
    } catch (error) {
      console.error('Upload failed:', error);
      uni.showToast({
        title: 'Upload failed',
        icon: 'none',
      });
    } finally {
      isUploading.value = false;
    }
  };

  return {
    fileId,
    imagePath,
    isUploading,
    chooseImage,
  };
}
