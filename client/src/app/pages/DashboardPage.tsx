import React from "react";
import FrameworkComponents from "framework/components/FrameworkComponents";
import WithFramework from "framework/constants/WithFramework";
import ILanguageContext from "framework/contexts/lang/ILanguageContext";
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext";
import IAppUrlContext from "framework/contexts/url/IAppUrlContext";
import IWarehouseModel from "app/documents/IWarehouseModel";
import MessageId from "framework/constants/MessageId";
import ITableCellModel from "framework/documents/ui/ITableCellModel";
import WarehouseApiService from "app/api/WarehouseApiService";
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode";
import IProductTypeModel from "app/documents/IProductTypeModel";
import RouteConstant from "framework/constants/RouteConstant";
import IProductNameModel from "app/documents/IProductNameModel";
import IThicknessModel from "app/documents/IThicknessModel";
import ISystemStandardModel from "app/documents/ISystemStandardModel";
import ISizeModel from "app/documents/ISizeModel";
import IStandardModel from "app/documents/IStandardModel";
import { TableRowColor } from "framework/constants/AppEnumConstant";

interface ProductTypeDetailProps {
    languageContext: ILanguageContext;
    appDialogContext: IAppDialogContext;
    appUrlContext: IAppUrlContext;
}

interface ProductTypeDetailState {
	warehouseItemRunningOut: IWarehouseModel[]
}

class DashboardPage extends React.Component<ProductTypeDetailProps, ProductTypeDetailState> {
	private warehouseApiService: WarehouseApiService;

	constructor(props: ProductTypeDetailProps) {
		super(props)

		this.warehouseApiService = new WarehouseApiService();

		this.state = {
			warehouseItemRunningOut: []
		}
	}

	componentDidMount() {
		this.warehouseApiService.all()
			.then(response => {
				if (response.status === HttpRequestStatusCode.OK) {
					let warehouseRunningOut: IWarehouseModel[] = []
					const warehouseItems = response.data.data as IWarehouseModel[];
					warehouseItems.forEach(element => {
						if ((element.product_type as IProductTypeModel) && element.amount <= (element.product_type as IProductTypeModel)?.min_amount) {
							warehouseRunningOut.push(element);
						}
					})

					this.setState({
						warehouseItemRunningOut: warehouseRunningOut
					})
				}
			})
	}
	
	renderWarehouseRunningOutContent(): ITableCellModel[] {
		const tableCells: ITableCellModel[] = [];
		this.state.warehouseItemRunningOut.forEach(element => {
			const size = element.size as ISizeModel;
			tableCells.push({
				id: element._id,
				color: TableRowColor.WARNING,
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
                ],
                action: {
                    choose: {
                        isAlive: true,
                        func: (id: string) => {
							this.props.appUrlContext.redirectTo(RouteConstant.WAREHOUSE + "/item/" + id)
						},
                    },
				}
			});
		})
		return tableCells;
	}

	render() {
		return <FrameworkComponents.BasePage {...{title: "Dashboard"}}>
			<FrameworkComponents.Table
				title={this.props.languageContext.current.getMessageString(MessageId.WAREHOUSE_RUNNING_OUT)}
				header={[
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
				]}
				content={this.renderWarehouseRunningOutContent()} />
		</FrameworkComponents.BasePage>;
	}
}

export default WithFramework.withLanguage(
    WithFramework.withAppDialog(
        WithFramework.withAppUrl(DashboardPage)
    )
);
