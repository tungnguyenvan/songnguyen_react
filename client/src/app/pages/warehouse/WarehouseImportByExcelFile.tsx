import FrameworkComponents from "framework/components/FrameworkComponents";
import React from "react";
import Excel from "exceljs";
import IFormInputElement from "framework/components/IFormInputElement";
import WithFramework from "framework/constants/WithFramework";
import ILanguageContext from "framework/contexts/lang/ILanguageContext";
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext";
import IAppUrlContext from "framework/contexts/url/IAppUrlContext";
import MessageId from "framework/constants/MessageId";
import IWarehouseModel from "app/documents/IWarehouseModel";
import IProductTypeModel from "app/documents/IProductTypeModel";
import ProductTypeApiService from "app/api/ProductTypeApiService";
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode";
import IProductNameModel from "app/documents/IProductNameModel";
import ProductNameApiService from "app/api/ProductNameApiService";
import IThicknessModel from "app/documents/IThicknessModel";
import ThicknessApiService from "app/api/ThicknessApiService";
import ISystemStandardModel from "app/documents/ISystemStandardModel";
import SystemStandardApiService from "app/api/SystemStandardApiService";
import IStandardModel from "app/documents/IStandardModel";
import StandardApiService from "app/api/StandardApiService";
import ISizeModel from "app/documents/ISizeModel";
import SizeApiService from "app/api/SizeApiService";
import { FormType, GasketPTCShape } from "framework/constants/AppEnumConstant";
import ITableCellModel from "framework/documents/ui/ITableCellModel";
import FrameworkUtils from "framework/utils/FrameworkUtils";
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant";
import WarehouseApiService from "app/api/WarehouseApiService";
import RouteConstant from "framework/constants/RouteConstant";
import AppUtils from "app/utils/AppUtils";

const FORM_SHEET_NUM: number = 2;
const PRODUCT_TYPE_HEADER_DEF = "Loại sản phẩm";

interface WarehouseImportByExcelFileProps {
    languageContext: ILanguageContext;
    appDialogContext: IAppDialogContext;
    appUrlContext: IAppUrlContext;
}

interface IWarehouseImportByExcelFormRef {
    inputFile: React.RefObject<any>;
}

interface IWarehouseImportByExcelState {
    warehouses: IWarehouseModel[];
    productTypes: IProductTypeModel[];
    productNames: IProductNameModel[];
    thicknesses: IThicknessModel[];
    systemStandards: ISystemStandardModel[];
    standards: IStandardModel[];
    sizes: ISizeModel[];
    taskCount: number;
}

class WarehouseImportByExcelFile extends React.Component<
    WarehouseImportByExcelFileProps,
    IWarehouseImportByExcelState
> {
    private warehouseImportByExcelFormRef: IWarehouseImportByExcelFormRef;
    private productTypeApiService: ProductTypeApiService;
    private productNameApiService: ProductNameApiService;
    private thicknessApiService: ThicknessApiService;
    private systemStandardApiService: SystemStandardApiService;
    private standardApiService: StandardApiService;
    private sizeApiService: SizeApiService;
    private warehouseApiService: WarehouseApiService;

    constructor(props: any) {
        super(props);

        this.warehouseImportByExcelFormRef = {
            inputFile: React.createRef<IFormInputElement>(),
        };
        this.productTypeApiService = new ProductTypeApiService();
        this.productNameApiService = new ProductNameApiService();
        this.thicknessApiService = new ThicknessApiService();
        this.systemStandardApiService = new SystemStandardApiService();
        this.standardApiService = new StandardApiService();
        this.sizeApiService = new SizeApiService();
        this.warehouseApiService = new WarehouseApiService();

        this.state = {
            warehouses: [],
            productTypes: [],
            productNames: [],
            thicknesses: [],
            systemStandards: [],
            standards: [],
            sizes: [],
            taskCount: 0,
        };

        this.onFileInputChange = this.onFileInputChange.bind(this);
        this.tableHeader = this.tableHeader.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onImportToWarehouse = this.onImportToWarehouse.bind(this);
        this.validateWarehouseList = this.validateWarehouseList.bind(this);
        this.alertInputFileNotSuitable = this.alertInputFileNotSuitable.bind(this);
        this.saveWarehouse = this.saveWarehouse.bind(this);
    }

    componentDidMount() {
        this.productTypeApiService.all().then((response) => {
            if (response.status === HttpRequestStatusCode.OK) {
                this.setState({
                    productTypes: response.data.data as IProductTypeModel[],
                    taskCount: this.state.taskCount + 1,
                });
            }
        });

        this.productNameApiService.all().then((response) => {
            if (response.status === HttpRequestStatusCode.OK) {
                this.setState({
                    productNames: response.data.data as IProductNameModel[],
                    taskCount: this.state.taskCount + 1,
                });
            }
        });

        this.thicknessApiService.all().then((response) => {
            if (response.status === HttpRequestStatusCode.OK) {
                this.setState({
                    thicknesses: response.data.data as IThicknessModel[],
                    taskCount: this.state.taskCount + 1,
                });
            }
        });

        this.systemStandardApiService.all().then((response) => {
            if (response.status === HttpRequestStatusCode.OK) {
                this.setState({
                    systemStandards: response.data.data as ISystemStandardModel[],
                    taskCount: this.state.taskCount + 1,
                });
            }
        });

        this.standardApiService.all().then((response) => {
            if (response.status === HttpRequestStatusCode.OK) {
                this.setState({
                    standards: response.data.data as IStandardModel[],
                    taskCount: this.state.taskCount + 1,
                });
            }
        });

        this.sizeApiService.all().then((response) => {
            if (response.status === HttpRequestStatusCode.OK) {
                this.setState({
                    sizes: response.data.data as ISizeModel[],
                    taskCount: this.state.taskCount + 1,
                });
            }
        });
    }

    loadWorkbook(data: any) {
        const workbook = new Excel.Workbook();
        workbook.xlsx.load(data).then(() => {
            this.dumpWorkbook(workbook);
        });
    }

    dumpWorkbook(workbook: Excel.Workbook) {
        this.dumpWorksheet(workbook.getWorksheet(FORM_SHEET_NUM));
    }

    dumpWorksheet(worksheet: Excel.Worksheet) {
        let startRow = 0;
        worksheet.eachRow((row, rowNumber) => {
            const rowValues = row.values as any[];
            if (rowValues[1] === PRODUCT_TYPE_HEADER_DEF && startRow === 0) {
                startRow = rowNumber + 2;
            }
        });

        if (startRow) {
            this.dumpWarehouseList(startRow, worksheet);
        } else {
            this.props.appDialogContext.addDialog({
                title: this.props.languageContext.current.getMessageString(
                    MessageId.INPUT_FILE_NOT_SUITABLE
                ),
                content: this.props.languageContext.current.getMessageString(
                    MessageId.INPUT_FILE_NOT_SUITABLE_CONTENT
                ),
            });
        }
    }

    dumpWarehouseList(startRow: number, worksheet: Excel.Worksheet) {
        const warehouseModels: IWarehouseModel[] = [];

        while (worksheet.getCell("A" + startRow).value) {
            const warehouseModel: IWarehouseModel = {} as IWarehouseModel;

            // find product name
            const productType = worksheet.getCell("A" + startRow).value;
            this.state.productTypes.forEach((element) => {
                if (element.name === productType) {
                    warehouseModel.product_type = element;
                }
            });

            // find product name
            const productName = worksheet.getCell("B" + startRow).value;
            this.state.productNames.forEach((element) => {
                if (element.name === productName) {
                    const warehouseProductTypeId = (
                        warehouseModel.product_type as IProductTypeModel
                    )._id;
                    (element.product_type as IProductTypeModel[]).forEach(
                        (e: IProductTypeModel) => {
                            if (e._id === warehouseProductTypeId) {
                                warehouseModel.product_name = element;
                            }
                        }
                    );
                }
            });

            // find thickness
            const thickness = worksheet.getCell("C" + startRow).value;
            this.state.thicknesses.forEach((element) => {
                if (
                    thickness === element.name &&
                    (element.product_name as IProductNameModel)._id ===
                        (warehouseModel.product_name as IProductNameModel)._id
                ) {
                    console.log("thickness");
                    warehouseModel.thickness = element;
                }
            });

            // find system standard
            const systemStandard = worksheet.getCell("E" + startRow).value;
            this.state.systemStandards.forEach((element) => {
                if (systemStandard === element.name) {
                    warehouseModel.system_standard = element;
                }
            });

            // find standard
            const standard = worksheet.getCell("F" + startRow).value;
            this.state.standards.forEach((element) => {
                if (
                    standard === element.name &&
                    (element.system_standard as ISystemStandardModel)._id ===
                        (warehouseModel.system_standard as ISystemStandardModel)._id
                ) {
                    warehouseModel.standard = element;
                }
            });

            // find size
            const size = worksheet.getCell("G" + startRow).value;
            if ((warehouseModel.product_type as IProductTypeModel).form_type === FormType.FORM_1) {
                // save size standard
                this.state.sizes.forEach((element) => {
                    if (size === element.name) {
                        warehouseModel.size = element;
                    }
                });
            } else if (
                (warehouseModel.product_type as IProductTypeModel).form_type === FormType.FORM_2
            ) {
                // save size non standard
                const size: ISizeModel = {
                    form_type: FormType.FORM_2,
                } as ISizeModel;

                const shape: GasketPTCShape = worksheet.getCell("H" + startRow)
                    .value as GasketPTCShape;
                size.shape_type = shape;
                switch (shape) {
                    case GasketPTCShape.RF_CIRCLE: {
                        size.inner_diameter = worksheet.getCell("I" + startRow).value as number;
                        size.outer_diameter = worksheet.getCell("J" + startRow).value as number;
                        break;
                    }
                    case GasketPTCShape.FF_CIRCLE: {
                        size.inner_diameter = worksheet.getCell("I" + startRow).value as number;
                        size.outer_diameter = worksheet.getCell("J" + startRow).value as number;
                        size.hole_count = worksheet.getCell("Q" + startRow).value as number;
                        size.hole_diameter = worksheet.getCell("R" + startRow).value as number;
                        break;
                    }
                    case GasketPTCShape.RF_RECTANGLE: {
                        size.wn = worksheet.getCell("K" + startRow).value as number;
                        size.wt = worksheet.getCell("L" + startRow).value as number;
                        size.ln = worksheet.getCell("M" + startRow).value as number;
                        size.lt = worksheet.getCell("N" + startRow).value as number;
                        break;
                    }
                    case GasketPTCShape.FF_RECTANGLE: {
                        size.wn = worksheet.getCell("K" + startRow).value as number;
                        size.wt = worksheet.getCell("L" + startRow).value as number;
                        size.ln = worksheet.getCell("M" + startRow).value as number;
                        size.lt = worksheet.getCell("N" + startRow).value as number;
                        size.hole_count = worksheet.getCell("Q" + startRow).value as number;
                        size.hole_diameter = worksheet.getCell("R" + startRow).value as number;
                        break;
                    }
                    case GasketPTCShape.FF_MANHOLE: {
                        size.wn = worksheet.getCell("K" + startRow).value as number;
                        size.ln = worksheet.getCell("M" + startRow).value as number;
                        size.ir = worksheet.getCell("O" + startRow).value as number;
                        size.or = worksheet.getCell("P" + startRow).value as number;
                        size.hole_count = worksheet.getCell("Q" + startRow).value as number;
                        size.hole_diameter = worksheet.getCell("R" + startRow).value as number;
                        break;
                    }
                }
                warehouseModel.size = size;
            } else {
                // save size of roll material
                const size: ISizeModel = {
                    form_type: FormType.FORM_3,
                    wt: worksheet.getCell("L" + startRow).value as number,
                    lt: worksheet.getCell("N" + startRow).value as number,
                } as ISizeModel;
                warehouseModel.size = size;
            }

            // amount
            const amount = worksheet.getCell("S" + startRow).value;
            if (amount) {
                warehouseModel.amount = parseInt(amount.toString(), 10);
            } else {
                warehouseModel.amount = 0;
            }

            const price = worksheet.getCell("T" + startRow).value;
            if (price) {
                warehouseModel.price = parseInt(price.toString(), 10);
            } else {
                // warehouseModel.price = 0;
            }

            warehouseModels.push(warehouseModel);

            startRow += 1;
        }

        this.setState(
            {
                warehouses: warehouseModels,
            },
            () => {
                console.log(warehouseModels);
                if (!this.state.warehouses.length) {
                    this.props.appDialogContext.addDialog({
                        title: this.props.languageContext.current.getMessageString(
                            MessageId.INPUT_FILE_NOT_SUITABLE
                        ),
                        content: this.props.languageContext.current.getMessageString(
                            MessageId.INPUT_FILE_NOT_SUITABLE_CONTENT
                        ),
                    });
                }
            }
        );
    }

    onFileInputChange(evt: any) {
        const files = evt.target.files;
        const f = files[0];

        const reader = new FileReader();
        reader.onload = (e: any) => {
            var data = new Uint8Array(e.target.result);
            this.loadWorkbook(data);
            /* DO SOMETHING WITH workbook HERE */
        };
        reader.readAsArrayBuffer(f);

        this.warehouseImportByExcelFormRef.inputFile.current.value = "";
    }

    tableHeader(): string[] {
        return [
            this.props.languageContext.current.getMessageString(MessageId.PRODUCT_TYPE),
            this.props.languageContext.current.getMessageString(MessageId.PRODUCT_NAME),
            this.props.languageContext.current.getMessageString(MessageId.INNER_DIAMETER),
            this.props.languageContext.current.getMessageString(MessageId.OUTER_DIAMETER),
            this.props.languageContext.current.getMessageString(MessageId.WN_DIAMETER),
            this.props.languageContext.current.getMessageString(MessageId.WT_DIAMETER),
            this.props.languageContext.current.getMessageString(MessageId.LN_DIAMETER),
            this.props.languageContext.current.getMessageString(MessageId.LT_DIAMETER),
            this.props.languageContext.current.getMessageString(MessageId.IR_DIAMETER),
            this.props.languageContext.current.getMessageString(MessageId.OR_DIAMETER),
            this.props.languageContext.current.getMessageString(MessageId.HOLE_COUNT),
            this.props.languageContext.current.getMessageString(MessageId.HOLE_DIAMETER),
            this.props.languageContext.current.getMessageString(MessageId.SYSTEM_STANDARD),
            this.props.languageContext.current.getMessageString(MessageId.STANDARD),
            this.props.languageContext.current.getMessageString(MessageId.AMOUNT),
            this.props.languageContext.current.getMessageString(MessageId.PRICE),
        ];
    }

    tableContent(): ITableCellModel[] {
        const tableCells: ITableCellModel[] = [];

        this.state.warehouses.forEach((element) => {
            const size = element.size as ISizeModel;
            tableCells.push({
                id: FrameworkUtils.generateUniqueKey(),
                content: [
                    (element.product_type as IProductTypeModel)?.name,
                    (element.product_name as IProductNameModel)?.name,
                    size?.inner_diameter?.toString(),
                    size?.outer_diameter?.toString(),
                    size?.wn?.toString(),
                    size?.wt?.toString(),
                    size?.ln?.toString(),
                    size?.lt?.toString(),
                    size?.ir?.toString(),
                    size?.or?.toString(),
                    size?.hole_count?.toString(),
                    size?.hole_diameter?.toString(),
                    (element.system_standard as ISystemStandardModel)?.name,
                    (element.standard as IStandardModel)?.name,
                    element.amount?.toString(),
                    element.price?.toString(),
                ],
            });
        });

        return tableCells;
    }

    onCancel() {
        this.setState({
            warehouses: [],
        });
    }

    onImportToWarehouse() {
        if (this.validateWarehouseList()) {
            this.saveWarehouse(0);
        }
    }

    saveWarehouse(index: number) {
        if (index < this.state.warehouses.length) {
            const element = this.state.warehouses[index];

            if ((element.product_type as IProductTypeModel).form_type === FormType.FORM_1) {
                this.warehouseApiService
                    .save({
                        product_type: (element.product_type as IProductTypeModel)._id,
                        product_name: (element.product_name as IProductNameModel)._id,
                        thickness: (element.thickness as IThicknessModel)._id,
                        system_standard: (element.system_standard as ISystemStandardModel)._id,
                        standard: (element.standard as IStandardModel)._id,
                        size: (element.size as ISizeModel)._id,
                        amount: element.amount,
                        price: element.price,
                    } as IWarehouseModel)
                    .then((response) => {
                        this.saveWarehouse(index + 1);
                    });
            } else {
                const warehouseItem: IWarehouseModel = {
                    product_name: (element.product_name as IProductNameModel)._id,
                    product_type: (element.product_type as IProductTypeModel)._id,
                    thickness: (element.thickness as IThicknessModel)._id,
                    amount: element.amount,
                    price: element.price,
                } as IWarehouseModel;

                const size = element.size as ISizeModel;
                this.warehouseApiService
                    .all({
                        product_type: warehouseItem.product_type,
                        product_name: warehouseItem.product_name,
                        thickness: warehouseItem.thickness,
                    } as IWarehouseModel)
                    .then((response) => {
                        if (response.status === HttpRequestStatusCode.OK) {
                            const dataResponse = response.data.data as IWarehouseModel[];
                            if (dataResponse.length > 0) {
                                dataResponse.forEach((element) => {
                                    const sizeElement = element.size as ISizeModel;

                                    if (AppUtils.compare2Size(size, sizeElement)) {
                                        warehouseItem.size = sizeElement._id;
                                    }
                                });

                                if (warehouseItem.size) {
                                    console.log("No save size");
                                    this.warehouseApiService
                                        .save(warehouseItem)
                                        .then((response) => {
                                            this.saveWarehouse(index + 1);
                                        });
                                } else {
                                    console.log("Save size");
                                    this.sizeApiService.save(size).then((response) => {
                                        if (response.status === HttpRequestStatusCode.CREATED) {
                                            warehouseItem.size = (
                                                response.data.data as ISizeModel
                                            )._id;
                                            this.warehouseApiService
                                                .save(warehouseItem)
                                                .then((response) => {
                                                    this.saveWarehouse(index + 1);
                                                });
                                        }
                                    });
                                }
                            } else {
                                console.log("== 0");
                                console.log("size size");
                                this.sizeApiService.save(size).then((response) => {
                                    if (response.status === HttpRequestStatusCode.CREATED) {
                                        warehouseItem.size = (response.data.data as ISizeModel)._id;
                                        this.warehouseApiService
                                            .save(warehouseItem)
                                            .then((response) => {
                                                this.saveWarehouse(index + 1);
                                            });
                                    }
                                });
                            }
                        }
                    });
            }
        } else if (index > 0 && index >= this.state.warehouses.length) {
            this.props.appDialogContext.addDialog({
                title: this.props.languageContext.current.getMessageString(
                    MessageId.IMPORT_WAREHOUSE_SUCCESS
                ),
                content: this.props.languageContext.current.getMessageString(
                    MessageId.IMPORT_WAREHOUSE_SUCCESS_DETAIL
                ),
            });
            this.props.appUrlContext.redirectTo(RouteConstant.WAREHOUSE);
        }
    }

    validateWarehouseList() {
        let isValid = true;
        this.state.warehouses.forEach((element) => {
            if ((element.product_type as IProductTypeModel).form_type === FormType.FORM_1) {
                if (
                    !element.product_name ||
                    !element.thickness ||
                    !element.system_standard ||
                    !element.standard ||
                    !element.size
                ) {
                    this.alertInputFileNotSuitable();
                    isValid = false;
                }
            } else if ((element.product_type as IProductTypeModel).form_type === FormType.FORM_2) {
                if (!element.product_name || !element.thickness || !element.size) {
                    this.alertInputFileNotSuitable();
                    isValid = false;
                } else {
                    const size: ISizeModel = element.size as ISizeModel;

                    switch (size.shape_type) {
                        case GasketPTCShape.RF_CIRCLE: {
                            if (!size.inner_diameter || !size.outer_diameter) {
                                this.alertInputFileNotSuitable();
                                isValid = false;
                            }
                            break;
                        }
                        case GasketPTCShape.FF_CIRCLE: {
                            if (
                                !size.inner_diameter ||
                                !size.outer_diameter ||
                                !size.hole_count ||
                                !size.hole_diameter
                            ) {
                                this.alertInputFileNotSuitable();
                                isValid = false;
                            }
                            break;
                        }
                        case GasketPTCShape.RF_RECTANGLE: {
                            if (!size.wn || !size.wt || !size.ln || !size.lt) {
                                this.alertInputFileNotSuitable();
                                isValid = false;
                            }
                            break;
                        }
                        case GasketPTCShape.FF_RECTANGLE: {
                            if (
                                !size.wn ||
                                !size.wt ||
                                !size.ln ||
                                !size.lt ||
                                !size.hole_count ||
                                !size.hole_diameter
                            ) {
                                this.alertInputFileNotSuitable();
                                isValid = false;
                            }
                            break;
                        }
                        case GasketPTCShape.FF_MANHOLE: {
                            if (
                                !size.wn ||
                                !size.ln ||
                                !size.hole_count ||
                                !size.hole_diameter ||
                                !size.ir ||
                                !size.or
                            ) {
                                this.alertInputFileNotSuitable();
                                isValid = false;
                            }
                        }
                    }
                }
            } else if ((element.product_type as IProductTypeModel).form_type === FormType.FORM_3) {
                if (!element.product_name || !element.thickness || !element.size) {
                    this.alertInputFileNotSuitable();
                    isValid = false;
                } else {
                    const size: ISizeModel = element.size as ISizeModel;
                    if (!size.wn || !size.ln) {
                        this.alertInputFileNotSuitable();
                        isValid = false;
                    }
                }
            } else {
                this.alertInputFileNotSuitable();
                isValid = false;
            }
        });

        return isValid;
    }

    alertInputFileNotSuitable() {
        this.props.appDialogContext.addDialog({
            title: this.props.languageContext.current.getMessageString(
                MessageId.INPUT_FILE_NOT_SUITABLE
            ),
            content: this.props.languageContext.current.getMessageString(
                MessageId.INPUT_FILE_NOT_SUITABLE_CONTENT
            ),
        });
    }

    render() {
        return (
            <FrameworkComponents.BasePage>
                <FrameworkComponents.FormGroup>
                    {!this.state.warehouses.length && (
                        <input
                            type="file"
                            onChange={this.onFileInputChange}
                            ref={this.warehouseImportByExcelFormRef.inputFile}
                            disabled={this.state.taskCount < 6}
                        />
                    )}
                </FrameworkComponents.FormGroup>
                {this.state.warehouses.length > 0 && (
                    <FrameworkComponents.Table
                        header={this.tableHeader()}
                        content={this.tableContent()}
                    />
                )}
                {this.state.warehouses.length > 0 && (
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.Button
                            type={ButtonTypeConstant.FLAT}
                            onClick={this.onCancel}
                        >
                            {this.props.languageContext.current.getMessageString(MessageId.CANCEL)}
                        </FrameworkComponents.Button>
                        <FrameworkComponents.Button
                            type={ButtonTypeConstant.PRIMARY}
                            onClick={this.onImportToWarehouse}
                            dialogModel={{
                                title: this.props.languageContext.current.getMessageString(
                                    MessageId.CONFIRM_DATA
                                ),
                                content: this.props.languageContext.current.getMessageString(
                                    MessageId.CONFIRM_DATA
                                ),
                            }}
                        >
                            {this.props.languageContext.current.getMessageString(
                                MessageId.IMPORT_WAREHOUSE
                            )}
                        </FrameworkComponents.Button>
                    </FrameworkComponents.FormGroup>
                )}
            </FrameworkComponents.BasePage>
        );
    }
}

export default WithFramework.withLanguage(
    WithFramework.withAppDialog(WithFramework.withAppUrl(WarehouseImportByExcelFile))
);
