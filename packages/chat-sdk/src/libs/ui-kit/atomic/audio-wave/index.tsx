import cls from "classnames";
import { View } from "@tarojs/components";

import styles from "./index.module.less";
import { Spacing } from "../spacing";

interface AudioWaveProps {
  size: "small" | "medium" | "large";
  type: "default" | "primary" | "warning";
  volumeNumber: number; // 0 ~ 100
  className?: string;
}

const waveBarNumberMap = {
  large: 41,
  medium: 29,
  small: 4,
};
export const AudioWave = ({
  size = "medium",
  volumeNumber = 0,
  type = "default",
  className,
}: AudioWaveProps) => {
  const volumeRealNumber = Math.max(Math.min(volumeNumber, 100), 0);
  const waveBarNumber = waveBarNumberMap[size] || 29;
  const waveBarHeights = getBarHeights(waveBarNumber, volumeRealNumber);
  return (
    <Spacing
      gap={3}
      verticalCenter
      horizontalCenter
      width100
      className={cls(styles.container, className)}
    >
      {waveBarHeights.map((height, index) => (
        <View
          className={cls(
            styles[`audio-wave-${index}`],
            styles[type],
            styles["bar"],
            styles[size]
          )}
          style={{
            backgroundColor: getBarBgColor(index, waveBarNumber, type),
            height: height,
          }}
          key={`${type}_${index}`}
        />
      ))}
    </Spacing>
  );
};

function getBarHeights(waveBarNumber, volumeRealNumber) {
  if (volumeRealNumber <= 0) {
    return new Array(waveBarNumber).fill(12);
  }
  const waveBarHeights = new Array(waveBarNumber)
    .fill(0)
    .map((_item, index) => {
      return getBarHeight(index, waveBarNumber, volumeRealNumber);
    });
  const minHeight = Math.min(...waveBarHeights);
  const maxHeight = Math.max(...waveBarHeights);
  const heightSpan = maxHeight - minHeight;
  return waveBarHeights.map((item) => {
    return (
      12 +
      ((item - minHeight) / (maxHeight - minHeight)) * Math.min(12, heightSpan)
    );
  });
}

function getBarHeight(index, maxNumber, volumeNumber) {
  const percent = index / maxNumber;
  const maxHeight = 20;
  let baseHeight = 2;
  let randomMin = -2;
  let randomMax = 2;
  if (percent < 1 / 6) {
    baseHeight = 1 + (4 - 1) * percent * 6;
    randomMin = 0.1 + (-0.8 - 0.1) * percent * 6;
    randomMax = 0.3 + (0.6 - 0.3) * percent * 6;
  } else if (percent < 2 / 6) {
    baseHeight = 4 + (2 - 4) * (percent - 1 / 6) * 6;
    randomMin = -0.8 + (-0.0 + 0.8) * (percent - 1 / 6) * 6;
    randomMax = 0.6 + (0.6 - 0.6) * (percent - 1 / 6) * 6;
  } else if (percent < 3 / 6) {
    baseHeight = 2 + (8 - 2) * (percent - 2 / 6) * 6;
    randomMin = 0.0 + (-1.6 - 0.0) * (percent - 2 / 6) * 6;
    randomMax = 0.6 + (1.2 - 0.6) * (percent - 2 / 6) * 6;
  } else if (percent < 4 / 6) {
    baseHeight = 8 + (2 - 8) * (percent - 3 / 6) * 6;
    randomMin = -1.6 + (0.0 + 1.6) * (percent - 3 / 6) * 6;
    randomMax = 1.2 + (0.6 - 1.2) * (percent - 3 / 6) * 6;
  } else if (percent < 5 / 6) {
    baseHeight = 2 + (4 - 2) * (percent - 4 / 6) * 6;
    randomMin = 0.0 + (-0.8 - 0.0) * (percent - 4 / 6) * 6;
    randomMax = 0.6 + (0.6 - 0.6) * (percent - 4 / 6) * 6;
  } else if (percent < 1) {
    baseHeight = 4 + (1 - 4) * (percent - 5 / 6) * 6;
    randomMin = -0.8 + (0.1 + 0.8) * (percent - 5 / 6) * 6;
    randomMax = 0.1 + (0.3 - 0.6) * (percent - 5 / 6) * 6;
  }
  const height =
    baseHeight +
    volumeNumber *
      (Math.random() * (randomMax - randomMin) + randomMin) *
      (maxHeight - baseHeight);
  return height;
}
function getBarBgColor(index, maxNumber, type) {
  let bgColor = "#FFF";
  switch (type) {
    case "primary":
      {
        /*
         * implement : fill: linear-gradient(90deg, rgba(83, 71, 255, 0.20) 0%, #5347FF 20%, #B125F1 80%, rgba(177, 37, 241, 0.20) 100%);
         */
        let opacity = 0;
        let rColor = 0;
        let gColor = 0;
        let bColor = 0;
        const percent = index / maxNumber;
        if (percent < 0.2) {
          opacity = 0.2 + ((1 - 0.2) * percent) / 0.2;
          rColor = 83;
          gColor = 71;
          bColor = 255;
        } else if (percent < 0.8) {
          opacity = 1;
          rColor = Math.round(83 + ((177 - 83) * (percent - 0.2)) / 0.6);
          gColor = Math.round(71 + ((37 - 71) * (percent - 0.2)) / 0.6);
          bColor = Math.round(255 + ((241 - 255) * (percent - 0.2)) / 0.6);
        } else {
          opacity = 1 - ((1 - 0.2) * (percent - 0.8)) / 0.2;
          rColor = 177;
          gColor = 37;
          bColor = 241;
        }
        bgColor = `rgba(${rColor}, ${gColor}, ${bColor}, ${opacity.toFixed(
          2
        )})`;
      }
      break;
    case "warning":
      {
        bgColor = "#FF0030";
      }
      break;
    default:
      {
        /*
         * implement : fill: linear-gradient(90deg, rgba(255, 255, 255, 0.20) 0%, #FFF 20%, rgba(255, 255, 255, 0.90) 80%, rgba(255, 255, 255, 0.20) 100%);
         */
        let opacity = 0;
        const percent = index / maxNumber;
        if (percent < 0.2) {
          opacity = 0.2 + ((1 - 0.2) * percent) / 0.2;
        } else if (percent < 0.8) {
          opacity = 1 - ((1 - 0.9) * (percent - 0.2)) / 0.6;
        } else {
          opacity = 0.9 - ((0.9 - 0.2) * (percent - 0.8)) / 0.2;
        }
        bgColor = `rgba(255, 255, 255, ${opacity.toFixed(2)})`;
      }
      break;
  }
  return bgColor;
}
