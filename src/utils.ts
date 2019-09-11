export const pad = (num: number | string, size: number): string => {
  const s = '000000000' + num;
  return s.substr(s.length - size);
};

export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
