enum MessageId {
    // ID for static data on UI
    CUSTOMERS = "CUSTOMERS",
    DASHBOARD = "DASHBOARD",
    PARTNERS = "PARTNERS",
    LOGIN = "LOGIN",
    REGISTRATION = "REGISTRATION",
    PASSWORD = "PASSWORD",
    LOGIN_FAILED = "LOGIN_FAILED",
    EMAIL = "EMAIL",
    FIRST_NAME = "FIRST_NAME",
    LAST_NAME = "LAST_NAME",
    CONFIRM_PASSWORD = "CONFIRM_PASSWORD",
    REGISTRATION_REDIRECT = "REGISTRATION_REDIRECT",
    REGISTRATION_SUCCESS = "REGISTRATION_SUCCESS",
    REGISTRATION_SUCCESS_CONTENT = "REGISTRATION_SUCCESS_CONTENT",
    SERVER_ERROR = "SERVER_ERROR",
    SERVER_ERROR_CONTENT = "SERVER_ERROR_CONTENT",
    REGISTRATION_FAILED = "REGISTRATION_FAILED",
    REGISTRATION_FAILED_CONTENT = "REGISTRATION_FAILED_CONTENT",
    PLACEHOLDER_SEARCG_STORE = "PLACEHOLDER_SEARCG_STORE",
    STORES = "STORES",
    SEARCH = "SEARCH",
    NAME = "NAME",
    ADDRESS = "ADDRESS",
    TAX_CODE = "TAX_CODE",
    PHONE_NUMBER = "PHONE_NUMBER",
    CONTACT_NAME = "CONTACT_NAME",
    EMPLOYEE = "EMPLOYEE",
    ACTION = "ACTION",
    CUSTOMERS_DETAIL = "CUSTOMERS_DETAIL",
    NOT_FOUND = "NOT_FOUND",
    CUSTOMER_NOT_FOUND = "CUSTOMER_NOT_FOUND",
    CUSTOMER_NAME = "CUSTOMER_NAME",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    CONFIRM_DELETE = "CONFIRM_DELETE",
    CONFIRM_DELETE_DETAIL = "CONFIRM_DELETE_DETAIL",
    CONFIRM_UPDATE = "CONFIRM_UPDATE",
    CONFIRM_UPDATE_DETAIL = "CONFIRM_UPDATE_DETAIL",
    CANNOT_DELETE = "CANNOT_DELETE",
    CANNOT_DELETE_DETAIL = "CANNOT_DELETE_DETAIL",
    DELETE_SUCCESS = "DELETE_SUCCESS",
    DELETE_SUCCESS_DETAIL = "DELETE_SUCCESS_DETAIL",
    VALIDATE_REQUIRE = "VALIDATE_REQUIRE",
    VALIDATE_ONLY_NUMBER = "VALIDATE_ONLY_NUMBER",
    VALIDATE_TAX_CODE = "VALIDATE_TAX_CODE",
    VALIDATE_EMAIL = "VALIDATE_EMAIL",
    VALIDATE_PHONE_NUMBER = "VALIDATE_PHONE_NUMBER",
    VALIDATE_ONLY_FLOAT = "VALIDATE_ONLY_FLOAT",
    CANNOT_UPDATE = "CANNOT_UPDATE",
    CANNOT_UPDATE_DETAIL = "CANNOT_UPDATE_DETAIL",
    UPDATE_SUCCESS = "UPDATE_SUCCESS",
    UPDATE_SUCCESS_DETAIL = "UPDATE_SUCCESS_DETAIL",
    FORM_NOT_CHANGE = "FORM_NOT_CHANGE",
    FORM_NOT_CHANGE_DETAIL = "FORM_NOT_CHANGE_DETAIL",
    CUSTOMER_CREATE = "CUSTOMER_CREATE",
    CANCEL = "CANCEL",
    CONFIRM_REGISTRATION = "CONFIRM_REGISTRATION",
    CONFIRM_REGISTRATION_CONTENT = "CONFIRM_REGISTRATION_CONTENT",
    SETTING = "SETTING",
    PRODUCT_TYPE = "PRODUCT_TYPE",
    PRODUCT_TYPE_DETAIL = "PRODUCT_TYPE_DETAIL",
    PRODUCT_TYPE_CREATE = "PRODUCT_TYPE_CREATE",
    CREATED_TIME = "CREATED_TIME",
    PRODUCT_NAME = "PRODUCT_NAME",
    PRODUCT_NAME_DETAIL = "PRODUCT_NAME_DETAIL",
    PRODUCT_NAME_CREATE = "PRODUCT_NAME_CREATE",
    THICKNESS = "THICKNESS",
    M2_PRICE = "M2_PRICE",
    THICKNESS_DETAIL = "THICKNESS_DETAIL",
    THICKNESS_CREATE = "THICKNESS_CREATE",
    SYSTEM_STANDARD = "SYSTEM_STANDARD",
    SYSTEM_STANDARD_DETAIL = "SYSTEM_STANDARD_DETAIL",
    SYSTEM_STANDARD_CREATE = "SYSTEM_STANDARD_CREATE",
    STANDARD = "STANDARD",
    STANDARD_DETAIL = "STANDARD_DETAIL",
    STANDARD_CREATE = "STANDARD_CREATE",
    COEFFICIENT = "COEFFICIENT",
    BOLT = "BOLT",
    FORM_TYPE = "FORM_TYPE",
    SIZE = "SIZE",
    SIZE_DETAIL = "SIZE_DETAIL",
    SIZE_CREATE = "SIZE_CREATE",
    INNER_DIAMETER = "INNER_DIAMETER",
    OUTER_DIAMETER = "OUTER_DIAMETER",
    HOLE_COUNT = "HOLE_COUNT",
    HOLE_DIAMETER = "HOLE_DIAMETER",
    WORK_PRICE = "WORK_PRICE",
    MATERIAL_PRICE = "MATERIAL_PRICE",
    MAKE_ORDER = "MAKE_ORDER",
    AMOUNT = "AMOUNT",
    DISCOUNT_TYPE = "DISCOUNT_TYPE",
    DISCOUNT = "DISCOUNT",
    INCREASE = "INCREASE",
    PERCENT = "PERCENT",
    UNIT_PRICE = "UNIT_PRICE",
    TOTAL_AMOUNT = "TOTAL_AMOUNT",
    ADD_TO_CART = "ADD_TO_CART",
    PRODUCT_OPTION = "PRODUCT_OPTION",
    PRODUCT_INFORMATION = "PRODUCT_INFORMATION",
    ORDER_INFORMATION = "ORDER_INFORMATION",
    CALCULATED = "CALCULATED",
    VALIDATE_NEED_INPUT_PERCENT = "VALIDATE_NEED_INPUT_PERCENT",
    CHOOSE_SHAPE = "CHOOSE_SHAPE",
    RF_CIRCLE = "RF_CIRCLE",
    FF_CIRCLE = "FF_CIRCLE",
    RF_RECTANGLE = "RF_RECTANGLE",
    FF_RECTANGLE = "FF_RECTANGLE",
    FF_MANHOLE = "FF_MANHOLE",
    WN_DIAMETER = "WN_DIAMETER",
    WT_DIAMETER = "WT_DIAMETER",
    LN_DIAMETER = "LN_DIAMETER",
    LT_DIAMETER = "LT_DIAMETER",
    IR_DIAMETER = "IR_DIAMETER",
    OR_DIAMETER = "OR_DIAMETER",
    BL = "BL",
    WIDTH = "WIDTH",
    LENGTH = "LENGTH",
    CREATE_NEW_CART = "CREATE_NEW_CART",
    OR = "OR",
    CHOOSE_CART = "CHOOSE_CART",
    VIEW_ALL = "VIEW_ALL",
    EDIT = "EDIT",
    PRODUCTS = "PRODUCTS",
    EXPORT_ORDER = "EXPORT_ORDER",
    NEED_CHOOSE_CART = "NEED_CHOOSE_CART",
    ADD_TO_CART_FAILED = "ADD_TO_CART_FAILED",
    ADD_TO_CART_FAILED_CONTENT = "ADD_TO_CART_FAILED_CONTENT",
    ADD_TO_CART_SUCCESS = "ADD_TO_CART_SUCCESS",
    ADD_TO_CART_SUCCESS_CONTENT = "ADD_TO_CART_SUCCESS_CONTENT",
    VAT = "VAT",
    PRICE = "PRICE",
    CART_DETAIL = "CART_DETAIL",
    CHANGE_CUSTOMER = "CHANGE_CUSTOMER",
    CART_STATUS = "CART_STATUS",
    DISCUSS = "DISCUSS",
    CONFIRM = "CONFIRM",
    DOING = "DOING",
    DONE = "DONE",
    CARTS = "CARTS",
    CART_CREATE = "CART_CREATE",
    CHOOSE_CUSTOMER = "CHOOSE_CUSTOMER",
    BIRTH_DATE = "BIRTH_DATE",
    EMPLOYEE_CREATE = "EMPLOYEE_CREATE",
    USER_ROLE = "USER_ROLE",
    ADMIN = "ADMIN",
    SELLER = "SELLER",
    ACCOUNTANT = "ACCOUNTANT",
    VALIDATE_CONFIRM_PASSWORD = "VALIDATE_CONFIRM_PASSWORD",
    VALIDATE_DATE = "VALIDATE_DATE",
    REGIS_EMPLOYEE_FAILED = "REGIS_EMPLOYEE_FAILED",
    SOURCE = "SOURCE",
    WAREHOUSE = "WAREHOUSE",
    DIY = "DIY",
    DELIVERY = "DELIVERY",
    IMPORT_WAREHOUSE = "IMPORT_WAREHOUSE",
    EXPORT_WAREHOUSE = "EXPORT_WAREHOUSE",
    UPLOAD_FILE = "UPLOAD_FILE",
    DOWNLOAD_TEMPLATE_FILE = "DOWNLOAD_TEMPLATE_FILE",
    CONFIRM_DATA = "CONFIRM_DATA",
    IMPORT_WAREHOUSE_SUCCESS = "IMPORT_WAREHOUSE_SUCCESS",
    IMPORT_WAREHOUSE_SUCCESS_DETAIL = "IMPORT_WAREHOUSE_SUCCESS_DETAIL",
    IMPORT_WAREHOUSE_FAILED = "IMPORT_WAREHOUSE_FAILED",
    IMPORT_WAREHOUSE_FAILED_DETAIL = "IMPORT_WAREHOUSE_FAILED_DETAIL",
}

export default MessageId;
