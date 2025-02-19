import { useCallback, useState } from "react";

export const useHelperButton = (isShowHelper?: boolean) => {
  const [arrowDownVisible, setArrowDownVisible] = useState(false);

  const checkArrowDownVisible = useCallback(
    (scrollTop: number) => {
      if (!isShowHelper) {
        return;
      }
      if (scrollTop > 500) {
        setArrowDownVisible(true);
      } else {
        setArrowDownVisible(false);
      }
    },
    [isShowHelper]
  );
  return {
    arrowDownVisible,
    setArrowDownVisible,
    checkArrowDownVisible,
  };
};
