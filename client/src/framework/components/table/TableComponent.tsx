import React from "react";
import Style from "framework/resources/css/TableComponent.module.scss";
import FrameworkComponents from "../FrameworkComponents";
import ITableCellModel from "framework/documents/ui/ITableCellModel";
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant";
import FrameworkUtils from "framework/utils/FrameworkUtils";
import { ReactComponent as PlusIcon } from "framework/resources/image/plus-circle.svg";
import classNames from "classnames";
import { TableRowColor } from "framework/constants/AppEnumConstant";
import IFormInputElement from "../IFormInputElement";

interface TableComponentProps {
    header: string[];
    content: ITableCellModel[];
    title?: string;
    commonButton?: () => void;
    isDisableSearchComponent?: boolean;
}

interface TableComponentState {
    searchText: string;
}

class TableComponent extends React.Component<TableComponentProps, TableComponentState> {
    private searchTextRef: React.RefObject<any>

    constructor(props: TableComponentProps) {
        super(props);

        this.state = {
            searchText: ""
        }

        this.searchTextRef = React.createRef<IFormInputElement>();

        this.renderTableRow = this.renderTableRow.bind(this);
        this.searchTextHasChanged = this.searchTextHasChanged.bind(this);
    }

    searchTextHasChanged() {
        this.setState({
            searchText: this.searchTextRef.current.getValue()
        })
    }

    renderTableRow(tableContent: ITableCellModel) {
        // search handle
        if (!FrameworkUtils.isBlank(this.state.searchText)) {
            let canShow = false;

            tableContent.content.forEach(content => {
                if (content.includes(this.state.searchText)) {
                    canShow = true;
                }
            })

            if (!canShow) {
                return undefined;
            }
        }

        let classTD = classNames();
        switch (tableContent.color) {
            case TableRowColor.DANGER: {
                classTD = classNames([Style.DANGER]);
                break;
            }
            case TableRowColor.WARNING: {
                classTD = classNames([Style.WARNING]);
                break;
            }
            case TableRowColor.SUCCESS: {
                classTD = classNames([Style.SUCCESS]);
                break;
            }
        }

        return (
            <tr key={tableContent.id} className={classTD}>
                {tableContent.content.map((e) => {
                    return <td key={tableContent.id + e + FrameworkUtils.generateUniqueKey()}>{e}</td>;
                })}
                {tableContent.action && (
                    <td>
                        <div className={Style.action}>
                            {tableContent.action.edit && (
                                <FrameworkComponents.Button
                                    disable={!tableContent.action.edit.isAlive}
                                    type={ButtonTypeConstant.WARNING}
                                    isForTableCell={true}
                                    onClick={() => {
                                        tableContent.action!.edit!.func(tableContent.id);
                                    }}
                                >
                                    &#x270E;
                                </FrameworkComponents.Button>
                            )}
                            {tableContent.action.delete && (
                                <FrameworkComponents.Button
                                    disable={!tableContent.action.delete.isAlive}
                                    dialogModel={tableContent.action.delete?.dialog}
                                    type={ButtonTypeConstant.DANGER}
                                    isForTableCell={true}
                                    onClick={() => {
                                        tableContent.action!.delete?.func(tableContent.id);
                                    }}
                                >
                                    &#x2715;
                                </FrameworkComponents.Button>
                            )}
                            {tableContent.action.choose && (
                                <FrameworkComponents.Button
                                    disable={!tableContent.action.choose.isAlive}
                                    dialogModel={tableContent.action.choose?.dialog}
                                    isForTableCell={true}
                                    onClick={() => {
                                        tableContent.action!.choose?.func(tableContent.id);
                                    }}
                                    type={ButtonTypeConstant.PRIMARY}>&#x2611;</FrameworkComponents.Button>
                            )}
                        </div>
                    </td>
                )}
            </tr>
        );
    }

    render() {
        return (
            <div className={Style.table__component__container}>
                <h2>{this.props.title}</h2>
                <FrameworkComponents.FormGroup>
                    {this.props.commonButton && (
                        <FrameworkComponents.Button onClick={this.props.commonButton} type={ButtonTypeConstant.FLAT} isForTableCell={true}>
                            <PlusIcon className={Style.table__common__button} />
                        </FrameworkComponents.Button>
                    )}
                </FrameworkComponents.FormGroup>

                <FrameworkComponents.FormGroup>
                    {!this.props.isDisableSearchComponent && 
                    <FrameworkComponents.InputText
                        ref={this.searchTextRef}
                        onChange={this.searchTextHasChanged}
                        placeHolder='Search' />}
                </FrameworkComponents.FormGroup>

                <div className={Style.table__component__table}>
                    <table>
                        <thead>
                            <tr>
                                {this.props.header.map((element, index) => {
                                    return (
                                        <th key={index} className={Style.table__header__cell}>
                                            {element}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody className={Style.table__content}>
                            {this.props.content &&
                                this.props.content.map((element) => {
                                    return this.renderTableRow(element);
                                })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default TableComponent;
