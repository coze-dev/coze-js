import { getBoundingRect, isWeb } from "@/libs/utils";
import { useEffect, useState } from "react";
import { usePersistCallback } from "./use-persist-callback";
type Size = { width: number; height: number };

export const useSize = (id: string) => {
  const [size, setState] = useState<Size>(() => {
    return {
      width: 0,
      height: 0,
    };
  });
  const reInitSize = usePersistCallback(() => {
    if (isWeb) {
      const el = document.getElementById(id);
      if (el) {
        return {
          width: el.clientWidth,
          height: el.clientHeight,
        };
      }
    } else {
      getBoundingRect(`#${id}`).then((res) => {
        if (res?.[0]?.width) {
          setState({
            width: res[0].width,
            height: res[0].height,
          });
        }
      });
    }
  });
  useEffect(() => {
    reInitSize();
  }, [id]);

  useEffect(() => {
    //网页监听变化
    if (!isWeb) {
      return;
    }
    const el = document.getElementById(id);
    if (!el) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { clientWidth, clientHeight } = entry.target;
        setState({ width: clientWidth, height: clientHeight });
      });
    });
    resizeObserver.observe(el);
    return () => {
      resizeObserver.disconnect();
    };
  }, [id]);
  return { ...size, reInitSize };
};
