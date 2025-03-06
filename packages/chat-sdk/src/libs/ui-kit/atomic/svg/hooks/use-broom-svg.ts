import { useMemo } from 'react';

import { getSvgBase64 } from '@/libs/utils';

import { type SvgProps, type SvgStyles } from '../type';

const svgStyleMap: Record<string, SvgStyles> = {
  dark: {
    fill: '#060709',
    fillOpacity: '0.8',
  },
  light: {
    fill: '#FFF',
    fillOpacity: '1.0',
  },
};
const getSvgRaw = (
  color: SvgStyles,
) => `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
<path d="M7.50033 1.66667V5L3.33366 5C2.41318 5 1.66699 5.74619 1.66699 6.66667V17.5C1.66699 18.4205 2.41318 19.1667 3.33366 19.1667H16.667C17.5875 19.1667 18.3337 18.4205 18.3337 17.5V6.66667C18.3337 5.74619 17.5875 5 16.667 5L12.5003 5V1.66667C12.5003 0.746192 11.7541 0 10.8337 0H9.16699C8.24652 0 7.50033 0.746192 7.50033 1.66667ZM10.8337 1.66667V6.66667H16.667V10H3.33366V6.66667H9.16699V1.66667H10.8337ZM3.33366 11.6667H16.667V17.5H7.50033V15C7.50033 14.5398 7.12723 14.1667 6.66699 14.1667C6.20676 14.1667 5.83366 14.5398 5.83366 15V17.5H3.33366L3.33366 11.6667Z"  fill="${color.fill}" fill-opacity="${color.fillOpacity}"/>
</svg>`;

export const useBroomSvg = (props: SvgProps) => {
  const color = props.theme === 'light' ? svgStyleMap.light : svgStyleMap.dark;
  const svgData = useMemo(() => getSvgBase64(getSvgRaw(color)), [color]);
  return svgData;
};
