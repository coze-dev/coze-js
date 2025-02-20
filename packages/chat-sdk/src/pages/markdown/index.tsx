import { useEffect, useState } from 'react';

import { View } from '@tarojs/components';

import { MdStream } from '@/exports';

import { markdown } from './const';

const streamOutput = (onChange: (content: string) => void) => {
  let index = 10;
  const timer = setInterval(() => {
    const content = markdown.slice(0, index);
    index += 10;
    onChange(content);
    if (content.length >= markdown.length) {
      clearInterval(timer);
    }
  }, 150);
};

export default function Index() {
  const [content, setContent] = useState('');

  useEffect(() => {
    streamOutput(setContent);
  }, []);

  return (
    <View className="light">
      <MdStream
        isSmooth
        isFinish={content.length === markdown.length}
        enableCodeBy4Space={false}
        markdown={content}
        enableHtmlTags={true}
      />
    </View>
  );
}
