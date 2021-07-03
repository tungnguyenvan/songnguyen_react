import React from "react";
import Style from "framework/resources/css/TableComponent.module.scss";
import FrameworkComponents from "../FrameworkComponents";
import WithFramework from "framework/constants/WithFramework";
import ILanguageContext from "framework/contexts/lang/ILanguageContext";
import MessageId from "framework/constants/MessageId";
import ITableCellModel from "framework/documents/ui/ITableCellModel";
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant";

interface TableComponentProps {
    languageContext: ILanguageContext;
    header: String[];
    content: ITableCellModel[];
}

class TableComponent extends React.Component<TableComponentProps> {
    render() {
        return (
            <div className={Style.table__component__container}>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText placeHolder={this.props.languageContext.current.getMessageString(MessageId.SEARCH)} />
                </FrameworkComponents.FormGroup>
                <div className={Style.table__component__table}>
                <table>
                    <thead>
                        <tr>
                            {this.props.header.map((element, index) => {
                                return <th key={index} className={Style.table__header__cell}>{element}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody className={Style.table__content}>
                        {
                            this.props.content && this.props.content.map(element => {
                                return (
                                <tr key={element.id}>
                                    {element.content.map(e => {return <td key={element.id + e} >{e}</td>})}
                                    {element.action && 
                                        <td>
                                            <FrameworkComponents.FormGroup>
                                                <FrameworkComponents.Button type={ButtonTypeConstant.PRIMARY}>&#x270E;</FrameworkComponents.Button>
                                                <FrameworkComponents.Button type={ButtonTypeConstant.PRIMARY}>&#x2715;</FrameworkComponents.Button>
                                            </FrameworkComponents.FormGroup>
                                        </td>
                                    }
                                </tr>)
                            })
                        }
                    </tbody>
                </table>
                </div>
            </div>
        );
    }
}

export default WithFramework.withLanguage(TableComponent);
