export const randomInteger = (min = 1, max = 100) => parseInt(Math.floor(Math.random() * max) + min);
export const randomDouble = (min = 1, max = 100, n = 2) => parseFloat((Math.random() * (max - min) + min).toFixed(n));
export const randomBoolean = () => Math.random() >= 0.5;
