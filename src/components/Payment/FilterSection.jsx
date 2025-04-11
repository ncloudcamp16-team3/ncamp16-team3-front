import { PeriodSelector } from "./PeriodSelector.jsx";
import { DateRangeSelector } from "./DateRangeSelector.jsx";
import styles from "../../css/payment/FilterSection.module.css";

export const FilterSection = ({
    periodSelect,
    startDate,
    endDate,
    onPeriodChange,
    onDateChange,
    onSearch,
}) => {
    return (
        <div className={styles.filterContainer}>
            <div className={styles.title}>
                <h2>결제내역</h2>
            </div>
            <div className={styles.filterWrapper}>
                <div className={styles.leftFilterLabel}>
                    조회기간 선택
                    <PeriodSelector
                        selected={periodSelect}
                        onChange={onPeriodChange}
                    />
                </div>
                <div className={styles.rightFilterLabel}>
                    조회일자 검색
                    <DateRangeSelector
                        startDate={startDate}
                        endDate={endDate}
                        onDateChange={onDateChange}
                        onSearch={onSearch}
                    />
                </div>
            </div>
        </div>
    );
};
