import { FC, ReactNode, useEffect, useMemo, useState } from 'react';

import type { List as ListMdType, ListItem as ListMdItem } from 'mdast';
import cls from 'classnames';
import { isBoolean } from '@tarojs/shared';
import { Text, View } from '@tarojs/components';

import { Spacing } from '@/libs/ui-kit/atomic/spacing';
import { Radio } from '@/libs/ui-kit/atomic/radio';
import { Checkbox } from '@/libs/ui-kit/atomic/check-box';
import { CenterAlignedBox } from '@/libs/ui-kit/atomic/center-aligned-box';
import { usePersistCallback } from '@/libs/hooks';

import { ListItem } from '../list-item';
import { getTextFromParagraph } from '../../../helper/get-text-from-paragraph';
import {
  useMdStreamLogger,
  useMdStreamTaskChangeHandle,
  useMdStreamTaskDisabled,
} from '../../../context';

import styles from './index.module.less';

let listNo = 1000;

interface TaskBoxInfo {
  checkbox?: boolean; // Whether the item is a checkbox item (when `boolean`).
  radio?: boolean; // Whether the item is a radio item (when `boolean`).
  checked?: boolean; // Whether the item is a checked item (when `boolean`).
  value?: string; // The task's value
  id: string; // Tha task's Id
}

interface FormatNodeChildren {
  isTask: boolean; // Whether the item is a tasklist item (when `boolean`).
  node: ListMdItem; // List Item's Node
  isOrder: boolean; // Whether the list is ordered
  orderNo: number; // The order's No
  taskInfo: TaskBoxInfo; // The taskInfo (when isTask is true)
}

export const List: FC<{
  node: ListMdType;
}> = ({ node }) => {
  const listNoId = useMemo(() => listNo++, []);
  const formatItems = useFormatNodeChildren(node, listNoId);
  const logger = useMdStreamLogger();
  const taskDisabled = useMdStreamTaskDisabled();
  const onTaskChangeHandle = useMdStreamTaskChangeHandle();
  const [listItems, setListItems] = useState<Array<FormatNodeChildren>>([]);
  useEffect(() => {
    setListItems(formatItems);
  }, [formatItems]);
  const onTaskChange = usePersistCallback(
    (isChecked: boolean, taskInfo: TaskBoxInfo) => {
      listItems.map(item => {
        if (isChecked) {
          if (taskInfo.radio) {
            // If the changed task is radio,then set property 'checked'  false;
            if (item.taskInfo.radio) {
              item.taskInfo.checked = false;
            }
          }
        }
        if (taskInfo.id === item.taskInfo.id) {
          item.taskInfo.checked = isChecked;
        }
      });
      setListItems([...listItems]);
    },
  );
  useEffect(() => {
    const isTaskList = listItems.some(item => item.isTask);
    if (isTaskList && !taskDisabled) {
      const values = listItems
        .map(item => {
          if (item.taskInfo.checked && item.taskInfo.value) {
            return item.taskInfo.value;
          }
          return '';
        })
        .filter(item => !!item);
      onTaskChangeHandle?.({
        id: `task_list_${listNoId}`,
        index: listNoId,
        values,
      });
      logger?.debug('taskChange:', values, listNoId);
    }
  }, [listItems, taskDisabled]);

  return (
    <View className={styles.list}>
      {listItems.map((item, index) => (
        <ListItemWrapper
          listItemInfo={item}
          key={index}
          onChange={onTaskChange}
        >
          <View className={styles.content}>
            <ListItem node={item.node} />
          </View>
        </ListItemWrapper>
      ))}
    </View>
  );
};

const ListItemWrapper: FC<{
  listItemInfo: FormatNodeChildren;
  children: ReactNode;
  onChange?: (isChecked: boolean, taskInfo: TaskBoxInfo) => void;
}> = ({ listItemInfo, children, onChange }) => (
  <>
    {listItemInfo.isTask ? (
      <ListTaskWrapper nodeInfo={listItemInfo} onChange={onChange}>
        {children}
      </ListTaskWrapper>
    ) : (
      <Spacing
        className={cls(styles['list-item'], {
          [styles['order-list']]: listItemInfo.isOrder,
        })}
        gap={6}
        width100
      >
        <CenterAlignedBox width={21} height={22}>
          {listItemInfo.isOrder ? (
            <Text>{listItemInfo.orderNo}.</Text>
          ) : (
            <View className={styles.dot} />
          )}
        </CenterAlignedBox>
        <View
          style={{
            flex: 1,
          }}
        >
          {children}
        </View>
      </Spacing>
    )}
  </>
);

const ListTaskWrapper: FC<{
  nodeInfo: FormatNodeChildren;
  children: ReactNode;
  onChange?: (isChecked: boolean, taskInfo: TaskBoxInfo) => void;
}> = ({ nodeInfo, children, onChange }) => {
  const onChangeHandle = usePersistCallback((isChecked: boolean) => {
    onChange?.(isChecked, nodeInfo.taskInfo);
  });
  const taskDisabled = useMdStreamTaskDisabled();
  return (
    <>
      {nodeInfo.taskInfo.radio ? (
        <Radio
          checked={nodeInfo.taskInfo.checked}
          className={styles['task-item']}
          onChange={onChangeHandle}
          disabled={taskDisabled}
        >
          {children}
        </Radio>
      ) : (
        <Checkbox
          checked={nodeInfo.taskInfo.checked}
          className={styles['task-item']}
          onChange={onChangeHandle}
          disabled={taskDisabled}
        >
          {children}
        </Checkbox>
      )}
    </>
  );
};

const useFormatNodeChildren = (node: ListMdType, listNoId: number) => {
  let isForbidChecked = false;
  const nodeChildren: Array<FormatNodeChildren> = useMemo(
    () =>
      node.children.map((item, index) => {
        const listItemData = (item.data || {}) as unknown as {
          radio?: boolean;
          checked?: boolean;
          value?: string;
        };
        const selectData: TaskBoxInfo = {
          id: `list_prefix_${listNoId}_${index}`,
          checkbox: isBoolean(item.checked),
          radio: !!listItemData.radio,
          checked: item.checked ?? listItemData.checked,
          value: '',
        };
        const isTask = !!(selectData.checkbox || selectData.radio);
        selectData.value = isTask
          ? (() => {
              // We just extract text from first paragraph.This is already agreed upon in advance
              if (item.children?.[0].type === 'paragraph') {
                return getTextFromParagraph(item.children?.[0]);
              } else {
                return '';
              }
            })()
          : '';

        // Radio component only the first can be set to "checked"
        if (selectData.radio && selectData.checked) {
          if (isForbidChecked) {
            selectData.checked = false;
          }
          isForbidChecked = true;
        }

        return {
          isTask,
          node: item,
          isOrder: !!node.ordered,
          orderNo: index + 1,
          taskInfo: selectData,
        };
      }),
    [node],
  );
  return nodeChildren;
};
