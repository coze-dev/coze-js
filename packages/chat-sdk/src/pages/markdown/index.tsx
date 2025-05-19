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

const isSmooth = false;
export default function Index() {
  const [content, setContent] = useState(!isSmooth ? markdown : '');

  useEffect(() => {
    if (!isSmooth) {
      return;
    }
    streamOutput(setContent);
  }, []);

  return (
    <View className="light">
      <MdStream
        isSmooth={isSmooth}
        //isFinish={content.length === markdown.length}
        enableCodeBy4Space={false}
        markdown={content}
        enableHtmlTags={true}
        imgClassName={'img-class2'}
        imgStyle={{
          width: '100%',
          maxWidth: '100%',
        }}
        onTaskChange={value => {
          console.log({ value });
        }}
        eventCallbacks={{
          /*onLinkClick: (e, { url }) => {
            console.log({ url });
          },*/
          onImageClick: ({ url }) => {
            console.log({ url });
          },
        }}
      />
    </View>
  );
}
