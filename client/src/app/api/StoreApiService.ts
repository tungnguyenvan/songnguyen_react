import IStoreModel from "app/documents/IStoreModel";
import BaseApiService from "framework/api/BaseApiService";
import RequestPathConstant from "framework/constants/RequestPathConstant";

class StoreApiService extends BaseApiService<IStoreModel> {
  constructor() {
    super(RequestPathConstant.STORE);
  }
}

export default StoreApiService;
