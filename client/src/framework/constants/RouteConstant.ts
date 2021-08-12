enum RouteConstant {
    LOGIN = "/login",
    REGISTRATION = "/registration",
    DASHBOARD = "/",
    CUSTOMER = "/customers",
    CUSTOMER_DETAIL = "/customers/:id",
    CUSTOMER_CREATE = "/customer/new",
    PARTNERS = "/partners",
    EXAMPLE = "/example",
    STORES = "/stores",
    SETTING = "/setting",

    PRODUCT_TYPE = "/product_types",
    PRODUCT_TYPE_DETAIL = "/product_types/:id",
    PRODUCT_TYPE_CREATE = "/product_type/new",

    PRODUCT_NAME = "/product_names",
    PRODUCT_NAME_CREATE = "/product_name/new",
    PRODUCT_NAME_DETAIL = "/product_names/:id",

    THICKNESS = "/thicknesses",
    THICKNESS_DETAIL = "/thicknesses/:id",
    THICKNESS_CREATE = "/thickness/new",

    SYSTEM_STANDARD = "/system_standards",
    SYSTEM_STANDARD_DETAIL = "/system_standards/:id",
    SYSTEM_STANDARD_CREATE = "/system_standard/new",

    STANDARD = "/standards",
    STANDARD_DETAIL = "/standards/:id",
    STANDARD_CREATE = "/standard/new",

    SIZE = "/sizes",
    SIZE_DETAIL = "/sizes/:id",
    SIZE_CREATE = "/size/new",

    MAKE_ORDER = "/makeorder",

    CARTS = "/carts/",
    CART_DETAIL = "/carts/:id",
    CART_CREATE = "/cart/new",

    CART_ITEM = "/cart_item/",
    CART_ITEM_DETAIL = "/cart_item/:id",

    EMPLOYEE = "/employees/",
    EMPLOYEE_DETAIL = "/employees/:id",
    EMPLOYEE_CREATE = "/employee/new",

    WAREHOUSE = "/warehouse",
    WAREHOUSE_IMPORT = "/warehouse/import",
    WAREHOUSE_IMPORT_EXCEL_FILE = "/warehouse/import/excel",
}

export default RouteConstant;
