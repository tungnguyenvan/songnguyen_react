enum GasketType {
    STANDARD = "STANDARD",
    NONE_STANDARD = "NONE_STANDARD",
    ROLL = "ROLL",
}

enum FormType {
    FORM_1 = "FORM_1",
    FORM_2 = "FORM_2",
    FORM_3 = "FORM_3",
}

enum DiscountType {
    NONE = "",
    DISCOUNT = "DISCOUNT",
    INCREASE = "INCREASE",
}

enum CartItemStatus {
    DISCUSS = "DISCUSS",
    CONFIRM = "CONFIRM",
    DOING = "DOING",
    DONE = "DONE",
}

enum CartStatus {
    DISCUSS = "DISCUSS",
    CONFIRM = "CONFIRM",
    DOING = "DOING",
    DONE = "DONE",
}

enum CartItemSource {
    DIY = "DIY",
    WAREHOUSE = "WAREHOUSE",
}

interface CartStatusHistoryItem {
    from: CartStatus;
    to: CartStatus;
    date: number;
    by: string;
    note: string;
}

export { GasketType, FormType, DiscountType, CartItemStatus, CartStatus, CartItemSource, CartStatusHistoryItem };
