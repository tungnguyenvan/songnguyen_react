import React from "react";
import ClassName from "classnames";
import LanguageContext from "framework/contexts/lang/LanguageContext";
import LanguageConstant from "framework/constants/LanguageConstant";
import FrameworkUtils from "framework/utils/FrameworkUtils";
import LanguageModel from "framework/documents/models/LanguageModel";

import Style from "app/resources/css/LanguageSelectComponent.module.scss";
import { ReactComponent as CaretDown } from "app/resources/image/caret-down.svg";
import LanguageList from "app/resources/json/languages.json";
import LanguageSelectItemComponent from "./LanguageSelectItemComponent";

interface LanguageSelectComponentProps {}

interface LanguageSelectComponentState {
	isActive: boolean;
}

class LanguageSelectComponent extends React.Component<
	LanguageSelectComponentProps,
	LanguageSelectComponentState
> {
	private containerRef: React.RefObject<any>;
	private selectBoxRef: React.RefObject<any>;
	private languageContext: any;

	constructor(props: LanguageSelectComponentProps) {
		super(props);

		this.containerRef = React.createRef();
		this.selectBoxRef = React.createRef();

		this.state = {
			isActive: false,
		};

		this.getLanguageObject = this.getLanguageObject.bind(this);
		this.onToggleSelectBox = this.onToggleSelectBox.bind(this);
		this.onCloseSelectBox = this.onCloseSelectBox.bind(this);
		this.onLanguageSelected = this.onLanguageSelected.bind(this);
	}

	componentDidMount() {
		FrameworkUtils.addEventWhenClickOutSideMultipleNode(
			this.onCloseSelectBox,
			this.containerRef,
			this.selectBoxRef
		);
	}

	getLanguageObject(lang: LanguageConstant): LanguageModel {
		const list: LanguageModel[] = LanguageList as LanguageModel[];
		let language: LanguageModel = list[0];

		list.forEach((e) => {
			if (lang === e.constant) {
				language = e;
			}
		});

		return language;
	}

	onToggleSelectBox() {
		this.setState({
			isActive: !this.state.isActive,
		});
	}

	onCloseSelectBox() {
		this.setState({
			isActive: false,
		});
	}

	onLanguageSelected(language: LanguageModel) {
		this.languageContext.current.changeLanguage(language.constant);
	}

	render() {
		const containerClass = ClassName(Style.language__select__component__container, {
			[Style.active]: this.state.isActive,
		});

		return (
			<LanguageContext.Consumer>
				{(context) => {
					const lang = this.getLanguageObject(context.currentLanguage);
					this.languageContext = context;
					return (
						<div
							ref={this.containerRef}
							className={containerClass}
							onClick={this.onToggleSelectBox}
						>
							<div className={Style.language__select__flag}>{lang.flag}</div>
							<div className={Style.language__select__name}>{lang.name}</div>
							<CaretDown />

							<div
								ref={this.selectBoxRef}
								className={Style.language__select__component__select__box}
							>
								{(LanguageList as LanguageModel[]).map((element, index) => {
									return (
										<LanguageSelectItemComponent
											language={element}
											onSelected={this.onLanguageSelected}
											key={index}
										/>
									);
								})}
							</div>
						</div>
					);
				}}
			</LanguageContext.Consumer>
		);
	}
}

export default LanguageSelectComponent;
