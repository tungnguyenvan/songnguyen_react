import BaseController from "@app/framework/core/BaseController";
import WarehouseRepository from "@app/app/repositories/WarehouseRepository";
import Express from "express";
import Logging from "@app/framework/utils/Logging";
import IWarehouseDocument from "../documents/IWarehouseDocument";
import ExcelJS from "exceljs";
import ProductNameRepository from "../repositories/ProductNameRepository";
import IProductNameDocument from "../documents/IProductNameDocument";
import fs from "fs";
import IThicknessDocument from "../documents/IThicknessDocument";
import ThicknessRepository from "../repositories/ThicknessRepository";
import SystemStandardRepository from "../repositories/SystemStandardRepository";
import ISystemStandardDocument from "../documents/ISystemStandardDocument";
import IStandardDocument from "../documents/IStandardDocument";
import StandardRepository from "../repositories/StandardRepository";
import IProductTypeDocument from "../documents/IProductTypeDocument";
import ProductTypeRepository from "../repositories/ProductTypeRepository";
import ISizeDocument from "../documents/ISizeDocument";
import SizeRepository from "../repositories/SizeRepository";
import Https from "https";

const NAME_SPACE = "WarehouseController";
const WAREHOUSE_FILE_INTERNET_DIR = "https://firebasestorage.googleapis.com/v0/b/songnguyen.appspot.com/o/warehouse.xlsx?alt=media&token=e0d4c97a-688e-4f05-8467-37727e981b7a";
const WAREHOUSE_FILE_RESOURCE_DIR = __dirname + "/../../resource/warehouse.xlsx";

/**
 * Warehouse Controller
 * @author tung.nguyenvan
 */
class WarehouseController extends BaseController {
    constructor() {
        super(new WarehouseRepository());

        this.save = this.save.bind(this);
        this.download = this.download.bind(this);
    }

    save(request: Express.Request, response: Express.Response): void {
        try {
            const searchObj = {
                product_name: request.body.product_name,
                product_type: request.body.product_type,
                thickness: request.body.thickness,
                system_standard: request.body.system_standard,
                standard: request.body.standard,
                size: request.body.size,
            };

            request.query.search = JSON.stringify(searchObj);
            this.repository.all(request).then((w) => {
                if ((w as unknown as any[]).length > 0) {
                    const updateObject = {
                        amount: ((w as unknown as any[])[0] as IWarehouseDocument).amount + parseInt(request.body.amount, 10),
                    };
                    const req = request;
                    req.body = updateObject;
                    req.params.id = ((w as unknown as any[])[0] as IWarehouseDocument)._id.toString();
                    this.repository
                        .updateOne(req)
                        .then((d) => {
                            if (d) {
                                this.appResponse.created(request, response, d);
                            } else {
                                this.appResponse.internalServerError(request, response);
                            }
                        })
                        .catch((error) => {
                            Logging.error(NAME_SPACE, `${NAME_SPACE}#save`, error);
                            this.appResponse.internalServerError(request, response);
                        });
                } else {
                    super.save(request, response);
                }
            });
        } catch (error) {
            this.catchError(request, response, error);
        }
    }

    download(request: Express.Request, response: Express.Response) {
        Logging.debug(NAME_SPACE, `${NAME_SPACE}#download START`);
        // data api
        let productTypes: IProductTypeDocument[];
        let productNames: IProductNameDocument[];
        let thickness: IThicknessDocument[];
        let systemStandards: ISystemStandardDocument[];
        let standards: IStandardDocument[];
        let sizes: ISizeDocument[];

        const productTypeRepository: ProductTypeRepository = new ProductTypeRepository();
        productTypeRepository.all(request).then((productTypeResponse) => {
            productTypes = productTypeResponse as unknown as IProductTypeDocument[];
            this.executeExcelFile(productTypes, productNames, thickness, systemStandards, standards, sizes, request, response);
        });

        const productNameRepository: ProductNameRepository = new ProductNameRepository();
        productNameRepository.all(request).then((productNamesResponse) => {
            productNames = productNamesResponse as unknown as IProductNameDocument[];
            this.executeExcelFile(productTypes, productNames, thickness, systemStandards, standards, sizes, request, response);
        });

        const thicknessRepository: ThicknessRepository = new ThicknessRepository();
        thicknessRepository.all(request).then((thicknessResponse) => {
            thickness = thicknessResponse as unknown as IThicknessDocument[];
            this.executeExcelFile(productTypes, productNames, thickness, systemStandards, standards, sizes, request, response);
        });

        const systemStandardRepository: SystemStandardRepository = new SystemStandardRepository();
        systemStandardRepository.all(request).then((systemStandardResponse) => {
            systemStandards = systemStandardResponse as unknown as ISystemStandardDocument[];
            this.executeExcelFile(productTypes, productNames, thickness, systemStandards, standards, sizes, request, response);
        });

        const standardRepository: StandardRepository = new StandardRepository();
        standardRepository.all(request).then((standardResponse) => {
            standards = standardResponse as unknown as IStandardDocument[];
            this.executeExcelFile(productTypes, productNames, thickness, systemStandards, standards, sizes, request, response);
        });

        const sizeRepository: SizeRepository = new SizeRepository();
        sizeRepository.all(request).then((sizeResponse) => {
            sizes = sizeResponse as unknown as ISizeDocument[];
            this.executeExcelFile(productTypes, productNames, thickness, systemStandards, standards, sizes, request, response);
        });
        Logging.debug(NAME_SPACE, `${NAME_SPACE}#download END`);
    }

    executeExcelFile(
        productTypes: IProductTypeDocument[],
        productNames: IProductNameDocument[],
        thickness: IThicknessDocument[],
        systemStandards: ISystemStandardDocument[],
        standards: IStandardDocument[],
        sizes: ISizeDocument[],
        request: Express.Request,
        response: Express.Response
    ) {
        Logging.debug(NAME_SPACE, `${NAME_SPACE}#executeExcelFile START`);
        if (
            productTypes &&
            productNames &&
            thickness &&
            systemStandards &&
            standards &&
            sizes &&
            productTypes.length &&
            productNames.length &&
            thickness.length &&
            systemStandards.length &&
            standards.length &&
            sizes.length
        ) {
            const URL_PATH = "storage/";
            const fileName = `${Date.now()}.xlsx`;
            const workbook = new ExcelJS.Workbook();
            const file = fs.createWriteStream(WAREHOUSE_FILE_RESOURCE_DIR);
            Https.get(WAREHOUSE_FILE_INTERNET_DIR, (res) => {
                res.pipe(file);

                file.on("finish", () => {
                    workbook.xlsx.readFile(WAREHOUSE_FILE_RESOURCE_DIR).then(() => {
                        Logging.debug(NAME_SPACE, `${NAME_SPACE}#readFile warehouse START`, workbook.properties);
                        const workSheet = workbook.getWorksheet(1);
                        try {
                            this.writeSettingSheet(workSheet, productTypes, productNames, thickness, systemStandards, standards, sizes);
                        } catch (error) {
                            Logging.error(NAME_SPACE, `${NAME_SPACE}#download`, error);
                            this.appResponse.internalServerError(request, response);
                        }

                        workbook.xlsx
                            .writeFile(URL_PATH + fileName)
                            .then((status) => {
                                setTimeout(() => {
                                    // fs.unlinkSync(URL_PATH + fileName);
                                }, 120000);
                                this.appResponse.ok(request, response, {
                                    url: request.protocol + "://" + request.get("host") + "/resources/" + fileName,
                                });
                            })
                            .catch((error) => {
                                Logging.error(NAME_SPACE, `${NAME_SPACE}#download`, error);
                            });
                    });
                    setTimeout(() => {
                        // fs.unlinkSync(WAREHOUSE_FILE_RESOURCE_DIR)
                    }, 12000);
                });
                file.on("error", (error) => {
                    // fs.unlinkSync(WAREHOUSE_FILE_RESOURCE_DIR)
                    this.appResponse.internalServerError(request, response);
                    Logging.error(NAME_SPACE, `${NAME_SPACE}#download#response.pipe`, error);
                });
            }).on("error", (error) => {
                // fs.unlinkSync(WAREHOUSE_FILE_RESOURCE_DIR)
                this.appResponse.internalServerError(request, response);
                Logging.error(NAME_SPACE, `${NAME_SPACE}#download#Https.get`, error);
            });
        }
        Logging.debug(NAME_SPACE, `${NAME_SPACE}#executeExcelFile END`);
    }

    writeSettingSheet(
        workSheet: ExcelJS.Worksheet,
        productTypes: IProductTypeDocument[],
        productNames: IProductNameDocument[],
        thickness: IThicknessDocument[],
        systemStandards: ISystemStandardDocument[],
        standards: IStandardDocument[],
        sizes: ISizeDocument[]
    ) {
        Logging.debug(NAME_SPACE, `${NAME_SPACE}#writeSettingSheet START`);
        let maxLength = 0;
        if (maxLength < productTypes.length) maxLength = productTypes.length;
        if (maxLength < productNames.length) maxLength = productNames.length;
        if (maxLength < thickness.length) maxLength = thickness.length;
        if (maxLength < systemStandards.length) maxLength = systemStandards.length;
        if (maxLength < standards.length) maxLength = standards.length;
        if (maxLength < sizes.length) maxLength = sizes.length;
        let index = 1;

        for (let i = 0; i < maxLength; i++) {
            const value = [];

            if (productTypes[i]) {
                value.push(productTypes[i].name);
            } else {
                value.push(null);
            }
            value.push(null);

            if (productNames[i]) {
                value.push(productNames[i].name);
            } else {
                value.push(null);
            }
            value.push(null);

            if (thickness[i]) {
                value.push(thickness[i].name);
                value.push(thickness[i].price);
            } else {
                value.push(null);
            }
            value.push(null);

            if (systemStandards[i]) {
                value.push(systemStandards[i].name);
            } else {
                value.push(null);
            }
            value.push(null);

            if (standards[i]) {
                value.push(standards[i].name);
            } else {
                value.push(null);
            }
            value.push(null);

            if (sizes[i]) {
                value.push(sizes[i].name);
                value.push(sizes[i].inner_diameter);
                value.push(sizes[i].outer_diameter);
                value.push(sizes[i].hole_count);
                value.push(sizes[i].hole_diameter);
            } else {
                value.push(null);
                value.push(null);
                value.push(null);
                value.push(null);
                value.push(null);
            }

            workSheet.insertRow(index, value);
            index += 1;
        }
        Logging.debug(NAME_SPACE, `${NAME_SPACE}#writeSettingSheet END`);
    }
}

export default WarehouseController;
