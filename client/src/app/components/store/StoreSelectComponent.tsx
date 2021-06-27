import React from "react";
import ClassName from "classnames";
import Style from "app/resources/css/StoreSelectComponent.module.scss";
import StoreDefaultIcon from "app/resources/image/shop.svg";
import FrameworkUtils from "framework/utils/FrameworkUtils";
import StoreSelectItemComponent from "./StoreSelectItemComponent";
import { ReactComponent as CaretDown } from "app/resources/image/caret-down.svg";
import { ReactComponent as PlusIcon } from "app/resources/image/plus.svg";
import IUserLoginContext from "framework/contexts/user/IUserLoginContext";
import IStoreModel from "app/documents/IStoreModel";
import StoreApiService from "app/api/StoreApiService";
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode";
import IStoreContext from "app/context/store/IStoreContext";
import ILanguageContext from "framework/contexts/lang/ILanguageContext";
import MessageId from "framework/constants/MessageId";
import WithFramework from "framework/constants/WithFramework";
import AppContext from "app/constant/AppContext";

interface StoreSelectComponentProps {
    storeContext: IStoreContext;
    languageContext: ILanguageContext;
    userLoginContext: IUserLoginContext;
}

interface StoreSelectComponentState {
    isActiveSelectBox: Boolean;
    isInputSearchFocused: Boolean;
    inputSearchValue: string;
    storeList: IStoreModel[];
}

class StoreSelectComponent extends React.Component<StoreSelectComponentProps, StoreSelectComponentState> {
    private rootContainer: React.RefObject<any>;
    private inputSearchRef: React.RefObject<any>;
    private storeApiService: StoreApiService;

    constructor(props: StoreSelectComponentProps) {
        super(props);

        this.rootContainer = React.createRef();
        this.inputSearchRef = React.createRef();
        this.storeApiService = new StoreApiService();

        this.state = {
            isActiveSelectBox: false,
            isInputSearchFocused: false,
            inputSearchValue: '',
            storeList: [],
        };

        this.onSelectStore = this.onSelectStore.bind(this);
        this.closeSelectBox = this.closeSelectBox.bind(this);
        this.isShowStoreItem = this.isShowStoreItem.bind(this);
        this.toggleSelectBox = this.toggleSelectBox.bind(this);
        this.renderComponent = this.renderComponent.bind(this);
        this.onUserLoginHasChaged = this.onUserLoginHasChaged.bind(this);
    }

    componentDidMount() {
        FrameworkUtils.addEventWhenClickOutSide(this.rootContainer, this.closeSelectBox);
        this.props.userLoginContext.current.addEventUserLogin(this.onUserLoginHasChaged);
    }

    onUserLoginHasChaged(): void {
        if (this.props.userLoginContext?.current.isLoggedIn()) {
            // TODO: call api to get store
            this.storeApiService.all().then((response) => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState(
                        {
                            storeList: response.data.data as IStoreModel[],
                        },
                        () => {
                            if (this.state.storeList.length) {
                                this.props.storeContext?.current.onSetStoreSelected(this.state.storeList[0]);
                            }
                        }
                    );
                }
            });
        } else {
            this.setState({
                storeList: [],
            });
        }
    }

    closeSelectBox() {
        this.setState({
            isActiveSelectBox: false,
        });
    }

    toggleSelectBox() {
        if (!this.state.isInputSearchFocused) {
            this.setState({
                isActiveSelectBox: !this.state.isActiveSelectBox,
            });
        }
    }

    onSelectStore(store: IStoreModel) {
        this.props.storeContext?.current.onSetStoreSelected(store);
    }

    isShowStoreItem(element: IStoreModel): Boolean {
        let isShow = true;

        if (this.state.inputSearchValue === '') {
            if (this.props.storeContext.storeSelected?._id === element._id) {
                isShow = false
            }
        } else {
            if (!element.name.includes(this.state.inputSearchValue)) {
                isShow = false
            }
        }

        return isShow
    }

    renderComponent() {
        let isShow = true;
        const selectBoxClass = ClassName(Style.store__select__component__container, {
            [Style.active]: this.state.isActiveSelectBox,
        });

        return (
            isShow && (
                <div className={selectBoxClass} onClick={this.toggleSelectBox} ref={this.rootContainer}>
                    {this.props.storeContext.storeSelected && (
                        <div className={Style.store__select__component__selected}>
                            <img className={Style.store__avatar} src={this.props.storeContext.storeSelected.avatar ? this.props.storeContext.storeSelected.avatar.url : StoreDefaultIcon} alt='' />
                            <div className={Style.store__info}>
                                <h3 className={Style.store__info__title}>{this.props.storeContext.storeSelected.name}</h3>
                                <label className={Style.store__info__address}>{this.props.storeContext.storeSelected.address}</label>
                            </div>
                        </div>
                    )}
                    <CaretDown />
                    <div className={Style.store__select__component__select__box}>
                        <div className={Style.store__select__search__bar}>
                            <input
                                ref={this.inputSearchRef}
                                className={Style.store__select__input__search}
                                onFocus={() => {this.setState({isInputSearchFocused: true})}}
                                onBlur={() => {this.setState({isInputSearchFocused: false})}}
                                onChange={e => {this.setState({inputSearchValue: e.target.value})}}
                                placeholder={this.props.languageContext?.current.getMessageString(MessageId.PLACEHOLDER_SEARCG_STORE)} />
                        </div>

                        {this.state.storeList.map((element, index) => {
                            return this.isShowStoreItem(element) &&  <StoreSelectItemComponent store={element} key={index} onSelectStore={this.onSelectStore} />;
                        })}
                        
                        <div className={Style.store__select__create__button}>
                            <PlusIcon />
                        </div>
                    </div>
                </div>
            )
        );
    }

    render() {
        return this.renderComponent();
    }
}

export default WithFramework.withUserLogin(
    WithFramework.withLanguage(
        AppContext.withRouterStoreSelectContext(StoreSelectComponent)
    )
);
