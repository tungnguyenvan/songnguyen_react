import "@app/framework/utils/CustomDeclare";

import Express from "express";
import Path from "path";
import Mongoose from "mongoose";
import BodyParser from "body-parser";
import RateLimit from "express-rate-limit";
import Logging from "@app/framework/utils/Logging";

// router import
import TagRouter from "./routers/TagRouter";
import FileRouter from "@app/app/routers/FileRouter";
import UserRouter from "@app/app/routers/UserRouter";
import StoreRouter from "@app/app/routers/StoreRouter";
import AppConfig from "@app/framework/system/AppConfig";
import ProductTypeRouter from "./routers/ProductTypeRouter";
import WarehouseRouter from "./routers/WarehouseRouter";
import AddressRouter from "./routers/AddressRouter";
import CustomerRouter from "./routers/CustomerRouter";
import ProductNameRouter from "./routers/ProductNameRouter";
import ThicknessRouter from "./routers/ThicknessRouter";
import SystemStandardRouter from "./routers/SystemStandardRouter";
import StandardRouter from "./routers/StandardRouter";
import SizeRouter from "./routers/SizeRouter";
import CartRouter from "./routers/CartRouter";
import CartItemRouter from "./routers/CartItemRouter";

const NAME_SPACE = "APPLICATION";
// initialize application
const application = Express();

// limit rate
const limit = RateLimit({
    windowMs: 60 * 60 * 1000, // 1 hrs in milliseconds
    max: AppConfig.MAX_REQUEST_PER_HOURS as number,
    message: `You have exceeded the ${AppConfig.MAX_REQUEST_PER_HOURS} requests in 1 hrs limit!`,
    headers: true,
});
application.use(limit);

// initialize CORS
application.use((req: any, res: any, next: any) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Access-Control-Allow-Headers", "*");
    if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    }

    next();
});

// connect to database
Mongoose.set("useCreateIndex", true);
Mongoose.set("useUnifiedTopology", true);
Mongoose.connect(AppConfig.DB_URL, { useNewUrlParser: true }, (error: any): void => {
    if (!error) {
        Logging.success(NAME_SPACE, "Connected to database");
    } else {
        Logging.error(NAME_SPACE, "Cannot connect to database");
    }
});

// use body parser
application.use(BodyParser.urlencoded({ extended: true }));
application.use(BodyParser.json());

// application.use("/tag", new TagRouter().getRouter());
application.use("/file", new FileRouter().getRouter());
application.use("/user", new UserRouter().getRouter());
// application.use("/store", new StoreRouter().getRouter());
application.use("/product_type", new ProductTypeRouter().getRouter());
application.use("/product_name", new ProductNameRouter().getRouter());
application.use("/warehouse", new WarehouseRouter().getRouter());
// application.use("/address", new AddressRouter().getRouter());
application.use("/customer", new CustomerRouter().getRouter());
application.use("/thickness", new ThicknessRouter().getRouter());
application.use("/system_standard", new SystemStandardRouter().getRouter());
application.use("/standard", new StandardRouter().getRouter());
application.use("/size", new SizeRouter().getRouter());
application.use("/cart", new CartRouter().getRouter());
application.use("/cart_item", new CartItemRouter().getRouter());
application.use("/resources", Express.static(Path.join(__dirname + "/../../storage")));

export default application;
