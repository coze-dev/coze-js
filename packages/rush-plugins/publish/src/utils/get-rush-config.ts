import { RushConfiguration } from '@rushstack/rush-sdk';

export const getRushConfiguration = (() => {
  let rushConfiguration: RushConfiguration | null = null;
  return (useCache = true) => {
    if (!useCache) {
      rushConfiguration = null;
    }
    return (rushConfiguration ||= RushConfiguration.loadFromDefaultLocation({
      startingFolder: process.cwd(),
    }));
  };
})();
