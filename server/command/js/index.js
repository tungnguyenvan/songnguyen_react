const Util = require("./utils");

let routerName = process.argv[2];

// main

// document file
const capitalizeFirstName = `${Util.capitalizeFirstLetter(routerName)}`;

// check and create document file
Util.createDocument(capitalizeFirstName);
Util.createSchema(capitalizeFirstName);
Util.createModel(capitalizeFirstName);
Util.createRepository(capitalizeFirstName);
Util.createController(capitalizeFirstName);
Util.createRouter(capitalizeFirstName);
Util.createValidate(capitalizeFirstName);
