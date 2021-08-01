import React from "react";
import UserLoginContext from "./UserLoginContext";
import IUserLoginContextFunc from "./IUserLoginContextFunc";
import IUserLoginContextState from "./IUserLoginContextState";
import IUserModel from "framework/documents/models/IUserModel";
import FrameworkUtils from "framework/utils/FrameworkUtils";
import AppUrlContext from "framework/contexts/url/AppUrlContext";
import IAppUrlContext from "../url/IAppUrlContext";
import RouteConstant from "framework/constants/RouteConstant";
import AppConstant from "../../constants/AppConstant";
import axios from "axios";
import UserApiService from "framework/api/UserApiService";

interface UserLoginProviderProps {
    children?: any;
}

class UserLoginProvider
    extends React.Component<UserLoginProviderProps, IUserLoginContextState>
    implements IUserLoginContextFunc
{
    private appUrlContext!: IAppUrlContext;
    private userApiService: UserApiService;

    constructor(props: UserLoginProviderProps) {
        super(props);

        this.userApiService = new UserApiService();

        this.state = {
            user: undefined as unknown as IUserModel,
            callbacks: [],
        };

        this.setUser = this.setUser.bind(this);
        this.isLoggedIn = this.isLoggedIn.bind(this);
        this.authRedirect = this.authRedirect.bind(this);
        this.userLoginFromLocalStorage = this.userLoginFromLocalStorage.bind(this);
    }

    removeUserLoggedIn(): void {
        localStorage.setItem(AppConstant.ACCESS_TOKEN_KEY, "");
        this.setUser(undefined as unknown as IUserModel);
    }

    addEventUserLogin(callback: () => void): void {
        let callbacks = this.state.callbacks
        callbacks.push(callback)
        this.setState({
            callbacks: callbacks
        });
    }

    componentDidMount() {
        FrameworkUtils.addEventStorageHasChange(this.userLoginFromLocalStorage);
        this.userLoginFromLocalStorage();

        if (
            !localStorage.getItem(AppConstant.ACCESS_TOKEN_KEY) &&
            !this.appUrlContext.isCurrentUrl(RouteConstant.REGISTRATION) &&
            !this.appUrlContext.isCurrentUrl(RouteConstant.LOGIN)
        ) {
            this.appUrlContext.redirectTo(RouteConstant.LOGIN);
        }
    }

    userLoginFromLocalStorage() {
        if (localStorage.getItem(AppConstant.ACCESS_TOKEN_KEY) && !this.isLoggedIn()) {
            const user = {
                token: localStorage.getItem(AppConstant.ACCESS_TOKEN_KEY),
            } as IUserModel;

            axios.defaults.headers.common["Authorization"] = AppConstant.TOKEN_PREFIX + " " + user.token;
            this.setUser(user);

            this.userApiService.me()
                .then(response => {
                    this.setUser(response.data.data as IUserModel)
                })
                .catch(error => {
                    localStorage.removeItem(AppConstant.ACCESS_TOKEN_KEY)
                    this.setUser(undefined as unknown as IUserModel)
                })
        }

        if (!localStorage.getItem(AppConstant.ACCESS_TOKEN_KEY) && this.isLoggedIn()) {
            this.setUser(undefined as unknown as IUserModel);
        }
    }

    authRedirect() {
        if (!this.isLoggedIn()) {
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
            axios.defaults.headers.common["Authorization"] = "";

            this.appUrlContext.redirectTo(RouteConstant.LOGIN);
        }

        if (this.isLoggedIn() && this.appUrlContext.isCurrentUrl(RouteConstant.LOGIN)) {
            // setting when logged
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            axios.defaults.headers.common["Authorization"] = AppConstant.TOKEN_PREFIX + " " + this.state.user.token;

            this.appUrlContext.redirectTo(RouteConstant.DASHBOARD);
        }

        this.state.callbacks.forEach((element) => {
            if (element) element();
        });
    }

    isLoggedIn(): boolean {
        return FrameworkUtils.isAlive(this.state.user);
    }

    setUser(user: IUserModel): void {
        this.setState(
            {
                user: user,
            }, 
            this.authRedirect
        );

        if (user && user.token) {
            localStorage.setItem(AppConstant.ACCESS_TOKEN_KEY, user.token);
        }
    }

    render() {
        return (
            <UserLoginContext.Provider value={{ state: this.state, current: this }}>
                {this.props.children}
                <AppUrlContext.Consumer>
                    {(context) => {
                        this.appUrlContext = context;
                        return undefined;
                    }}
                </AppUrlContext.Consumer>
            </UserLoginContext.Provider>
        );
    }
}

export default UserLoginProvider;
