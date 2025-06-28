export const getSettlementStyle = (settlement: string) => {
    switch (settlement) {
        case "تسویه شده":
            return { color: "text-green-600" };
        case "تسویه نشده":
            return { color: "text-red-500" };
        default:
            return { color: "text-gray-500" };
    }
};