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
                                                    <Route
                                                        exact
                                                        path={RouteConstant.DASHBOARD}
                                                        children={<DashboardPage />}
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
                                                        path={RouteConstant.CUSTOMER_DETAIL}
                                                        children={<CustomersDetailPage />}
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
