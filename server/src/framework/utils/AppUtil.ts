import Bcrypt from "bcrypt";
import AppConfig from "@app/framework/system/AppConfig";
import JsonWebToken from "jsonwebtoken";
import Mongoose from "mongoose";

const NAME_SPACE = "AppUtil";

class AppUtil {
	public static PIPE_CHAR = "|";
	public static JWT_SPLIT_CHAR = " ";

	/**
	 * This function will check data input is array
	 * @param data any data want check is array
	 * @returns True if data is array, opposite return false
	 */
	public static isArray(data: any): boolean {
		return data !== null && data !== undefined && Array.isArray(data);
	}

	/**
	 * This function split your input to array by "|"
	 * @param input String want split
	 * @returns String array after split |
	 * @example input: "a|b|c" -> ["a", "b", "c"]
	 */
	public static splitPipe(input: string): string[] {
		return input.split(this.PIPE_CHAR);
	}

	/**
	 * Check input data is alive
	 * @param input Any data
	 * @returns True if input alive, or false if input not alive
	 */
	public static isAlive(input: any): boolean {
		return input !== null && input !== undefined && input;
	}

	/**
	 * Check input data is object
	 * @param input Any data
	 * @returns True if input is object
	 */
	public static isObject(input: any): boolean {
		return input !== null && input !== undefined && typeof input === "object";
	}

	/**
	 * Endcode from password parameter
	 * @param password user password
	 */
	public static async endcodePassword(password: string): Promise<string> {
		return Bcrypt.hash(password, AppConfig.SALT_ENCRYPTION);
	}

	/**
	 * Generate Json web token
	 * @param information object
	 * @returns token string
	 */
	public static generateToken(information: any): string {
		return JsonWebToken.sign(information, AppConfig.JSON_WEB_TOKEN_KEY, {
			expiresIn: AppConfig.JSON_WEB_TOKEN_EXPIRESIN,
		});
	}

	/**
	 * Create new Object id
	 * @returns ObjectId
	 * @example 60968b98b484a615de4c2c76
	 */
	public static newObjectId(): Mongoose.Types.ObjectId {
		return new Mongoose.Types.ObjectId();
	}

	/**
	 * Split token
	 * @param jsonWebToken
	 * @returns Array string [prefix, token]
	 */
	public static splitToken(jsonWebToken: string): string[] {
		return jsonWebToken.split(this.JWT_SPLIT_CHAR);
	}

	/**
	 * Convert object to map
	 * @param document object
	 * @returns new map
	 */
	public static toMap(document: any): Map<any, any> {
		if (this.isObject(document)) return new Map(Object.entries(document));
		return new Map();
	}
}

export default AppUtil;
