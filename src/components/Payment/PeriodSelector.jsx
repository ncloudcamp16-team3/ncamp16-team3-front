import styles from "../../css/payment/PeriodSelector.module.css";

export const PeriodSelector = ({ selected, onChange }) => {
    const periods = ["15일", "1개월", "3개월"];

    return (
        <div className={styles.periodSelectorContainer}>
            {periods.map((period) => (
                <button
                    key={period}
                    className={`${styles.periodButton} ${selected === period ? styles.selected : ""}`}
                    onClick={() => onChange(period)}
                >
                    {period}
                </button>
            ))}
        </div>
    );
};
