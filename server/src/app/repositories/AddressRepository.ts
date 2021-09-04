import BaseRepository from "@app/framework/core/BaseRepository";
import AddressModel from "@app/app/models/AddressModel";

const NAME_SPACE = "AddressRepository";

/**
 * Address repository
 * @author tung.nguyenvan
 */
class AddressRepository extends BaseRepository {
	constructor() {
		super(new AddressModel());
	}
}

export default AddressRepository;
