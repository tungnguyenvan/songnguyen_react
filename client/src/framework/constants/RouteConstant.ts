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
}

export default RouteConstant;
