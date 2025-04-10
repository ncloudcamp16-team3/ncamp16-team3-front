import { usePaymentsData } from "./hooks/usePaymentsData";
import styles from "../../css/PaymentHistoryInterface.module.css";
import { PaymentHistory } from "./PaymentHistory.jsx";
import { useFilterOptions } from "./hooks/useFilterOptions.jsx";
import { FilterSection } from "./FilterSection.jsx";

export const PaymentHistoryInterface = () => {
    const { payments, loading, error } = usePaymentsData();
    const {
        periodSelect,
        startDate,
        endDate,
        handlePeriodChange,
        handleDateChange,
        handleSearch,
    } = useFilterOptions();

    return (
        <div className={styles.container}>
            <FilterSection
                periodSelect={periodSelect}
                startDate={startDate}
                endDate={endDate}
                onPeriodChange={handlePeriodChange}
                onDateChange={handleDateChange}
                onSearch={handleSearch}
            />
            <PaymentHistory payments={payments} loading={loading} />
        </div>
    );
};
