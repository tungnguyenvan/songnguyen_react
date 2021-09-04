import BaseRepository from "@app/framework/core/BaseRepository";
import CustomerModel from "@app/app/models/CustomerModel";
import AppUtil from "@app/framework/utils/AppUtil";

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
        return AppUtil.populateUpdatedBy(AppUtil.populateCreatedBy(object)).select("-__v");
    }
}

export default CustomerRepository;
