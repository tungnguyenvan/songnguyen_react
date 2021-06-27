import React from "react";
import FrameworkComponents from "framework/components/FrameworkComponents";
import WithFramework from "framework/constants/WithFramework";
import ILanguageContext from "framework/contexts/lang/ILanguageContext";
import MessageId from "framework/constants/MessageId";
import Style from "app/resources/css/StorePage.module.scss"
import StoreItem from "./StoreItem";

interface StoresPageProps {
    languageContext: ILanguageContext;
}

class StoresPage extends React.Component<StoresPageProps> {
    render() {
        return <FrameworkComponents.BasePage title={this.props.languageContext.current.getMessageString(MessageId.STORES)}>
            <div className={Style.store__page__container}>
                <div className={Style.store__page__search__bar}>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.InputText placeHolder={this.props.languageContext.current.getMessageString(MessageId.PLACEHOLDER_SEARCG_STORE)} />
                    </FrameworkComponents.FormGroup>
                </div>
                <div className={Style.store__page__list}>
                    
                    <StoreItem />
                    <StoreItem />

                </div>
            </div>
        </FrameworkComponents.BasePage>;
    }
}

export default WithFramework.withLanguage(StoresPage);
