import React from "react";
import ExamplePage from "./app/pages/ExamplePage";
import HeaderComponent from "app/components/header/HeaderComponent";
import NavigationProvider from "framework/contexts/nav/NavigationProvider";
import AppUrlProvider from "framework/contexts/url/AppUrlProvider";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DashboardPage from "./app/pages/DashboardPage";
import CustomersPage from "./app/pages/customer/CustomersPage";
import PartnersPage from "./app/pages/PartnersPage";
import LoginPage from "./app/pages/LoginPage";
import Style from "./App.module.scss";
import LanguageProvider from "./framework/contexts/lang/LanguageProvider";
import UserLoginProvider from "./framework/contexts/user/UserLoginProvider";
import RegistrationPage from "./app/pages/RegistrationPage";
import RouteConstant from "./framework/constants/RouteConstant";
import AppLoadingProvider from "./framework/contexts/loading/AppLoadingProvider";
import AppLoadingContext from "./framework/contexts/loading/AppLoadingContext";
import axios from "axios";
import IAppLoadingContext from "./framework/contexts/loading/IAppLoadingContext";
import AppDialogProvider from "./framework/contexts/dialog/AppDialogProvider";
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode";
import IUserLoginContext from "framework/contexts/user/IUserLoginContext";
import UserLoginContext from "framework/contexts/user/UserLoginContext";
import StoreProvider from "app/context/store/StoreProvider";
import StoresPage from "app/pages/store/StoresPage";
import AppConstant from "framework/constants/AppConstant";
import CustomersDetailPage from "app/pages/customer/CustomersDetailPage";
import CustomerCreate from "app/pages/customer/CustomerCreate";
import SettingPage from "app/pages/setting/SettingPage";
import ProductNameCreate from "app/pages/product_name/ProductNameCreate";
import ProductNameDetail from "app/pages/product_name/ProductNameDetail";
import ThicknessCreate from "app/pages/thickness/ThicknessCreate";
import ThicknessDetail from "app/pages/thickness/ThicknessDetail";
import SystemStandardDetail from "app/pages/system_standard/SystemStandardDetail";
import SystemStandardCreate from "app/pages/system_standard/SystemStandardCreate";
import StandardDetail from "app/pages/standard/StandardDetail";
import StandardCreate from "app/pages/standard/StandardCreate";
import ProductTypeDetail from "app/pages/product_type/ProductTypeDetail";
import ProductTypeCreate from "app/pages/product_type/ProductTypeCreate";
import SizeDetail from "app/pages/size/SizeDetail";
import SizeCreate from "app/pages/size/SizeCreate";
import MakeOrderPage from "app/pages/make_order/MakeOrderPage";
import CartProvider from "app/context/cart/CartProvider";

class App extends React.Component {
    private appLoadingContext!: IAppLoadingContext;
    private userLoginContext!: IUserLoginContext;

    constructor(props: any) {
        super(props)

        axios.defaults.baseURL = AppConstant.API_END_POINT
    }

    componentDidMount() {
        axios.interceptors.request.use((config) => {
            this.appLoadingContext.current.addRequest(config.url);
            return config;
        });

        axios.interceptors.response.use(
            (response) => {
                this.appLoadingContext.current.removeRequest(response.config.url);
                return Promise.resolve(response);
            },
            (error) => {
                if (error.response) {
                    this.appLoadingContext.current.removeRequest(error.response.config.url);

                    if (error.response.status === HttpRequestStatusCode.UNAUTHORIZED) {
                        this.userLoginContext.current.removeUserLoggedIn();
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    render() {
        return (
            <div className={Style.app}>
                <Router>
                    <AppUrlProvider>
                        <AppDialogProvider>
                            <AppLoadingProvider>
                                <AppLoadingContext.Consumer>
                                    {(context) => {
                                        this.appLoadingContext = context;
                                        return undefined;
                                    }}
                                </AppLoadingContext.Consumer>
                                <UserLoginProvider>
                                    <UserLoginContext.Consumer>
                                        {(context) => {
                                            this.userLoginContext = context;
                                            return undefined;
                                        }}
                                    </UserLoginContext.Consumer>
                                    <LanguageProvider>
                                        <StoreProvider>
                                            <Switch>
                                                <NavigationProvider>
                                                    <HeaderComponent />
                                                    <CartProvider>
                                                    <Route
                                                        exact
                                                        path={RouteConstant.DASHBOARD}
                                                        children={<DashboardPage />}
                                                    />
                                                    <Route
                                                        exact
                                                        path={RouteConstant.MAKE_ORDER}
                                                        children={<MakeOrderPage />}
                                                    />
                                                    <Route
                                                        exact
                                                        path={RouteConstant.CUSTOMER}
                                                        children={<CustomersPage />}
                                                    />
                                                    <Route
                                                        exact
                                                        path={RouteConstant.CUSTOMER_CREATE}
                                                        children={<CustomerCreate />}
                                                    />
                                                    <Route
                                                        exact
                                                        path={RouteConstant.PRODUCT_TYPE_DETAIL}
                                                        children={<ProductTypeDetail />}
                                                    />
                                                    <Route
                                                        exact
                                                        path={RouteConstant.PRODUCT_TYPE_CREATE}
                                                        children={<ProductTypeCreate />}
                                                    />
                                                    <Route
                                                        exact
                                                        path={RouteConstant.CUSTOMER_DETAIL}
                                                        children={<CustomersDetailPage />}
                                                    />
                                                    <Route
                                                        exact
                                                        path={RouteConstant.THICKNESS_CREATE}
                                                        children={<ThicknessCreate />}
                                                    />
                                                    <Route
                                                        exact
                                                        path={RouteConstant.THICKNESS_DETAIL}
                                                        children={<ThicknessDetail />}
                                                    />
                                                    <Route
                                                        exact
                                                        path={RouteConstant.SETTING}
                                                        children={<SettingPage />}
                                                    />
                                                    <Route
                                                        exact
                                                        path={RouteConstant.PARTNERS}
                                                        children={<PartnersPage />}
                                                    />
                                                    <Route
                                                        exact
                                                        path={RouteConstant.PRODUCT_NAME_CREATE}
                                                        children={<ProductNameCreate/>}
                                                    />
                                                    <Route
                                                        exact
                                                        path={RouteConstant.PRODUCT_NAME_DETAIL}
                                                        children={<ProductNameDetail />}
                                                    />
                                                    <Route
                                                        exact
                                                        path={RouteConstant.SYSTEM_STANDARD_DETAIL}
                                                        children={<SystemStandardDetail />}
                                                    />
                                                    <Route
                                                        exact
                                                        path={RouteConstant.SYSTEM_STANDARD_CREATE}
                                                        children={<SystemStandardCreate />}
                                                    />
                                                    <Route
                                                        exact
                                                        path={RouteConstant.STANDARD_DETAIL}
                                                        children={<StandardDetail />}
                                                    />
                                                    <Route
                                                        exact
                                                        path={RouteConstant.STANDARD_CREATE}
                                                        children={<StandardCreate />}
                                                    />
                                                    <Route 
                                                        exact
                                                        path={RouteConstant.SIZE_DETAIL}
                                                        children={<SizeDetail />}
                                                    />
                                                    <Route
                                                        exact
                                                        path={RouteConstant.SIZE_CREATE}
                                                        children={<SizeCreate />}
                                                    />
                                                    <Route
                                                        exact
                                                        path={RouteConstant.EXAMPLE}
                                                        children={<ExamplePage />}
                                                    />
                                                    <Route exact path={RouteConstant.STORES} children={<StoresPage />} />
                                                    <Route exact path={RouteConstant.LOGIN} children={<LoginPage />} />
                                                    <Route
                                                        exact
                                                        path={RouteConstant.REGISTRATION}
                                                        children={<RegistrationPage />}
                                                    />
                                                    </CartProvider>
                                                </NavigationProvider>
                                            </Switch>
                                        </StoreProvider>
                                    </LanguageProvider>
                                </UserLoginProvider>
                            </AppLoadingProvider>
                        </AppDialogProvider>
                    </AppUrlProvider>
                </Router>
            </div>
        );
    }
}

export default App;
