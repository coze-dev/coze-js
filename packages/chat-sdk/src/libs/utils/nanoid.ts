let id = Date.now() + 100000 * Math.random();
export const nanoid = () => `${id++}`;
