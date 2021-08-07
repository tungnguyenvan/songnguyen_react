import React from "react";
import EventConstant from "framework/constants/EventConstant";
import IUserModel from "framework/documents/models/IUserModel";
import { matchPath } from "react-router";
import IFormInputElement from "framework/components/IFormInputElement";
import IProductTypeModel from "app/documents/IProductTypeModel";
import { CartStatus, DiscountType, GasketPTCShape } from "framework/constants/AppEnumConstant";
import ISizeModel from "app/documents/ISizeModel";
import ILanguageContext from "framework/contexts/lang/ILanguageContext";
import MessageId from "framework/constants/MessageId";

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
        if (user) {
            return user.firstName + " " + user.lastName;
        }

        return "";
    }

    public static matchPath(url: string, route: string) {
        return matchPath(url, {
            path: route,
            exact: true,
            strict: false,
        });
    }

    public static readProp(obj: any, key: string) {
        if (!obj.hasOwnProperty(key)) return undefined;
        return obj[key];
    }

    public static validateFrom(formRefInterface: any): boolean {
        let isValid = true;

        // check validate
        for (const key in formRefInterface) {
            const input = FrameworkUtils.readProp(formRefInterface, key) as React.RefObject<IFormInputElement>;
            if (input && input.current) {
                if (!input.current.isValid()) isValid = false;
            }
        }

        return isValid;
    }

    public static formHasChanged(formRefInterface: any): boolean {
        let hasChanged = false;
        for (const key in formRefInterface) {
            const element = FrameworkUtils.readProp(formRefInterface, key) as React.RefObject<IFormInputElement>;
            if (element && element.current?.isChanged()) {
                hasChanged = true;
            }
        }
        return hasChanged;
    }

    public static formClear(formRefInterface: any) {
        for (const key in formRefInterface) {
            const element = FrameworkUtils.readProp(formRefInterface, key) as React.RefObject<IFormInputElement>;
            if (element) element.current?.clear();
        }
    }

    public static generateDate(dateStamp: number): string {
        return new Date(dateStamp).toDateString();
    }

    public static generateUniqueKey(): string {
        return (Date.now() + "_" + Math.random()).toString();
    }

    public static generateProductType(types: IProductTypeModel[]): string {
        let type = "";

        if (types) {
            types.forEach((element, index) => {
                if (index === 0) {
                    type += element.name;
                } else {
                    type += ", " + element.name;
                }
            });
        }

        return type;
    }

    public static setErrorMessage(formRefInterface: any, errorMessage: string) {
        for (const key in formRefInterface) {
            const element = FrameworkUtils.readProp(formRefInterface, key) as React.RefObject<IFormInputElement>;
            if (element) element.current?.setErrorMessage(errorMessage);
        }
    }

    public static onCalculatorBoltC(innerDiameter: number, shapeType: GasketPTCShape): number {
        switch (shapeType) {
            case GasketPTCShape.RF_CIRCLE: {
                return 0;
            }
            case GasketPTCShape.FF_CIRCLE: {
                if (innerDiameter === 2) $("#bolt").val(24600);
                else if (innerDiameter === 2.5 || innerDiameter === 3) return 23500;
                else if (innerDiameter === 3.5 || innerDiameter === 4 || innerDiameter === 4.5 || innerDiameter === 5) return 26600;
                else if (innerDiameter === 5.5 || innerDiameter === 6 || innerDiameter === 6.5 || innerDiameter === 7) return 28100;
                else if (innerDiameter === 7.5 || innerDiameter === 8 || innerDiameter === 8.5 || innerDiameter === 9) return 31700;
                else if (innerDiameter === 9.5 || innerDiameter === 10 || innerDiameter === 10.5 || innerDiameter === 11) return 32400;
                else if (innerDiameter === 11.5) return 34400;
                else if (innerDiameter === 12 || innerDiameter === 13) return 33100;
                else if (innerDiameter === 14 || innerDiameter === 15) return 38700;
                else if (innerDiameter === 16 || innerDiameter === 17) return 44000;
                else if (innerDiameter === 18 || innerDiameter === 19) return 46000;
                else if (innerDiameter === 20 || innerDiameter === 21) return 53000;
                else if (innerDiameter === 22 || innerDiameter === 23) return 61000;
                else if (innerDiameter === 24 || innerDiameter === 25) return 71700;
                else if (innerDiameter === 25.5 || innerDiameter === 26 || innerDiameter === 27) return 78900;
                else if (innerDiameter === 28 || innerDiameter === 28.5) return 88000;
                else if (innerDiameter === 29 || innerDiameter === 29.5) return 93000;
                else if (innerDiameter === 30 || innerDiameter === 30.5 || innerDiameter === 31 || innerDiameter === 32) return 103000;
                else if (innerDiameter === 33 || innerDiameter === 34) return 179000;
                else if (innerDiameter === 35 || innerDiameter === 36 || innerDiameter === 37 || innerDiameter === 38) return 285900;
                else if (innerDiameter === 39 || innerDiameter === 40) return 316800;
                else if (innerDiameter === 41 || innerDiameter === 42 || innerDiameter === 43 || innerDiameter === 44) return 727700;
                else if (innerDiameter >= 45) return 842900;
            }
        }

        return 0;
    }

    public static calculatorBL(holeDiameter: number): number {
        if (holeDiameter === 2) return 2460;
        else if (holeDiameter === 2.5 || holeDiameter === 3) return 2350;
        else if (holeDiameter === 3.5 || holeDiameter === 4 || holeDiameter === 4.5 || holeDiameter === 5) return 2660;
        else if (holeDiameter === 5.5 || holeDiameter === 6 || holeDiameter === 6.5 || holeDiameter === 7) return 2810;
        else if (holeDiameter === 7.5 || holeDiameter === 8 || holeDiameter === 8.5 || holeDiameter === 9) return 3170;
        else if (holeDiameter === 9.5 || holeDiameter === 10 || holeDiameter === 10.5 || holeDiameter === 11) return 3240;
        else if (holeDiameter === 11.5) return 3440;
        else if (holeDiameter === 12 || holeDiameter === 13) return 3310;
        else if (holeDiameter === 14 || holeDiameter === 15) return 3870;
        else if (holeDiameter === 16 || holeDiameter === 17) return 4400;
        else if (holeDiameter === 18 || holeDiameter === 19) return 4600;
        else if (holeDiameter === 20 || holeDiameter === 21) return 5300;
        else if (holeDiameter === 22 || holeDiameter === 23) return 6100;
        else if (holeDiameter === 24 || holeDiameter === 25) return 7170;
        else if (holeDiameter === 25.5 || holeDiameter === 26 || holeDiameter === 27) return 7890;
        else if (holeDiameter === 28) return 8800;
        else if (holeDiameter === 29) return 9300;
        else if (holeDiameter === 30) return 10300;
        else if (holeDiameter === 33) return 17900;
        else if (holeDiameter === 35) return 28590;
        else if (holeDiameter === 39) return 31680;
        else if (holeDiameter === 41) return 72770;
        else if (holeDiameter >= 45) return 84290;
        else return 0;
    }

    public static calculatorMaterialPriceRectangle(sizeModel: ISizeModel, productCount: number): number {
        let price = 0;

        switch (sizeModel.shape_type) {
            case GasketPTCShape.RF_RECTANGLE: {
                if (productCount > 10) {
                    price =
                        (((sizeModel.wn + sizeModel.ln + sizeModel.wt + sizeModel.lt) * 2 * 1.2 * 3 * 22000) / 1000 +
                            ((sizeModel.wn + 100) * (sizeModel.ln + 100) * 150000) / 1000000 +
                            20000 +
                            ((sizeModel.wn + 10) * (sizeModel.ln + 10) * 200000) / 1000000 +
                            175000) /
                        productCount /
                        1000;
                } else {
                    price =
                        (((sizeModel.wn + sizeModel.ln + sizeModel.wt + sizeModel.lt) * 2 * 1.2 * 3 * 22000) / 1000 +
                            ((sizeModel.wn + 100) * (sizeModel.ln + 100) * 150000) / 1000000 +
                            20000 +
                            ((sizeModel.wn + 10) * (sizeModel.ln + 10) * 200000) / 1000000 +
                            175000) /
                        10 /
                        1000;
                }
                break;
            }
            case GasketPTCShape.FF_RECTANGLE: {
                if (productCount > 10) {
                    price =
                        (((sizeModel.wn + sizeModel.ln + sizeModel.wt + sizeModel.lt) * 2 * 1.2 * 3 * 22000) / 1000 +
                            ((sizeModel.wn + 100) * (sizeModel.ln + 100) * 150000) / 1000000 +
                            20000 +
                            ((sizeModel.wn + 10) * (sizeModel.ln + 10) * 200000) / 1000000 +
                            175000 +
                            sizeModel.hole_diameter * sizeModel.bl) /
                        productCount /
                        1000;
                } else {
                    price =
                        (((sizeModel.wn + sizeModel.ln + sizeModel.wt + sizeModel.lt) * 2 * 1.2 * 3 * 22000) / 1000 +
                            ((sizeModel.wn + 100) * (sizeModel.ln + 100) * 150000) / 1000000 +
                            20000 +
                            ((sizeModel.wn + 10) * (sizeModel.ln + 10) * 200000) / 1000000 +
                            175000 +
                            sizeModel.hole_diameter * sizeModel.bl) /
                        10 /
                        1000;
                }
                break;
            }
            case GasketPTCShape.FF_MANHOLE: {
                if (productCount > 5) {
                    price =
                        ((((sizeModel.ir + sizeModel.or) * 2 * 3.14 + 4 * (sizeModel.ln - 2 * sizeModel.or)) * 1.2 * 3 * 22000) / 1000 +
                            ((sizeModel.wn + 100) * (sizeModel.ln + 100) * 150000) / 1000000 +
                            20000 +
                            ((sizeModel.wn + 10) * (sizeModel.ln + 10) * 200000) / 1000000 +
                            175000 +
                            sizeModel.hole_diameter * sizeModel.bl) /
                        productCount /
                        1000;
                } else {
                    price =
                        ((((sizeModel.ir + sizeModel.or) * 2 * 3.14 + 4 * (sizeModel.ln - 2 * sizeModel.wn)) * 1.2 * 3 * 22000) / 1000 +
                            ((sizeModel.ln + 100) * (sizeModel.wn + 100) * 150000) / 1000000 +
                            20000 +
                            ((sizeModel.ln + 10) * (sizeModel.wn + 10) * 200000) / 1000000 +
                            175000 +
                            sizeModel.hole_diameter * sizeModel.bl) /
                        5 /
                        1000;
                }
                break;
            }
            default:
                return 0;
        }

        return parseFloat(price.toFixed(1)) * 1000;
    }

    public static getDisplayNameDiscountType(discountType: DiscountType, languageContext: ILanguageContext) {
        if (!discountType) return "";
        if (discountType === DiscountType.DISCOUNT) {
            return languageContext.current.getMessageString(MessageId.DISCOUNT);
        }
        return languageContext.current.getMessageString(MessageId.INCREASE);
    }

    static getDisplayNameCartStatus(cartStatus: CartStatus, languageContext: ILanguageContext): string {
        if (!cartStatus) return "";

        switch (cartStatus) {
            case CartStatus.DISCUSS:
                return languageContext.current.getMessageString(MessageId.DISCUSS);
            case CartStatus.CONFIRM:
                return languageContext.current.getMessageString(MessageId.CONFIRM);
            case CartStatus.DOING:
                return languageContext.current.getMessageString(MessageId.DOING);
            default:
                return languageContext.current.getMessageString(MessageId.DONE);
        }
    }
}

export default FrameworkUtils;
