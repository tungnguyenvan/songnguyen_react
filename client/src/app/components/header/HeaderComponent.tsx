import React from "react";
import NavigationProvider from "framework/contexts/nav/NavigationContext";
import INavigationContext from "framework/contexts/nav/INavigationContext";
import LanguageSelectComponent from "app/components/language/LanguageSelectComponent";
import HorizontalLoadingComponent from "framework/components/loading/HorizontalLoadingComponent";
import AppLoadingContext from "framework/contexts/loading/AppLoadingContext";

// resources
import Style from "app/resources/css/HeaderComponent.module.scss";
import { ReactComponent as HamburgerIcon } from "app/resources/image/list.svg";
import { ReactComponent as LogOutIcon } from "app/resources/image/box-arrow-right.svg";
import FrameworkComponents from "framework/components/FrameworkComponents";
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant";
import ILanguageContext from "framework/contexts/lang/ILanguageContext";
import IUserLoginContext from "framework/contexts/user/IUserLoginContext";
import WithFramework from "framework/constants/WithFramework";
import MessageId from "framework/constants/MessageId";

interface IHeaderComponentProps {
    languageContext: ILanguageContext;
    userLoginContext: IUserLoginContext;
}
interface IHeaderComponentState {
    isActiveLoadingBar: boolean;
}

class HeaderComponent extends React.Component<IHeaderComponentProps, IHeaderComponentState> {
    private navigationContext: INavigationContext | undefined;
    private hamburgerDivRef: React.RefObject<any>;

    constructor(props: any) {
        super(props);

        this.state = {
            isActiveLoadingBar: false,
        };

        this.hamburgerDivRef = React.createRef();
		this.onLogout = this.onLogout.bind(this);
    }

	onLogout() {
		this.props.userLoginContext.current.logout();
	}

    render() {
        return (
            <div className={Style.app__header}>
                <div className={Style.app__header__content}>
                    <div className={Style.app__header__flex__left}>
                        <div
                            className={Style.app__header__hamburger__button}
                            onClick={() => {
                                this.navigationContext!.toggle();
                            }}
                            ref={this.hamburgerDivRef}
                        >
                            <NavigationProvider.Consumer>
                                {(context) => {
                                    context.addRefsActiveNavigation(this.hamburgerDivRef);
                                    this.navigationContext = context;
                                    return undefined;
                                }}
                            </NavigationProvider.Consumer>
                            <HamburgerIcon />
                        </div>
                    </div>
                    <div className={Style.app__header__flex__center}></div>
                    <div className={Style.app__header__flex__right}>
                        { this.props.userLoginContext.current.isLoggedIn() && <FrameworkComponents.Button type={ButtonTypeConstant.FLAT} onClick={this.onLogout}>
                            <LogOutIcon style={{ marginRight: 8 }} /> {this.props.languageContext.current.getMessageString(MessageId.LOGOUT)}
                        </FrameworkComponents.Button>}
                        <LanguageSelectComponent />
                        {/* <StoreSelectComponent /> */}
                    </div>
                </div>
                <div className={Style.app__header__process}>
                    <AppLoadingContext.Consumer>{(context) => <HorizontalLoadingComponent isActive={context.isRequesting} />}</AppLoadingContext.Consumer>
                </div>
            </div>
        );
    }
}

export default WithFramework.withLanguage(WithFramework.withUserLogin(HeaderComponent));
