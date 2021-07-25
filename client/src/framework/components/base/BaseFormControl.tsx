import React from "react";
import ClassName from "classnames";
import FrameworkUtils from "framework/utils/FrameworkUtils";

// resources
import Style from "framework/resources/css/BaseFormControl.module.scss";

/**
 * Interface props
 */
interface IBaseFormControlProps {
	children?: any;
	placeHolder?: String;
	disable?: boolean
	getValue: () => String | Number;
	onFocusCallback?: () => void;
	onBlurCallback?: () => void;
}

/**
 * Interface State
 */
interface IBaseFormControlState {
	isFocus: Boolean;
	isNotBlankData: Boolean;
	errorMessage: String;
}

class BaseFormControl extends React.Component<IBaseFormControlProps, IBaseFormControlState> {
	private containerRef: React.RefObject<any>;

	constructor(props: IBaseFormControlProps) {
		super(props);

		// initialize state
		this.state = {
			isFocus: false,
			isNotBlankData: false,
			errorMessage: "",
		};

		// create ref
		this.containerRef = React.createRef();

		// binding functions
		this.onBlur = this.onBlur.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.setErrorMessage = this.setErrorMessage.bind(this);
	}

	/**
	 * Show error message in control
	 * @param errorMessage String error message
	 */
	setErrorMessage(errorMessage: String) {
		this.setState({
			errorMessage: errorMessage,
		});
	}

	/**
	 * Call after component mount
	 */
	componentDidMount() {
		FrameworkUtils.addEventWhenClickOutSide(this.containerRef, this.onBlur);
	}

	/**
	 * When focus to container
	 */
	onFocus() {
		this.setState({
			isFocus: true,
			isNotBlankData: true,
		});

		// exec callback
		FrameworkUtils.executeWhenNotNull(this.props.onFocusCallback);
	}

	/**
	 * When blur container
	 */
	onBlur() {
		if (
			FrameworkUtils.isAlive(this.props.getValue) &&
			FrameworkUtils.isBlank(this.props.getValue())
		) {
			this.setState({
				isNotBlankData: false,
			});
		}

		this.setState({
			isFocus: false,
		});

		// exec callback
		FrameworkUtils.executeWhenNotNull(this.props.onBlurCallback);
	}

	/**
	 * Render HTML
	 * @returns UI
	 */
	render() {
		// container class
		const baseFormControlContainerClass = ClassName(Style.base__form__control, {
			[Style.focus]: this.state.isFocus,
			[Style.error]: !FrameworkUtils.isBlank(this.state.errorMessage),
			[Style.disable]: this.props.disable
		});

		const labelClass = ClassName(Style.label, {
			[Style.not__blank]: this.state.isNotBlankData,
		});

		// render
		return (
			<div className={baseFormControlContainerClass} ref={this.containerRef} onClick={this.onFocus}>
				<label className={labelClass}>{this.props.placeHolder}</label>
				{this.props.children}
				<label className={Style.error__message}>{this.state.errorMessage}</label>
			</div>
		);
	}
}

export default BaseFormControl;
