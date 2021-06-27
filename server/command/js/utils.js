const fs = require("fs");
const Logging = require("./Logging");

const DOCUMENT_BASE_FILE_PATH = `${__dirname}/resources/document`;
const SCHEMA_BASE_FILE_PATH = `${__dirname}/resources/schema`;
const MODEL_BASE_FILE_PATH = `${__dirname}/resources/model`;
const REPOSITORY_BASE_FILE_PATH = `${__dirname}/resources/repository`;
const CONTROLLER_BASE_FILE_PATH = `${__dirname}/resources/controller`;
const ROUTER_BASE_FILE_PATH = `${__dirname}/resources/router`;
const VALIDATE_BASE_FILE_PATH = `${__dirname}/resources/validate`;

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function checkFileIsExist(path) {
	try {
		if (fs.existsSync(path)) {
			Logging.error("checkFileIsExist", "Document file is exist with name is", path);
			return false;
		} else {
			return true;
		}
	} catch (error) {
		throw new Error(error);
	}
}

function createDocument(name) {
	const fileName = `I${name}Document.ts`;
	const path = `${__dirname}/../../src/app/documents/${fileName}`;
	handleCreateFile(name, DOCUMENT_BASE_FILE_PATH, path);
}

function createModel(name) {
	const fileName = `${name}Model.ts`;
	const path = `${__dirname}/../../src/app/models/${fileName}`;
	handleCreateFile(name, MODEL_BASE_FILE_PATH, path);
}

function createSchema(name) {
	const fileName = `${name}Schema.ts`;
	const path = `${__dirname}/../../src/app/schema/${fileName}`;
	handleCreateFile(name, SCHEMA_BASE_FILE_PATH, path);
}

function createRepository(name) {
	const fileName = `${name}Repository.ts`;
	const path = `${__dirname}/../../src/app/repositories/${fileName}`;
	handleCreateFile(name, REPOSITORY_BASE_FILE_PATH, path);
}

function createController(name) {
	const fileName = `${name}Controller.ts`;
	const path = `${__dirname}/../../src/app/controllers/${fileName}`;
	handleCreateFile(name, CONTROLLER_BASE_FILE_PATH, path);
}

function createRouter(name) {
	const fileName = `${name}Router.ts`;
	const path = `${__dirname}/../../src/app/routers/${fileName}`;
	handleCreateFile(name, ROUTER_BASE_FILE_PATH, path);
}

function createValidate(name) {
	const fileName = `${name}ValidateDocument.ts`;
	const path = `${__dirname}/../../src/app/validations/${fileName}`;
	handleCreateFile(name, VALIDATE_BASE_FILE_PATH, path);
}

function handleCreateFile(name, fromPath, toPath) {
	if (checkFileIsExist(toPath)) {
		createFile(fromPath, toPath, () => {
			replaceTextInFile(toPath, /__/g, name);
		});
	}
}

function createFile(fromPath, toPath, callback) {
	try {
		fs.copyFile(fromPath, toPath, (error) => {
			if (error) {
				Logging.error("createFile", `Create file not done: ${toPath}`, error);
				return false;
			}
			Logging.success("createFile", `Create file done: ${toPath}`);
			callback();
		});
	} catch (error) {
		throw new Error(error);
	}
}

function replaceTextInFile(filePath, regex, replacement) {
	fs.readFile(filePath, "utf8", (error, data) => {
		if (error) {
			return Logging.error("replaceTextInFile", "Cannot read file:", error);
		}

		// replace text
		const result = data.replace(regex, replacement);
		fs.writeFile(filePath, result, "utf8", (e) => {
			if (e) return Logging.error("replaceTextInFile", "Cannot write file:", e);
		});
	});
}

module.exports = {
	capitalizeFirstLetter,
	checkFileIsExist,
	createFile,
	createDocument,
	createSchema,
	createModel,
	createRepository,
	createController,
	createRouter,
	createValidate,
};
