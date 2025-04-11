import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

export const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatDate = (created_at) => {
    return dayjs(created_at).format("YYYY-MM-DD (dddd) | HH:mm:ss").replace("요일", "");
};

export const simpleFormatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};
