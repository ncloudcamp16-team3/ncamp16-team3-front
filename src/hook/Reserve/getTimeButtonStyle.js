export const getTimeButtonStyle = (time, selectedTime) => {
    const isSelected = time === selectedTime;
    return {
        width: "calc(33.33% - 8px)",
        height: 36,
        fontSize: 14,
        borderRadius: 20,
        margin: "4px",
        backgroundColor: isSelected ? "#E9A260" : "#FFFFFF",
        color: isSelected ? "#FFFFFF" : "#000000",
        border: `1px solid ${isSelected ? "#E9A260" : "#DDDDDD"}`,
        fontWeight: isSelected ? "bold" : "normal",
        "&:hover": {
            backgroundColor: isSelected ? "#E9A260" : "#F5F5F5",
            border: `1px solid ${isSelected ? "#E9A260" : "#CCCCCC"}`,
        },
    };
};
