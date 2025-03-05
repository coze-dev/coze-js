let id = Date.now() + Math.ceil(100000 * Math.random());
export const nanoid = () => `${id++}`;
