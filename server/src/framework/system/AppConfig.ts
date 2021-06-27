import env from "dotenv";
env.config();

class AppConfig {
	public static DB_URL: string = process.env.DB_URL;
	public static PORT: number | string = process.env.PORT || 3002;
	public static MAX_REQUEST_PER_HOURS: number | string = process.env.MAX_REQUEST_PER_HOURS;
	public static BUCKET_URL: string = process.env.BUCKET_URL;
	public static SALT_ENCRYPTION = 10;
	public static JSON_WEB_TOKEN_KEY: string = process.env.JSON_WEB_TOKEN_KEY;
	public static JSON_WEB_TOKEN_EXPIRESIN: string = "10day";
	public static TOKEN_PREFIX: string = "Bearer";
}

export default AppConfig;
