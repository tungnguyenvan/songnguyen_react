import React from "react";
import Style from "app/resources/css/StoreSelectComponent.module.scss";
import StoreDefaultIcon from "app/resources/image/shop.svg";
import IStoreModel from "app/documents/IStoreModel";

interface StoreSelectItemComponentProps {
	store: IStoreModel,
	onSelectStore: (store: IStoreModel) => void;
}

class StoreSelectItemComponent extends React.Component<StoreSelectItemComponentProps> {
	render() {
		return (
			<div className={Style.store__select__box__item} onClick={() => {
				this.props.onSelectStore(this.props.store)
			}}>
				<img className={Style.store__avatar} src={(this.props.store.avatar) ? this.props.store.avatar.url : StoreDefaultIcon} alt="" />
				<div className={Style.store__info}>
					<h3 className={Style.store__info__title}>{this.props.store.name}</h3>
					<label className={Style.store__info__address}>
						{this.props.store.address}
					</label>
				</div>
			</div>
		);
	}
}

export default StoreSelectItemComponent;
