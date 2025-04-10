import { PeriodSelector } from "./PeriodSelector.jsx";
import { DateRangeSelector } from "./DateRangeSelector.jsx";
import styles from "../../css/FilterSection.module.css";

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
            <h2 className={styles.title}>결제내역</h2>
            <div className={styles.filterLabel}>
                조회기간 선택
                <PeriodSelector
                    selected={periodSelect}
                    onChange={onPeriodChange}
                />
            </div>
            <div className={styles.filterLabel}>
                조회일자 검색
                <DateRangeSelector
                    startDate={startDate}
                    endDate={endDate}
                    onDateChange={onDateChange}
                    onSearch={onSearch}
                />
            </div>
            <div>
                <hr />
            </div>
        </div>
    );
};
