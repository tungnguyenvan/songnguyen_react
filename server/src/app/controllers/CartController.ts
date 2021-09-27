import BaseController from "@app/framework/core/BaseController";
import CartRepository from "@app/app/repositories/CartRepository";
import Express from "express";
import Logging from "@app/framework/utils/Logging";
import ExcelJS from "exceljs";
import ICartDocument from "../documents/ICartDocument";
import ICustomerDocument from "../documents/ICustomerDocument";
import ICartItemDocument from "../documents/ICartItemDocument";
import IProductNameDocument from "../documents/IProductNameDocument";
import IThicknessDocument from "../documents/IThicknessDocument";
import IStandardDocument from "../documents/IStandardDocument";
import ISizeDocument from "../documents/ISizeDocument";
import { FormType } from "../constants/EnumConstant";
import fs from "fs";
import Https from "https";
import IProductTypeDocument from "../documents/IProductTypeDocument";

const NAME_SPACE = "CartController";
const ORDER_FILE_INTERNET_DIR =
    "https://firebasestorage.googleapis.com/v0/b/songnguyen.appspot.com/o/Ma%CC%82%CC%83u-ba%CC%81o-gia%CC%81-co%CC%81-mo%CC%A3%CC%82c-cty.xlsx?alt=media&token=fb426ed4-a2c1-4f66-a525-9135ff956691";
const ORDER_FILE_RESOURCE_DIR = __dirname + "/../../resource/Song Nguyen Gasket - Báo giá.xlsx";

/**
 * Cart Controller
 * @author tung.nguyenvan
 */
class CartController extends BaseController {
    constructor() {
        super(new CartRepository());

        this.download = this.download.bind(this);
    }

    download(request: Express.Request, response: Express.Response): void {
        this.repository.get(request).then((responseData) => {
            const file = fs.createWriteStream(ORDER_FILE_RESOURCE_DIR);
            Https.get(ORDER_FILE_INTERNET_DIR, (rs) => {
                rs.pipe(file);
                Logging.debug(NAME_SPACE, `${NAME_SPACE}#download#Https.get`, file);

                file.on("finish", () => {
                    Logging.debug(NAME_SPACE, `${NAME_SPACE}#file.on Finished`);
                    this.execDownloadOrderFile(request, response, responseData);
                });
                file.on("error", (error) => {
                    // fs.unlinkSync(ORDER_FILE_RESOURCE_DIR)
                    this.appResponse.internalServerError(request, response);
                    Logging.error(NAME_SPACE, `${NAME_SPACE}#download#response.pipe`, error);
                });
            }).on("error", (error) => {
                // fs.unlinkSync(ORDER_FILE_RESOURCE_DIR)
                this.appResponse.internalServerError(request, response);
                Logging.error(NAME_SPACE, `${NAME_SPACE}#download#Https.get`, error);
            });
        });
    }

    execDownloadOrderFile(request: Express.Request, response: Express.Response, responseData: any) {
        const URL_PATH = "storage/";
        const fileName = `${Date.now()}.xlsx`;
        const workbook = new ExcelJS.Workbook();

        workbook.xlsx.readFile(ORDER_FILE_RESOURCE_DIR).then(() => {
            let workSheet = workbook.getWorksheet(1);
            try {
                Logging.debug(NAME_SPACE, `${NAME_SPACE}#readFile workbook`, workbook.worksheets);
                // write data for sheet 1
                this.writeUser((responseData as ICartDocument).createdBy, workSheet);
                this.writeCustomer((responseData as ICartDocument).customer as unknown as ICustomerDocument, workSheet);
                this.writeCartItems((responseData as ICartDocument).items as unknown as ICartItemDocument[], workSheet, true);

                // write data for sheet 2
                workSheet = workbook.getWorksheet(2);
                this.writeCustomer((responseData as ICartDocument).customer as unknown as ICustomerDocument, workSheet);
                this.writeCartItems((responseData as ICartDocument).items as unknown as ICartItemDocument[], workSheet);
            } catch (error) {
                Logging.error(NAME_SPACE, `${NAME_SPACE}#download`, error);
                this.appResponse.internalServerError(request, response);
            }

            Logging.debug(NAME_SPACE, `${NAME_SPACE}#execDownloadOrderFile Start save file`);
            workbook.xlsx
                .writeFile(URL_PATH + fileName)
                .then((status) => {
                    Logging.debug(NAME_SPACE, `${NAME_SPACE}#execDownloadOrderFile save file status`, status);
                    this.appResponse.ok(request, response, {
                        url: "https://" + request.get("host") + "/resources/" + fileName,
                    });
                })
                .catch((error) => {
                    Logging.error(NAME_SPACE, `${NAME_SPACE}#download`, error);
                });
        });
    }

    writeCartItems(cartItems: ICartItemDocument[], workSheet: ExcelJS.Worksheet, isOrderSheet: boolean = false) {
        Logging.debug(NAME_SPACE, `${NAME_SPACE}#writeCartItems START`);
        let totalPrice = 0;
        let totalAmount = 0;
        let totalDelivery = 0;

        cartItems.forEach((element, index) => {
            const size: ISizeDocument = element.size as unknown as ISizeDocument;
            const value: string[] = [
                (index + 1).toString(),
                (element.product_name as unknown as IProductNameDocument).name,
                (element.thickness as unknown as IThicknessDocument).name,
            ];

            if (element.standard as unknown as IStandardDocument) {
                value.push((element.standard as unknown as IStandardDocument).name);
            } else {
                value.push("");
            }

            if (size.form_type === FormType.FORM_1) {
                value.push(size.name);
            } else {
                value.push("");
            }

            if (size.outer_diameter) {
                value.push(size.outer_diameter.toString());
            } else if (size.wn && size.ln) {
                value.push(size.ln + "x" + size.wn);
            } else {
                value.push("");
            }
            value.push("");

            if (size.inner_diameter) {
                value.push(size.inner_diameter.toString());
            } else if (size.wt && size.wt) {
                value.push(size.lt + "x" + size.wt);
            } else if (size.ir && size.or) {
                value.push(size.ir + "-" + size.or);
            } else {
                value.push("");
            }

            if (size.bolt) {
                value.push(size.bolt.toString());
            } else {
                value.push("");
            }

            if (size.hole_count) {
                value.push(size.hole_count.toString());
            } else {
                value.push("");
            }
            value.push("");

            if (size.hole_diameter) {
                value.push(size.hole_diameter.toString());
            } else {
                value.push("");
            }

            if (element.product_type && (element.product_type as unknown as IProductTypeDocument).unit) {
                value.push((element.product_type as unknown as IProductTypeDocument).unit);
            } else {
                value.push("");
            }

            value.push(element.amount.toString());
            totalAmount = totalAmount + element.amount;

            if (isOrderSheet) {
                value.push(element.unit_price.toString());
                value.push(element.total_price.toString());
                totalPrice = totalPrice + element.total_price;
            } else {
                value.push(element.delivered.toString());
                value.push((element.amount - element.delivered).toString());
                totalDelivery = totalDelivery + element.delivered;
            }

            workSheet.insertRow(21 + index, value);
        });

        if (isOrderSheet) {
            workSheet.getCell("P" + (22 + cartItems.length)).value = totalPrice;
            workSheet.getCell("P" + (23 + cartItems.length)).value = (totalPrice * 10) / 100;
            workSheet.getCell("P" + (24 + cartItems.length)).value = totalPrice + (totalPrice * 10) / 100;
        } else {
            workSheet.getCell("O" + (21 + cartItems.length)).value = totalDelivery;
            workSheet.getCell("P" + (21 + cartItems.length)).value = totalAmount - totalDelivery;
        }

        cartItems.forEach((e, index) => {
            for (let num = 1; num < 18; num++) {
                workSheet.getRow(21 + index).getCell(num).border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
                workSheet.getCell("O" + (21 + index)).value = Number(workSheet.getCell("O" + (21 + index)).value);
                workSheet.getCell("O" + (21 + index)).numFmt = "#,##0";
                workSheet.getCell("P" + (21 + index)).value = Number(workSheet.getCell("P" + (21 + index)).value);
                workSheet.getCell("P" + (21 + index)).numFmt = "#,##0";
            }
        });

        Logging.debug(NAME_SPACE, `${NAME_SPACE}#writeCartItems END`);
    }

    writeCustomer(customer: ICustomerDocument, workSheet: ExcelJS.Worksheet) {
        Logging.debug(NAME_SPACE, `${NAME_SPACE}#writeCustomer START`);
        workSheet.getCell("C12").value = customer.name;
        workSheet.getCell("C13").value = customer.address;
        workSheet.getCell("C14").value = customer.tax;
        workSheet.getCell("C15").value = customer.contact_name;
        workSheet.getCell("C16").value = customer.email;
        workSheet.getCell("C17").value = customer.phone_number;
        Logging.debug(NAME_SPACE, `${NAME_SPACE}#writeCustomer END`);
    }

    writeUser(user: any, worksheet: ExcelJS.Worksheet) {
        Logging.debug(NAME_SPACE, `${NAME_SPACE}#writeCustomer START`, user);
        worksheet.getCell("O8").value = `${user.firstName} ${user.lastName}`;
        worksheet.getCell("O9").value = user.phoneNumber;
        worksheet.getCell("O10").value = user.email;
        Logging.debug(NAME_SPACE, `${NAME_SPACE}#writeCustomer END`);
    }
}

export default CartController;
