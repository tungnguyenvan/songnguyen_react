import React from "react";
import FrameworkComponents from "framework/components/FrameworkComponents";
import MessageId from "framework/constants/MessageId";
import WithFramework from "framework/constants/WithFramework";
import ILanguageContext from "framework/contexts/lang/ILanguageContext";
import ITableCellModel from "framework/documents/ui/ITableCellModel";
import ICustomerModel from "app/documents/ICustomerModel";
import CustomerApiService from "app/api/CustomerApiService";
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode";
import FrameworkUtils from "framework/utils/FrameworkUtils";
import IAppUrlContext from "framework/contexts/url/IAppUrlContext";
import RouteConstant from "framework/constants/RouteConstant";
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant";

interface CustomersPageProvider {
	languageContext: ILanguageContext;
	appUrlContext: IAppUrlContext
}

interface CustomersPageState {
	customers: ICustomerModel[]
}

class CustomersPage extends React.Component<CustomersPageProvider, CustomersPageState> {
	private customerApiService: CustomerApiService;

	constructor(props: CustomersPageProvider) {
		super(props)

		this.customerApiService = new CustomerApiService();

		this.state = {
			customers: []
		}

		this.onEditCustomer = this.onEditCustomer.bind(this);
	}

	componentDidMount() {
		// TODO handle error request
		this.customerApiService.all()
			.then(response => {
				if (response.status === HttpRequestStatusCode.OK) {
					this.setState({
						customers: response.data.data as ICustomerModel[]
					})
				}
			})
	}

	onEditCustomer(id: string) {
		this.props.appUrlContext.redirectTo(RouteConstant.CUSTOMER + '/' + id);
	}


	tableContent() {
		let tableContents: ITableCellModel[] = [];

		this.state.customers.forEach(element => {
			tableContents.push({
				id: element._id,
				content: [
					element.name,
					element.address,
					element.tax,
					element.email,
					element.phone_number,
					element.contact_name,
					FrameworkUtils.userName(element.createdBy)
				],
				action: {
					edit: {
						isAlive: true,
						func: this.onEditCustomer
					}
				}
			})
		})


		return tableContents;
	}

	render() {
		return (
				<FrameworkComponents.BasePage {...{title: this.props.languageContext.current.getMessageString(MessageId.CUSTOMERS)}}>
					<FrameworkComponents.FormGroup>
						<FrameworkComponents.Button type={ButtonTypeConstant.PRIMARY} onClick={() => {
							this.props.appUrlContext.redirectTo(RouteConstant.CUSTOMER_CREATE)
						}}>{this.props.languageContext.current.getMessageString(MessageId.CUSTOMER_CREATE)}</FrameworkComponents.Button>
					</FrameworkComponents.FormGroup>
					<FrameworkComponents.Table {...{
						header: [
							this.props.languageContext.current.getMessageString(MessageId.NAME),
							this.props.languageContext.current.getMessageString(MessageId.ADDRESS),
							this.props.languageContext.current.getMessageString(MessageId.TAX_CODE),
							this.props.languageContext.current.getMessageString(MessageId.EMAIL),
							this.props.languageContext.current.getMessageString(MessageId.PHONE_NUMBER),
							this.props.languageContext.current.getMessageString(MessageId.CONTACT_NAME),
							this.props.languageContext.current.getMessageString(MessageId.EMPLOYEE),
							this.props.languageContext.current.getMessageString(MessageId.ACTION)
						],

						content: this.tableContent()
						}
					} />
				</FrameworkComponents.BasePage>
		);
	}
}

export default  WithFramework.withAppUrl(
	WithFramework.withLanguage(CustomersPage)
);
