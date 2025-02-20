import { FC } from 'react';

import type { PhrasingContent } from 'mdast';

import { type IndicatorLocal } from '../../ast';
import { Text } from './text';
import { Strong } from './strong';
import { Link } from './link';
import { InlineCode } from './inline-code';
import { Indicator } from './indicator';
import { Image } from './image';
import { Html } from './html';
import { Emphasis } from './emphasis';
import { Delete } from './delete';
import { Break } from './break';
export const PhraseTypes = [
  'break',
  'delete',
  'emphasis',
  'footnoteReference',
  'html',
  'image',
  'imageReference',
  'inlineCode',
  'link',
  'linkReference',
  'strong',
  'text',
  'indicator',
];
export const Phrase: FC<{
  node: PhrasingContent | IndicatorLocal;
}> = ({ node }) => (
  <>
    {node.type === 'break' && <Break />}
    {node.type === 'delete' && <Delete node={node} />}
    {node.type === 'emphasis' && <Emphasis node={node} />}
    {node.type === 'footnoteReference' && null /* 不做处理，做一个标记*/}
    {node.type === 'html' && <Html node={node} />}
    {node.type === 'image' && <Image node={node} />}
    {node.type === 'imageReference' && null /* 不做处理，做一个标记*/}
    {node.type === 'inlineCode' && <InlineCode node={node} />}
    {node.type === 'link' && <Link node={node} />}
    {node.type === 'linkReference' && null /* 不做处理，做一个标记*/}
    {node.type === 'strong' && <Strong node={node} />}
    {node.type === 'text' && <Text node={node} />}
    {node.type === 'indicator' && <Indicator node={node} />}
  </>
);
