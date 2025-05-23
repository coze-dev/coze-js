import { type IChatFlowProps } from '../type';

export const getConnectorId = (props: IChatFlowProps) => {
  const { project } = props;
  const { mode, connectorId } = project || {};
  if (connectorId) {
    return connectorId || '';
  }
  if (mode === 'websdk') {
    return '999';
  } else if (mode === 'draft') {
    return '10000010';
  }
};
