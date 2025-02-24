import React from 'react';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';

import Index from '@/pages/index2/index';

// 模拟 utils
vi.mock('@/libs/utils', () => ({
  isWeb: true,
}));

describe('Index 组件', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('应该正确渲染基础组件结构', () => {
    render(<Index />);

    // 验证 iframe 是否存在且属性正确
    const iframe = document.querySelector('iframe');
    expect(iframe).toBeDefined();
    expect(iframe?.getAttribute('src')).toBe(
      'https://www.coze.cn/#/pages/chatflow/index',
    );
    expect(iframe?.getAttribute('width')).toBe('100%');
    expect(iframe?.getAttribute('height')).toBe('100%');
  });

  it('应该在3秒后添加键盘事件监听器', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    const consoleSpy = vi.spyOn(console, 'log');

    render(<Index />);

    // 快进3秒
    vi.advanceTimersByTime(3000);

    // 验证事件监听器是否被添加
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );

    // 验证 console.log 调用
    expect(consoleSpy).toHaveBeenCalledWith('keydown focus');
    expect(consoleSpy).toHaveBeenCalledWith('keydown 2344');

    // 清理
    addEventListenerSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});
