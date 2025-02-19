import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ChatFlowFramework } from "../../src/chatflow/index";
import { logger } from "../../src/libs/utils";
import * as useInitChatHook from "../../src/chatflow/hooks/use-init-chat";
import { useConversationStore } from "../../src/libs";

// Mock 依赖
vi.mock("@/libs/utils", () => ({
  logger: {
    setLoglevel: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock("@/libs", () => ({
  useConversationStore: vi.fn(),
  ChatFramework: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="chat-framework">{children}</div>
  ),
  ChatSlot: () => <div data-testid="chat-slot" />,
}));

vi.mock("@/libs/hooks", () => ({
  useUpdateEffect: (callback: () => void, deps: any[]) => {
    React.useEffect(callback, deps);
  },
}));

vi.mock("@/libs/ui-kit", () => ({
  CenterAlignedBox: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="center-box">{children}</div>
  ),
  Spinning: () => <div data-testid="spinning" />,
}));

vi.mock("@/chatflow/hooks/use-init-chat", () => ({
  useInitChat: vi.fn(),
}));

describe("ChatFlowFramework", () => {
  const mockProps = {
    auth: {
      type: "token",
      token: "test-token-12345",
    },
    setting: {
      logLevel: "info",
    },
    project: {
      mode: "websdk",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("应该在未准备好时显示加载状态", () => {
    vi.spyOn(useInitChatHook, "useInitChat").mockReturnValue({
      chatProps: null,
      hasReady: false,
    });

    render(<ChatFlowFramework {...mockProps} />);

    expect(screen.getByTestId("center-box")).toBeInTheDocument();
    expect(screen.getByTestId("spinning")).toBeInTheDocument();
  });

  it("应该在准备好后渲染聊天框架", () => {
    vi.spyOn(useInitChatHook, "useInitChat").mockReturnValue({
      chatProps: {
        auth: { token: "test-token" },
      },
      hasReady: true,
    });

    render(<ChatFlowFramework {...mockProps} />);

    expect(screen.getByTestId("chat-framework")).toBeInTheDocument();
  });

  it("应该使用自定义加载组件", () => {
    vi.spyOn(useInitChatHook, "useInitChat").mockReturnValue({
      chatProps: null,
      hasReady: false,
    });

    const CustomLoading = () => (
      <div data-testid="custom-loading">Loading...</div>
    );

    render(
      <ChatFlowFramework
        {...mockProps}
        areaUi={{ renderLoading: () => <CustomLoading /> }}
      />
    );

    expect(screen.getByTestId("custom-loading")).toBeInTheDocument();
    expect(screen.queryByTestId("spinning")).not.toBeInTheDocument();
  });

  it("应该正确处理 executeId 回调", async () => {
    const mockExecuteId = "test-execute-id";
    const onGetChatFlowExecuteId = vi.fn();

    (useConversationStore as any).mockImplementation((selector) =>
      selector({
        inProcessChatMessageGroup: {
          query: {
            extData: {
              executeId: mockExecuteId,
            },
          },
        },
      })
    );

    vi.spyOn(useInitChatHook, "useInitChat").mockReturnValue({
      chatProps: {
        auth: { token: "test-token" },
      },
      hasReady: true,
    });

    render(
      <ChatFlowFramework
        {...mockProps}
        eventCallbacks={{ onGetChatFlowExecuteId }}
        workflow={{}}
        userInfo={{}}
        areaUi={{}}
      />
    );

    await vi.waitFor(() => {
      expect(onGetChatFlowExecuteId).toHaveBeenCalledWith(mockExecuteId);
    });
  });

  it("应该正确设置日志级别", () => {
    vi.spyOn(useInitChatHook, "useInitChat").mockReturnValue({
      chatProps: {
        auth: { token: "test-token" },
      },
      hasReady: true,
    });

    render(<ChatFlowFramework {...mockProps} />);

    expect(logger.setLoglevel).toHaveBeenCalledWith("info");
  });
});
