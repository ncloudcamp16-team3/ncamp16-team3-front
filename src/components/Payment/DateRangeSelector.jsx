import styles from "../../css/DateRangeSelector.module.css";

export const DateRangeSelector = ({
    startDate,
    endDate,
    onDateChange,
    onSearch,
}) => {
    return (
        <div className={styles.dateRangeContainer}>
            <div className={styles.inputGroup}>
                <input
                    type="text"
                    className={styles.dateInput}
                    value={startDate}
                    onChange={(e) => onDateChange("start", e.target.value)}
                    placeholder="YYYY-MM-DD"
                />
            </div>
            <div className={styles.inputGroup}>
                <span className={styles.separator}>-</span>
                <input
                    type="text"
                    className={styles.dateInput}
                    value={endDate}
                    onChange={(e) => onDateChange("end", e.target.value)}
                    placeholder="YYYY-MM-DD"
                />
                <button className={styles.searchButton} onClick={onSearch}>
                    검색
                </button>
            </div>
        </div>
    );
};
