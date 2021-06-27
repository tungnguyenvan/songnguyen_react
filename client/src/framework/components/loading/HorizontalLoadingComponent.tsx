import React from "react";
import ClassName from "classnames";

import Style from "framework/resources/css/HorizontalLoadingComponent.module.scss";

interface HorizontalLoadingComponentProps {
	isActive: boolean;
}

class HorizontalLoadingComponent extends React.Component<HorizontalLoadingComponentProps> {
	render() {
		const containerClass = ClassName(Style.horizontal__loading__component, {
			[Style.active]: this.props.isActive,
		});

		return (
			<div className={containerClass}>
				<div className={Style.horizontal__loading__component__slider}>
					<div className={Style.horizontal__loading__component__line}></div>
					<div className={Style.horizontal__loading__component__inc}></div>
					<div className={Style.horizontal__loading__component__dec}></div>
				</div>
			</div>
		);
	}
}

export default HorizontalLoadingComponent;
