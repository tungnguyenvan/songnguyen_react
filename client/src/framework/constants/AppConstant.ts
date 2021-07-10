class AppConstant {
    public static API_END_POINT = "http://localhost:3002/"; // TODO: get from .env file
    public static ACCESS_TOKEN_KEY = "access_token";
    public static TOKEN_PREFIX: string = "Bearer";
    // eslint-disable-next-line no-useless-escape
    public static EMAIL_REGEXP: RegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    public static ONLY_NUMBER_REGEXP: RegExp = /^[0-9]*$/gm;
}

export default AppConstant;
