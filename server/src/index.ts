// tslint:disable-next-line:no-var-requires
require("module-alias/register");
import http from "http";
import Application from "./app/Application";
import Logging from "@app/framework/utils/Logging";
import AppConfig from "./framework/system/AppConfig";

const NAME_SPACE = "INDEX";

const server = http.createServer(Application);
server.listen(AppConfig.PORT, () => {
	Logging.success(NAME_SPACE, `Server started with port: ${process.env.PORT}`);
});
