import { UIEventType } from "@/libs/types";
import { usePersistCallback, useUpdateEffect } from "@/libs/hooks";
import { getBoundingRect, isWeb, logger } from "@/libs/utils";
import { ITouchEvent } from "@tarojs/components";
import { TaroStatic } from "@tarojs/taro";
import { useEffect, useRef, useState } from "react";

interface BoundingRect {
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface EventProps {
  clientX: number;
  clientY: number;
}
interface Props {
  onTouching?: (type?: InputTriggerType) => void;
  onOutside?: (isOutside: boolean) => void;
  onEnd?: () => void;
  frameEventTarget?: InstanceType<TaroStatic["Events"]>; // 用于监听chat组件的keydown方法
  isPcMode?: boolean;
  disabled?: boolean;
}
export type InputTriggerType = "touch" | "keyboard" | "mouse";
export const useAudioRecord = ({
  onTouching,
  onOutside,
  onEnd,
  frameEventTarget,
  isPcMode,
  disabled,
}: Props) => {
  const refAudioInput = useRef<HTMLDivElement | null>(null);
  const [isTouching, setIsTouching] = useState(false);
  const [isOutside, setIsOutside] = useState(false);
  const refAudioInputBounding = useRef<BoundingRect>();
  const triggerFromRef = useRef<InputTriggerType>();

  const onOutsideChange = usePersistCallback((isOutside: boolean) => {
    setIsOutside(isOutside);
    onOutside?.(isOutside);
  });
  const onStartAudioInput = usePersistCallback(async (event?: ITouchEvent) => {
    setIsTouching(true);
    setIsOutside(false);
    if (isWeb) {
      const boundingRect = refAudioInput.current?.getBoundingClientRect();
      if (boundingRect) {
        refAudioInputBounding.current = boundingRect;
      }
    } else if (event) {
      const [boundingRect] = await getBoundingRect(
        `#${event.currentTarget.id}`
      );
      if (boundingRect) {
        refAudioInputBounding.current = boundingRect;
      }
    }
  });

  const checkIsOutside = usePersistCallback((event: EventProps) => {
    const { clientY } = event;
    const { top } = refAudioInputBounding.current || {};

    let isOutside = false;
    if (top !== undefined && clientY < top) {
      isOutside = true;
    }
    return isOutside;
  });
  const checkAndSetIsOutside = usePersistCallback((event: EventProps) => {
    const isOutside = checkIsOutside(event);
    onOutsideChange(isOutside);
    return isOutside;
  });

  /** Start Mouse Event Handler On Mobile */
  const onTouchStart = usePersistCallback((event: ITouchEvent) => {
    logger.debug("[useAudioRecord]onTouchStart", event);

    if (triggerFromRef.current || disabled) {
      return;
    }
    triggerFromRef.current = "touch";
    onStartAudioInput(event);
  });
  const onTouchMove = usePersistCallback((event: ITouchEvent) => {
    logger.debug("[useAudioRecord]onTouchMove", event);
    if (triggerFromRef.current !== "touch" || disabled) {
      return;
    }
    if (isTouching) {
      checkAndSetIsOutside({
        clientX: event.changedTouches[0].clientX,
        clientY: event.changedTouches[0].clientY,
      });
    }
  });
  const onTouchEnd = usePersistCallback(() => {
    logger.debug(
      "[useAudioRecord]onTouchEnd",
      triggerFromRef.current,
      isTouching
    );
    if (triggerFromRef.current !== "touch" || disabled) {
      return;
    }
    if (isTouching) {
      setIsTouching(false);
    }
  });
  const onTouchCancel = usePersistCallback((event: ITouchEvent) => {
    logger.debug("[useAudioRecord]onTouchCancel", event);
    setIsTouching(false);
    setIsOutside(false);
  });
  /** End Mouse Event Handler On Mobile */

  /** Start Mouse Event Handler On Pc */
  const onMouseDown = usePersistCallback((event: MouseEvent) => {
    logger.debug("onMouseDown", event);
    event?.stopPropagation();
    if (triggerFromRef.current || disabled) {
      return;
    }
    triggerFromRef.current = "mouse";
    onStartAudioInput();
  });
  const onMouseMove = usePersistCallback((event: MouseEvent) => {
    if (triggerFromRef.current !== "mouse" || disabled) {
      return;
    }
    if (isTouching) {
      checkAndSetIsOutside({
        clientX: event.clientX,
        clientY: event.clientY,
      });
    }
  });
  const onMouseUp = usePersistCallback((event: MouseEvent) => {
    logger.info("onMouseDown 222", event, isTouching);
    if (triggerFromRef.current !== "mouse" || disabled) {
      return;
    }
    if (isTouching) {
      setIsTouching(false);
    }
  });

  const onKeyDown = usePersistCallback((event: { code: string }) => {
    logger.debug("[audio] onKeyDown", event);
    if (event.code === "Space") {
      if (triggerFromRef.current || disabled) {
        return;
      }
      triggerFromRef.current = "keyboard";
      setIsTouching(true);
      setIsOutside(false);
    }
  });
  const onKeyUp = usePersistCallback((event: { code: string }) => {
    logger.debug("[audio] onKeyUp", event);
    if (disabled) {
      return;
    }
    if (event.code === "Space") {
      if (triggerFromRef.current !== "keyboard") {
        return;
      }
      if (isTouching) {
        setIsTouching(false);
      }
    }
  });

  const onInitRefForAudioRecord = usePersistCallback((el) => {
    if (isWeb) {
      // If the element has been set, remove the event listener first
      if (refAudioInput.current) {
        refAudioInput.current.removeEventListener("mousedown", onMouseDown);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        if (isPcMode && frameEventTarget) {
          frameEventTarget.on(UIEventType.KeyDown, onKeyDown);
          frameEventTarget.on(UIEventType.KeyUp, onKeyUp);
        }
      }
      // Set the new element, and add the event listener
      if (el) {
        refAudioInput.current = el as HTMLDivElement;
        refAudioInput.current.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        if (isPcMode && frameEventTarget) {
          frameEventTarget.on(UIEventType.KeyDown, onKeyDown);
          frameEventTarget.on(UIEventType.KeyUp, onKeyUp);
        }
      }
    } else {
      refAudioInput.current = el;
    }
  });

  useEffect(() => {
    return () => {
      if (isWeb) {
        refAudioInput.current?.removeEventListener("mousedown", onMouseDown);
        document?.removeEventListener("mousemove", onMouseMove);
        document?.removeEventListener("mouseup", onMouseUp);
        if (frameEventTarget) {
          frameEventTarget.off(UIEventType.KeyDown, onKeyDown);
          frameEventTarget.off(UIEventType.KeyDown, onKeyUp);
        }
      }
    };
  }, []);
  /** End Mouse Event Handler On Pc */

  useUpdateEffect(() => {
    logger.debug("[useAudioRecord]isTouching", isTouching);

    if (isTouching) {
      onTouching?.(triggerFromRef.current);
    }
  }, [isTouching]);

  useUpdateEffect(() => {
    onOutside?.(isOutside);
  }, [isOutside]);

  useUpdateEffect(() => {
    logger.info("[useAudioRecord]onEnd", isTouching);
    if (!isTouching) {
      triggerFromRef.current = undefined;
      onEnd?.();
    }
  }, [isTouching]);
  useUpdateEffect(() => {
    if (isTouching) {
      setIsTouching(false);
    }
    /*if (isOutside) {
      setIsOutside(false);
    }*/
  }, [disabled]);

  return {
    onInitRefForAudioRecord,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
    isTouching,
    isOutside,
  };
};
