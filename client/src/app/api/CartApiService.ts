import ICartModel from "app/documents/ICartModel";
import axios from "axios";
import BaseApiService from "framework/api/BaseApiService";
import RequestPathConstant from "framework/constants/RequestPathConstant";

class CartApiService extends BaseApiService<ICartModel> {
    constructor() {
        super(RequestPathConstant.CART);
        this.download = this.download.bind(this);
    }

    download(id: string) {
        return axios.get(this.requestPathConst + "/download/" + id);
    }
}

export default CartApiService;
