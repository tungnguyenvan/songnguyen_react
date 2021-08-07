import BaseController from "@app/framework/core/BaseController";
import WarehouseRepository from "@app/app/repositories/WarehouseRepository";
import Express from "express";
import Logging from "@app/framework/utils/Logging";
import IWarehouseDocument from "../documents/IWarehouseDocument";
import Mongoose from "mongoose";

const NAME_SPACE = "WarehouseController";

/**
 * Warehouse Controller
 * @author tung.nguyenvan
 */
class WarehouseController extends BaseController {
    constructor() {
        super(new WarehouseRepository());

        this.save = this.save.bind(this);
    }

    save(request: Express.Request, response: Express.Response): void {
        try {
            const searchObj = {
                product_name: request.body.product_name,
                product_type: request.body.product_type,
                thickness: request.body.thickness,
                system_standard: request.body.system_standard,
                standard: request.body.standard,
                size: request.body.size,
            };

            request.query.search = JSON.stringify(searchObj);
            this.repository.all(request).then((w) => {
                if ((w as unknown as any[]).length > 0) {
                    const updateObject = {
                        amount: ((w as unknown as any[])[0] as IWarehouseDocument).amount + parseInt(request.body.amount, 10),
                    };
                    const req = request;
                    req.body = updateObject;
                    req.params.id = ((w as unknown as any[])[0] as IWarehouseDocument)._id.toString();
                    this.repository
                        .updateOne(req)
                        .then((d) => {
                            if (d) {
                                this.appResponse.created(request, response, d);
                            } else {
                                this.appResponse.internalServerError(request, response);
                            }
                        })
                        .catch((error) => {
                            Logging.error(NAME_SPACE, `${NAME_SPACE}#save`, error);
                            this.appResponse.internalServerError(request, response);
                        });
                } else {
                    super.save(request, response);
                }
            });
        } catch (error) {
            this.catchError(request, response, error);
        }
    }
}

export default WarehouseController;
