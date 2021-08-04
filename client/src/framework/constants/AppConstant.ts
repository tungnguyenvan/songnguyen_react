class AppConstant {
    public static API_END_POINT = "http://localhost:3002/"; // TODO: get from .env file
    public static ACCESS_TOKEN_KEY = "access_token";
    public static TOKEN_PREFIX: string = "Bearer";
    // eslint-disable-next-line no-useless-escape
    public static EMAIL_REGEXP: RegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    public static ONLY_NUMBER_REGEXP: RegExp = /^[0-9]*$/gm;
    public static DOUBLE_NUMBER_REGEXP: RegExp = /^(?:0|[1-9][0-9]*)\.[0-9]+$|^[0-9]*$/gm;
    public static DATE_REGEXP: RegExp =
        /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/gm;
}

export default AppConstant;
