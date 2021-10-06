import WarehouseApiService from "app/api/WarehouseApiService";
import IProductNameModel from "app/documents/IProductNameModel";
import IProductTypeModel from "app/documents/IProductTypeModel";
import ISizeModel from "app/documents/ISizeModel";
import IStandardModel from "app/documents/IStandardModel";
import ISystemStandardModel from "app/documents/ISystemStandardModel";
import IThicknessModel from "app/documents/IThicknessModel";
import IWarehouseModel from "app/documents/IWarehouseModel";
import FrameworkComponents from "framework/components/FrameworkComponents";
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant";
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode";
import MessageId from "framework/constants/MessageId";
import RouteConstant from "framework/constants/RouteConstant";
import { UserRole } from "framework/constants/UserEnumConstant";
import WithFramework from "framework/constants/WithFramework";
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext";
import ILanguageContext from "framework/contexts/lang/ILanguageContext";
import IAppUrlContext from "framework/contexts/url/IAppUrlContext";
import IUserLoginContext from "framework/contexts/user/IUserLoginContext";
import ITableCellModel from "framework/documents/ui/ITableCellModel";
import FrameworkUtils from "framework/utils/FrameworkUtils";
import React from "react";

interface WarehouseProps {
    languageContext: ILanguageContext;
    appDialogContext: IAppDialogContext;
    appUrlContext: IAppUrlContext;
    userLoginContext: IUserLoginContext;
}

interface WarehouseState {
    items: IWarehouseModel[];
}

class WarehousePage extends React.Component<WarehouseProps, WarehouseState> {
    private warehouseApiService: WarehouseApiService;

    constructor(props: WarehouseProps) {
        super(props);

        this.warehouseApiService = new WarehouseApiService();
        this.state = {
            items: [],
        };

        this.all = this.all.bind(this)
        this.tableHeader = this.tableHeader.bind(this);
        this.editWarehouse = this.editWarehouse.bind(this);
        this.deleteWarehouse = this.deleteWarehouse.bind(this);
    }

    componentDidMount() {
        this.all()
    }

    all() {
        this.warehouseApiService
            .all({
                amount: {
                    $ne: 0,
                },
            })
            .then((response) => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        items: response.data.data as IWarehouseModel[],
                    });
                }
            });
    }

    tableHeader(): string[] {
        return [
            this.props.languageContext.current.getMessageString(MessageId.ACTION),
            this.props.languageContext.current.getMessageString(MessageId.PRODUCT_TYPE),
            this.props.languageContext.current.getMessageString(MessageId.PRODUCT_NAME),
            this.props.languageContext.current.getMessageString(MessageId.THICKNESS),
            this.props.languageContext.current.getMessageString(MessageId.AMOUNT),
            this.props.languageContext.current.getMessageString(MessageId.SYSTEM_STANDARD),
            this.props.languageContext.current.getMessageString(MessageId.STANDARD),
            this.props.languageContext.current.getMessageString(MessageId.SIZE),
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
            this.props.languageContext.current.getMessageString(MessageId.PRICE)
        ];
    }

    tableContent(): ITableCellModel[] {
        const tableCells: ITableCellModel[] = [];

        this.state.items.forEach((element) => {
            const size = element.size as ISizeModel;
            tableCells.push({
                id: element._id,
                content: [
                    (element.product_type as IProductTypeModel)?.name,
                    (element.product_name as IProductNameModel)?.name,
                    (element.thickness as IThicknessModel)?.name,
                    element.amount?.toString(),
                    (element.system_standard as ISystemStandardModel)?.name,
                    (element.standard as IStandardModel)?.name,
                    size?.name,
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
                    element.price?.toLocaleString()
                ],
                action: {
                    choose: {
                        isAlive: true,
                        func: this.editWarehouse,
                    },
                    delete: {
                        isAlive: this.props.userLoginContext.current.isLoggedIn() && this.props.userLoginContext.state.user.role === UserRole.ADMIN,
                        func: this.deleteWarehouse,
                        dialog: {
                            title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE),
                            content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE_DETAIL)
                        }
                    },
                },
            });
        });

        return tableCells;
    }

    editWarehouse(id: string) {
        this.props.appUrlContext.redirectTo(
            FrameworkUtils.generatePath(RouteConstant.WAREHOUSE_ITEM_DETAIL, {
                id: id,
            })
        );
    }

    deleteWarehouse(id: string) {
        this.warehouseApiService.delete(id)
            .then(response => {
                this.all()
            })
    }

    render() {
        return (
            <FrameworkComponents.BasePage
                {...{
                    title: this.props.languageContext.current.getMessageString(MessageId.WAREHOUSE),
                }}
            >
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.Button
                        type={ButtonTypeConstant.FLAT}
                        onClick={() => {
                            this.props.appUrlContext.redirectTo(RouteConstant.WAREHOUSE_IMPORT);
                        }}
                    >
                        {this.props.languageContext.current.getMessageString(MessageId.IMPORT_WAREHOUSE)}
                    </FrameworkComponents.Button>
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.Table header={this.tableHeader()} content={this.tableContent()} />
            </FrameworkComponents.BasePage>
        );
    }
}

export default WithFramework.withLanguage(WithFramework.withAppDialog(WithFramework.withAppUrl(WithFramework.withUserLogin(WarehousePage))));
