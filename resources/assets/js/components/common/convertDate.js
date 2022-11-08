import moment from "moment";

const convertDate = date => {
  return moment(date).format("MM/DD/YYYY h:mm A");
};

export { convertDate };
