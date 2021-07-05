import BaseRepository from "@app/framework/core/BaseRepository";
import CustomerModel from "@app/app/models/CustomerModel";

const NAME_SPACE = "CustomerRepository";

/**
 * Customer repository
 * @author tung.nguyenvan
 */
class CustomerRepository extends BaseRepository {
    constructor() {
        super(new CustomerModel());
    }

    populate(object: any) {
        return object
            .populate({
                path: "createdBy",
                select: "-__v",
            })
            .select("-__v");
    }
}

export default CustomerRepository;
