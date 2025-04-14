import { formatDate, formatPrice } from "./utils/formatters.jsx";
import styles from "../../css/payment/PaymentHistoryItem.module.css";

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
                <p className={styles.paymentHistoryName}>{payment.name}</p>
                <p className={styles.paymentHistoryDate}>
                    {formatDate(payment.created_at)}
                </p>
                <p className={styles.paymentHistoryPrice}>
                    {formatPrice(payment.price)}원
                </p>
            </div>
        </div>
    );
};
