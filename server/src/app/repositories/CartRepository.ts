import BaseRepository from "@app/framework/core/BaseRepository";
import CartModel from "@app/app/models/CartModel";
import AppUtil from "@app/framework/utils/AppUtil";

const NAME_SPACE = "CartRepository";

/**
 * Cart repository
 * @author tung.nguyenvan
 */
class CartRepository extends BaseRepository {
    constructor() {
        super(new CartModel());
    }

    populate(object: any) {
        return AppUtil.populateUpdatedBy(AppUtil.populateCreatedBy(object))
            .populate({
                path: "customer",
                select: "-__v",
            })
            .populate({
                path: "items",
                populate: [
                    {
                        path: "product_name",
                    },
                    {
                        path: "product_type",
                    },
                    {
                        path: "thickness",
                    },
                    {
                        path: "system_standard",
                    },
                    {
                        path: "standard",
                    },
                    {
                        path: "size",
                    },
                ],
            })
            .select("-__v");
    }
}

export default CartRepository;
