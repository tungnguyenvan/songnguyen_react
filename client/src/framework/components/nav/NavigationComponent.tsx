import React from "react";
import ClassName from "classnames";

// resouces
import Style from "framework/resources/css/NavigationComponent.module.scss";

interface INavigationComponentProps {
	children?: any;
	isShow: Boolean;
}

interface INavigationComponentState {}

class NavigationComponent extends React.Component<
	INavigationComponentProps,
	INavigationComponentState
> {
	private containerRef: React.RefObject<any>;

	constructor(props: INavigationComponentProps) {
		super(props);

		this.containerRef = React.createRef();
	}

	contains(target: any) {
		return this.containerRef.current.contains(target);
	}

	render() {
		const containerClass = ClassName(Style.navigation__component__container, {
			[Style.navigation__component__show]: this.props.isShow,
		});

		return (
			<div className={containerClass} ref={this.containerRef}>
				<ul>{this.props.children}</ul>
			</div>
		);
	}
}

export default NavigationComponent;
