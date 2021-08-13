import BaseRepository from "@app/framework/core/BaseRepository";
import CartItemModel from "@app/app/models/CartItemModel";
import AppUtil from "@app/framework/utils/AppUtil";

const NAME_SPACE = "CartItemRepository";

/**
 * CartItem repository
 * @author tung.nguyenvan
 */
class CartItemRepository extends BaseRepository {
    constructor() {
        super(new CartItemModel());
    }

    populate(object: any) {
        return AppUtil.populateUpdatedBy(AppUtil.populateCreatedBy(object))
            .populate({
                path: "product_name",
                select: "-__v",
            })
            .populate({
                path: "product_type",
                select: "-__v",
            })
            .populate({
                path: "thickness",
                select: "-__v",
            })
            .populate({
                path: "system_standard",
                select: "-__v",
            })
            .populate({
                path: "standard",
                select: "-__v",
            })
            .populate({
                path: "size",
                select: "-__v",
            })
            .populate({
                path: "warehouse",
                select: "-__v",
            })
            .select("-__v");
    }
}

export default CartItemRepository;
