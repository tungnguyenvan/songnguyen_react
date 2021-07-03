import React from "react";
import EventConstant from "framework/constants/EventConstant";
import IUserModel from "framework/documents/models/IUserModel";

/**
 * Class util for framework
 */
class FrameworkUtils {
    /**
     * Add callback event when user click out side ref
     * @param ref React.RefObject
     * @param callback Void function
     */
    public static addEventWhenClickOutSide(ref: React.RefObject<any>, callback: () => void): void {
        document.addEventListener(EventConstant.MOUSE_DOWN, (e) => {
            if (ref && ref.current && !ref.current.contains(e.target)) {
                if (callback) callback();
            }
        });
    }

    /**
     * Add callback event when user click out side ref[]
     * @param refs React.RefObject[]
     * @param callback Void function
     */
    public static addEventWhenClickOutSideMultipleNode(callback: () => void, ...refs: React.RefObject<any>[]) {
        document.addEventListener(EventConstant.MOUSE_DOWN, (e) => {
            let isOutside = true;
            refs.forEach(function (ref) {
                if (ref && ref.current && ref.current.contains(e.target)) {
                    isOutside = false;
                }
            });

            if (isOutside) callback();
        });
    }

    /**
     * Execute callback function when not null
     * @param callback Callback Function
     */
    public static executeWhenNotNull(callback: any) {
        if (callback) callback();
    }

    /**
     * Check input data is blank
     * @param input Data input
     * @returns True if blank
     */
    public static isBlank(input: String | Number) {
        return input === undefined || input === null || input === "";
    }

    /**
     * Check input data is alive
     * @param input Any data want check alive
     * @returns True if input alive
     */
    public static isAlive(input: any) {
        return input !== null && input !== undefined;
    }

    /**
     * Get current path name from url
     * @returns String path name
     */
    public static currentPath(): String {
        return window.location.pathname;
    }

    /**
     * Add event when local storage has changed
     * @param func function will be triger after local storage has changed
     */
    public static addEventStorageHasChange(func: any) {
        window.addEventListener("storage", func);
    }

    /**
     * Remove item in list by value of item
     * @param list list need remove item
     * @param item item need remove in list
     * @returns list had removed item
     */
    public static removeItemInList<T extends any>(list: T[], item: T): T[] {
        const index = list.indexOf(item);
        if (index >= 0) {
            list.splice(index);
            return list;
        }

        return list;
    }

    public static lowerCaseString(s: string): string {
        return s.toLowerCase();
    }

    public static userName(user: IUserModel) {
        return user.firstName + " " + user.lastName;
    }
}

export default FrameworkUtils;
