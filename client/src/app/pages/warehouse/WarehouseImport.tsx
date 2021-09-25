import ProductNameApiService from "app/api/ProductNameApiService";
import ProductTypeApiService from "app/api/ProductTypeApiService";
import SizeApiService from "app/api/SizeApiService";
import StandardApiService from "app/api/StandardApiService";
import SystemStandardApiService from "app/api/SystemStandardApiService";
import ThicknessApiService from "app/api/ThicknessApiService";
import WarehouseApiService from "app/api/WarehouseApiService";
import Form1 from "app/components/form/Form1";
import Form2 from "app/components/form/Form2";
import Form3 from "app/components/form/Form3";
import IProductNameModel from "app/documents/IProductNameModel";
import IProductTypeModel from "app/documents/IProductTypeModel";
import ISizeModel from "app/documents/ISizeModel";
import IStandardModel from "app/documents/IStandardModel";
import ISystemStandardModel from "app/documents/ISystemStandardModel";
import IThicknessModel from "app/documents/IThicknessModel";
import IWarehouseModel from "app/documents/IWarehouseModel";
import AppRenderUtils from "app/utils/AppRenderUtils";
import FrameworkComponents from "framework/components/FrameworkComponents";
import IFormInputElement from "framework/components/IFormInputElement";
import AppConstant from "framework/constants/AppConstant";
import { FormType } from "framework/constants/AppEnumConstant";
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant";
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode";
import MessageId from "framework/constants/MessageId";
import RouteConstant from "framework/constants/RouteConstant";
import RuleConstant from "framework/constants/RuleConstant";
import WithFramework from "framework/constants/WithFramework";
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext";
import ILanguageContext from "framework/contexts/lang/ILanguageContext";
import IAppUrlContext from "framework/contexts/url/IAppUrlContext";
import Rule from "framework/documents/models/Rule";
import FrameworkUtils from "framework/utils/FrameworkUtils";
import React from "react";

interface WarehouseImportProps {
    languageContext: ILanguageContext;
    appDialogContext: IAppDialogContext;
    appUrlContext: IAppUrlContext;
}

interface WarehouseState {
    productTypes: IProductTypeModel[];
    productNames: IProductNameModel[];
    formType: FormType;
    thicknesses: IThicknessModel[];
    thicknessSelected: IThicknessModel;
    systemStandards: ISystemStandardModel[];
    standards: IStandardModel[];
    standardSelected: IStandardModel;
    sizes: ISizeModel[];
    sizeSelected: ISizeModel;
}

interface IWarehouseImportFormRef {
    productType: React.RefObject<any>;
    productName: React.RefObject<any>;
    thickness: React.RefObject<any>;
    priceSquareMeter: React.RefObject<any>;
    systemStandard: React.RefObject<any>;
    standard: React.RefObject<any>;
    size: React.RefObject<any>;
    form: React.RefObject<any>;
    amount: React.RefObject<any>;
}

class WarehouseImport extends React.Component<WarehouseImportProps, WarehouseState> {
    private productTypeApiService: ProductTypeApiService;
    private productNameApiService: ProductNameApiService;
    private thicknessApiService: ThicknessApiService;
    private standardApiService: StandardApiService;
    private systemStandardApiService: SystemStandardApiService;
    private sizeApiService: SizeApiService;
    private warehouseImportFormRef: IWarehouseImportFormRef;
    private warehouseApiService: WarehouseApiService

    constructor(props: WarehouseImportProps) {
        super(props);

        this.productTypeApiService = new ProductTypeApiService();
        this.productNameApiService = new ProductNameApiService();
        this.thicknessApiService = new ThicknessApiService();
        this.standardApiService = new StandardApiService();
        this.systemStandardApiService = new SystemStandardApiService();
        this.sizeApiService = new SizeApiService();
        this.warehouseApiService = new WarehouseApiService()
        this.state = {
            productTypes: [],
            productNames: [],
            formType: undefined as unknown as FormType,
            thicknesses: [],
            thicknessSelected: {} as IThicknessModel,
            systemStandards: [],
            standards: [],
            standardSelected: {} as IStandardModel,
            sizes: [],
            sizeSelected: {} as ISizeModel,
        };

        this.warehouseImportFormRef = {
            productType: React.createRef<IFormInputElement>(),
            productName: React.createRef<IFormInputElement>(),
            thickness: React.createRef<IFormInputElement>(),
            priceSquareMeter: React.createRef<IFormInputElement>(),
            systemStandard: React.createRef<IFormInputElement>(),
            standard: React.createRef<IFormInputElement>(),
            size: React.createRef<IFormInputElement>(),
            form: React.createRef<IFormInputElement>(),
            amount: React.createRef<IFormInputElement>(),
        };

        this.productTypeOnChanged = this.productTypeOnChanged.bind(this);
        this.productNameOnChanged = this.productNameOnChanged.bind(this);
        this.thicknessOnChanged = this.thicknessOnChanged.bind(this);
        this.systemStandardOnChanged = this.systemStandardOnChanged.bind(this);
        this.standardOnChanged = this.standardOnChanged.bind(this);
        this.sizeOnChanged = this.sizeOnChanged.bind(this);
        this.onCancel = this.onCancel.bind(this)
        this.onImport = this.onImport.bind(this)
        this.firstSetup = this.firstSetup.bind(this)
        this.downloadTemplateFile = this.downloadTemplateFile.bind(this)
    }

    componentDidMount() {
        this.firstSetup()
    }

    firstSetup() {
        this.productTypeApiService.all().then((response) => {
            if (response.status === HttpRequestStatusCode.OK) {
                this.setState({
                    productTypes: response.data.data as IProductTypeModel[],
                });
            }
        });

        // get system standard
        this.systemStandardApiService.all().then((response) => {
            if (response.status === HttpRequestStatusCode.OK) {
                this.setState({
                    systemStandards: response.data.data as ISystemStandardModel[],
                });
            }
        });

        // this.sizeApiService.all().then((response) => {
        //     if (response.status === HttpRequestStatusCode.OK) {
        //         this.setState({
        //             sizes: response.data.data as ISizeModel[],
        //         });
        //     }
        // });
    }

    productTypeOnChanged(id: string) {
        this.state.productTypes.forEach((e) => {
            if (id === e._id) {
                this.setState({
                    formType: e.form_type,
                });
            }
        });

        // get product names
        this.productNameApiService
            .all({
                product_type: {
                    $in: [id],
                },
            })
            .then((response) => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        productNames: response.data.data as IProductNameModel[],
                    });
                }
            });
    }

    productNameOnChanged(id: string) {
        // get thickness
        this.thicknessApiService
            .all({
                product_name: {
                    $in: [id],
                },
            })
            .then((response) => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        thicknesses: response.data.data as IThicknessModel[],
                    });
                }
            });
    }

    thicknessOnChanged(id: string) {
        this.state.thicknesses.forEach((element) => {
            if (element._id === id) {
                this.setState({
                    thicknessSelected: element,
                });
            }
        });
    }

    systemStandardOnChanged(id: string) {
        this.standardApiService
            .all({
                system_standard: {
                    $in: [id],
                },
            })
            .then((response) => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        standards: response.data.data as IStandardModel[],
                    });
                }
            });
    }

    standardOnChanged(id: string) {
        this.state.standards.forEach((element) => {
            if (element._id === id) {
                this.setState({
                    standardSelected: element,
                });
            }
        });

        this.sizeApiService.all({
            system_standard: this.warehouseImportFormRef.systemStandard.current.getValue(),
            standard: id,
        })
        .then(response => {
            this.setState({
                sizes: response.data.data as ISizeModel[]
            })
        })
    }

    sizeOnChanged(id: string) {
        this.state.sizes.forEach((element) => {
            if (element._id === id) {
                this.setState({
                    sizeSelected: element,
                });
            }
        });
    }

    onCancel() {
        FrameworkUtils.formClear(this.warehouseImportFormRef)
        this.setState({
            productTypes: [],
            productNames: [],
            formType: undefined as unknown as FormType,
            thicknesses: [],
            thicknessSelected: {} as IThicknessModel,
            systemStandards: [],
            standards: [],
            standardSelected: {} as IStandardModel,
            sizes: [],
            sizeSelected: {} as ISizeModel,
        });

        this.firstSetup()
    }

    onImport() {
        if (FrameworkUtils.validateFrom(this.warehouseImportFormRef)) {
            const warehouseItem: IWarehouseModel = {
                product_name: this.warehouseImportFormRef.productName.current.getValue(),
                product_type: this.warehouseImportFormRef.productType.current.getValue(),
                thickness: this.warehouseImportFormRef.thickness.current.getValue(),
                amount: parseFloat(this.warehouseImportFormRef.amount.current.getValue())
            } as IWarehouseModel

            if (this.state.formType === FormType.FORM_1) {
                warehouseItem.size = this.state.sizeSelected._id
                warehouseItem.system_standard = this.warehouseImportFormRef.systemStandard.current.getValue()
                warehouseItem.standard = this.warehouseImportFormRef.standard.current.getValue()
                this.onImportProductToWarehouse(warehouseItem)
            } else {
                const size = this.warehouseImportFormRef.form.current.getValue()
                this.sizeApiService.save(size)
                    .then(response => {
                        if (response.status === HttpRequestStatusCode.CREATED) {
                            warehouseItem.size = (response.data.data as ISizeModel)._id
                            this.onImportProductToWarehouse(warehouseItem)
                        }
                    })
            }
        }
    }

    onImportProductToWarehouse(warehouse: IWarehouseModel) {
        this.warehouseApiService.save(warehouse)
            .then(response => {
                if (response.status === HttpRequestStatusCode.CREATED) {
                    this.props.appDialogContext.addDialog({
                        title: this.props.languageContext.current.getMessageString(MessageId.IMPORT_WAREHOUSE_SUCCESS),
                        content: this.props.languageContext.current.getMessageString(MessageId.IMPORT_WAREHOUSE_SUCCESS_DETAIL)
                    })
                    this.onCancel()
                } else {
                    this.props.appDialogContext.addDialog({
                        title: this.props.languageContext.current.getMessageString(MessageId.IMPORT_WAREHOUSE_FAILED),
                        content: this.props.languageContext.current.getMessageString(MessageId.IMPORT_WAREHOUSE_FAILED_DETAIL)
                    })
                }
            })
            .catch(error => {
                this.props.appDialogContext.addDialog({
                    title: this.props.languageContext.current.getMessageString(MessageId.SERVER_ERROR),
                    content: this.props.languageContext.current.getMessageString(MessageId.SERVER_ERROR_CONTENT)
                })
            })
    }

    downloadTemplateFile() {
        // window.location.assign("http://localhost:3002/resources/warehouse.xlsx")
        this.warehouseApiService.downloadTemplateFile()
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    window.location.assign(response.data.data.url)
                    // window.open(response.data.data.url)
                }
            })
    }

    render() {
        return (
            <FrameworkComponents.BasePage
                {...{
                    title: this.props.languageContext.current.getMessageString(MessageId.IMPORT_WAREHOUSE),
                }}
            >
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.Button type={ButtonTypeConstant.FLAT} onClick={() => {
                        this.props.appUrlContext.redirectTo(RouteConstant.WAREHOUSE_IMPORT_EXCEL_FILE)
                    }}>
                        {this.props.languageContext.current.getMessageString(MessageId.UPLOAD_FILE)}
                    </FrameworkComponents.Button>
                    <FrameworkComponents.Button type={ButtonTypeConstant.FLAT} onClick={this.downloadTemplateFile}>
                        {this.props.languageContext.current.getMessageString(MessageId.DOWNLOAD_TEMPLATE_FILE)}
                    </FrameworkComponents.Button>
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <h2>{this.props.languageContext.current.getMessageString(MessageId.OR)}</h2>
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.BaseForm>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.SelectBox
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.PRODUCT_TYPE)}
                            options={AppRenderUtils.renderProductTypeSelectBox(this.state.productTypes)}
                            onChanged={this.productTypeOnChanged}
                            required={true}
                            disable={!this.state.productTypes.length}
                            errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)}
                            ref={this.warehouseImportFormRef.productType}
                        />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.SelectBox
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.PRODUCT_NAME)}
                            options={AppRenderUtils.renderProductNameSelectBox(this.state.productNames)}
                            onChanged={this.productNameOnChanged}
                            disable={!this.state.productNames.length}
                            required={true}
                            errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)}
                            ref={this.warehouseImportFormRef.productName}
                        />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.SelectBox
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.THICKNESS)}
                            options={AppRenderUtils.renderThicknessSelectBox(this.state.thicknesses)}
                            onChanged={this.thicknessOnChanged}
                            disable={!this.state.thicknesses.length}
                            required={true}
                            errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)}
                            ref={this.warehouseImportFormRef.thickness}
                        />
                        <FrameworkComponents.InputText
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.M2_PRICE)}
                            value={this.state.thicknessSelected.price}
                            readOnly={!this.state.thicknessSelected.price}
                            ref={this.warehouseImportFormRef.priceSquareMeter}
                        />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.SelectBox
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.SYSTEM_STANDARD)}
                            options={AppRenderUtils.renderSystemStandard(this.state.systemStandards)}
                            onChanged={this.systemStandardOnChanged}
                            required={true}
                            disable={!this.state.systemStandards.length || this.state.formType !== FormType.FORM_1}
                            errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)}
                            ref={this.warehouseImportFormRef.systemStandard}
                        />
                        <FrameworkComponents.SelectBox
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.STANDARD)}
                            options={AppRenderUtils.renderStandard(this.state.standards)}
                            required={true}
                            disable={!this.state.standards.length || this.state.formType !== FormType.FORM_1}
                            errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)}
                            onChanged={this.standardOnChanged}
                            ref={this.warehouseImportFormRef.standard}
                        />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.SelectBox
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.SIZE)}
                            options={AppRenderUtils.renderSizeSelectBox(this.state.sizes)}
                            required={true}
                            disable={!this.state.sizes.length || this.state.formType !== FormType.FORM_1}
                            errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)}
                            onChanged={this.sizeOnChanged}
                            ref={this.warehouseImportFormRef.size}
                        />
                    </FrameworkComponents.FormGroup>
                </FrameworkComponents.BaseForm>
                {this.state.formType === FormType.FORM_1 && this.state.sizeSelected._id && this.state.standardSelected._id && (
                    <Form1
                        title={this.props.languageContext.current.getMessageString(MessageId.PRODUCT_INFORMATION)}
                        languageContext={this.props.languageContext}
                        isCalculatorModel={true}
                        size={this.state.sizeSelected}
                        standard={this.state.standardSelected}
                        ref={this.warehouseImportFormRef.form}
                    />
                )}

                {this.state.formType === FormType.FORM_2 && (
                    <Form2
                        title={this.props.languageContext.current.getMessageString(MessageId.PRODUCT_INFORMATION)}
                        languageContext={this.props.languageContext}
                        isCalculatorModel={true}
                        ref={this.warehouseImportFormRef.form}
                    />
                )}

                {this.state.formType === FormType.FORM_3 && (
                    <Form3
                        languageContext={this.props.languageContext}
                        title={this.props.languageContext.current.getMessageString(MessageId.PRODUCT_INFORMATION)}
                        ref={this.warehouseImportFormRef.form}
                    />
                )}

                <FrameworkComponents.BaseForm>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.InputText
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.AMOUNT)}
                            ref={this.warehouseImportFormRef.amount}
                            validate={[
                                new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE),
                                new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_NUMBER, new RegExp(AppConstant.ONLY_NUMBER_REGEXP)),
                            ]}
                        />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.Button type={ButtonTypeConstant.FLAT} onClick={this.onCancel}>
                            {this.props.languageContext.current.getMessageString(MessageId.CANCEL)}
                        </FrameworkComponents.Button>
                        <FrameworkComponents.Button type={ButtonTypeConstant.PRIMARY} onClick={this.onImport} dialogModel={{
                            title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_DATA),
                            content: ""
                        }}>
                            {this.props.languageContext.current.getMessageString(MessageId.IMPORT_WAREHOUSE)}
                        </FrameworkComponents.Button>
                    </FrameworkComponents.FormGroup>
                </FrameworkComponents.BaseForm>
            </FrameworkComponents.BasePage>
        );
    }
}

export default WithFramework.withLanguage(WithFramework.withAppDialog(WithFramework.withAppUrl(WarehouseImport)));
