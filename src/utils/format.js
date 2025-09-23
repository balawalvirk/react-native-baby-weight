export const displayCurrency = (n) => `€${n.toString()}`;

export const displayPercentage = (n) => parseFloat((n * 100).toFixed(2));

export const displayDate = (d) => {
  const date = new Date(d);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
export const displayTime = (d) => {
  const date = new Date(d);
  const hours = date.getHours();
  const minutes = date.getMinutes() + 1;
  return `${hours}:${minutes}`;
};
export const displayShortDate = (d) => {
  const date = new Date(d);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${day}/${month}`;
};
export const displayLongDate = (d) => new Date(d).toDateString();
