import { logger } from "@/libs/utils";
import { Component, PropsWithChildren, ReactNode } from "react";

/*
  使用注意：
    1、使用的时候，如果直接下边的元素报错，无法捕获，如果， TypeView内部的元素报错，才能够捕获到。
    <ErrorBoundary>
      <TypeView s={throw new Error}></TypeView>
    </ErrorBoundary>
*/
export class ErrorBoundary extends Component<
  PropsWithChildren<{
    fallbackNode: ReactNode;
  }>
> {
  state = {
    hasError: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }
  static getDerivedStateFromError(error) {
    logger.error("ErrorBoundary", error);
    return {
      hasError: true,
    };
  }
  render() {
    if (this.state.hasError) {
      return <>{this.props.fallbackNode}</>;
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
