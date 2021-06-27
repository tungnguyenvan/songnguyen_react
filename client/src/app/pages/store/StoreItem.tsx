import React from "react";
import exampleImage from "app/resources/image/sample.jpg";
import ChartExample from "./ChartExample";
import Style from "app/resources/css/StorePage.module.scss";

class StoreItem extends React.Component {
    render() {
        return (
            <div className={Style.store__item}>
                <div className={Style.store__item__information}>
                    <img className={Style.store__item__information__avatar} src={exampleImage} alt='' />
                    <div className={Style.store__item__information__text}>
                        <h2>Store abc</h2>
                        <span>06 bao vinh, huong vinh, huong tra, tthue</span>
                    </div>
                </div>
                <div className={Style.store__item__chart}>
                    <ChartExample />
                </div>
                <div className={Style.store__item__action}>
                    View all <span>&#x2192;</span>
                </div>
            </div>
        );
    }
}

export default StoreItem;
