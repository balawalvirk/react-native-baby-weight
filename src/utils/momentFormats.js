import moment from 'moment';

export const mFormat = (date) => `${moment(date).format('MMMM Do YYYY, ')} \n ${moment(date).format('h:mm:ss a')}`;
