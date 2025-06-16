import { FC, memo } from 'react';

import xss from 'xss';
import type { Html as HtmlMdType, Text as TextMdType } from 'mdast';
import { RichText } from '@tarojs/components';

import { Text } from '../text';
import { useMdStreamEnableHtmlTags } from '../../../context';

export const Html: FC<{
  node: HtmlMdType;
}> = memo(({ node }) => {
  const enableHtmlTags = useMdStreamEnableHtmlTags();
  return (
    <>
      {enableHtmlTags ? (
        <RichText nodes={`${xss(node.value)}`} />
      ) : (
        <Text node={node as unknown as TextMdType} />
      )}
    </>
  );
});
