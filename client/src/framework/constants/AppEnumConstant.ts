enum FormType {
    FORM_1 = "FORM_1",
    FORM_2 = "FORM_2",
    FORM_3 = "FORM_3",
}

enum DiscountType {
    DISCOUNT = "DISCOUNT",
    INCREASE = "INCREASE",
}

enum GasketPTCShape {
    RF_CIRCLE = "RF_CIRCLE",
    FF_CIRCLE = "FF_CIRCLE",
    RF_RECTANGLE = "RF_RECTANGLE",
    FF_RECTANGLE = "FF_RECTANGLE",
    FF_MANHOLE = "FF_MANHOLE",
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

enum TableRowColor {
    NONE = "NONE",
    DANGER = "DANGER",
    WARNING = "WARNING",
    SUCCESS = "SUCCESS",
}

export { FormType, DiscountType, GasketPTCShape, CartItemStatus, CartStatus, CartItemSource, TableRowColor };
