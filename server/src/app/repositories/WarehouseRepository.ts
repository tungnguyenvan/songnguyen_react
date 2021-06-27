import BaseRepository from "@app/framework/core/BaseRepository";
import WarehouseModel from "@app/app/models/WarehouseModel";

const NAME_SPACE = "WarehouseRepository";

/**
 * Warehouse repository
 * @author tung.nguyenvan
 */
class WarehouseRepository extends BaseRepository {
	constructor() {
		super(new WarehouseModel());
	}
}

export default WarehouseRepository;
