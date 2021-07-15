import React from "react";
import Style from "framework/resources/css/TableComponent.module.scss";
import FrameworkComponents from "../FrameworkComponents";
import WithFramework from "framework/constants/WithFramework";
import ILanguageContext from "framework/contexts/lang/ILanguageContext";
import MessageId from "framework/constants/MessageId";
import ITableCellModel from "framework/documents/ui/ITableCellModel";
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant";
import FrameworkUtils from "framework/utils/FrameworkUtils";
import { ReactComponent as PlusIcon } from "framework/resources/image/plus-circle.svg"

interface TableComponentProps {
    languageContext: ILanguageContext;
    header: string[];
    content: ITableCellModel[];
    title?: string
    commonButton?: () => void;
}

class TableComponent extends React.Component<TableComponentProps> {
    render() {
        return (
            <div className={Style.table__component__container}>
                <h2>{this.props.title}</h2>
                <FrameworkComponents.FormGroup>
                    { this.props.commonButton && <FrameworkComponents.Button onClick={this.props.commonButton} type={ButtonTypeConstant.FLAT} isForTableCell={true} ><PlusIcon className={Style.table__common__button} /></FrameworkComponents.Button>}
                </FrameworkComponents.FormGroup>
                
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
                                    {element.content.map(e => {return <td key={element.id + e + FrameworkUtils.generateUniqueKey()} >{e}</td>})}
                                    {element.action && 
                                        <td>
                                            <div className={Style.action}>
                                                { element.action.edit && <FrameworkComponents.Button type={ButtonTypeConstant.WARNING} isForTableCell={true} onClick={() => {element.action!.edit!.func(element.id)}}>&#x270E;</FrameworkComponents.Button>}
                                                { element.action.delete && <FrameworkComponents.Button dialogModel={element.action.delete?.dialog} type={ButtonTypeConstant.DANGER} isForTableCell={true} onClick={() => {element.action!.delete?.func(element.id)}}>&#x2715;</FrameworkComponents.Button>}
                                            </div>
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
