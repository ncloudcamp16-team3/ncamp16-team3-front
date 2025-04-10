import { PaymentHistoryItem } from "./PaymentHistoryItem.jsx";
import styles from "../../css/PaymentHistory.module.css";

export const PaymentHistory = ({ payments, loading }) => {
    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (payments == null) {
        return <div className={styles.empty}>결제 내역이 없습니다</div>;
    }

    return (
        <div className={styles.paymentHistoryListContainer}>
            {payments.map((payment, index) => (
                <PaymentHistoryItem
                    key={payment.id}
                    payment={payment}
                    isLast={index === payment.length - 1}
                />
            ))}
        </div>
    );
};
