import { formatPrice } from "./utils/formatters.jsx";
import styles from "../../css/paymentHistoryItem.module.css";

export const PaymentHistoryItem = ({ payment, isLast }) => {
    return (
        <div
            className={`${styles.paymentHistoryItem} ${!isLast ? styles.withBorder : ""}`}
        >
            <div className={styles.imageContainer}>
                <img
                    src={payment.imageUrl}
                    alt={payment.name}
                    className={styles.paymentHistoryImage}
                />
            </div>
            <div className={styles.paymentHistoryDetails}>
                <h3 className={styles.paymentHistoryName}>{payment.name}</h3>
                <p className={styles.paymentHistoryDate}>
                    {payment.date} | {payment.time}
                </p>
                <p className={styles.paymentHistoryPrice}>
                    {formatPrice(payment.price)}원
                </p>
            </div>
        </div>
    );
};
