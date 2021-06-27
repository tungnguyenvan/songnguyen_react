const ConsoleColor = {
	Reset: "\x1b[0m",
	Bright: "\x1b[1m",
	Dim: "\x1b[2m",
	Underscore: "\x1b[4m",
	Blink: "\x1b[5m",
	Reverse: "\x1b[7m",
	Hidden: "\x1b[8m",
	FgBlack: "\x1b[30m",
	FgRed: "\x1b[31m",
	FgGreen: "\x1b[32m",
	FgYellow: "\x1b[33m",
	FgBlue: "\x1b[34m",
	FgMagenta: "\x1b[35m",
	FgCyan: "\x1b[36m",
	FgWhite: "\x1b[37m",
	BgBlack: "\x1b[40m",
	BgRed: "\x1b[41m",
	BgGreen: "\x1b[42m",
	BgYellow: "\x1b[43m",
	BgBlue: "\x1b[44m",
	BgMagenta: "\x1b[45m",
	BgCyan: "\x1b[46m",
	BgWhite: "\x1b[47m",
};

function getTimestamp() {
	return new Date().toISOString();
}

const info = (namespace, message, object) => {
	console.info(
		ConsoleColor.FgCyan,
		`[${getTimestamp()}] [INFO] [${namespace}] ${message}`,
		object ? object : "",
		ConsoleColor.Reset
	);
};

const warn = (namespace, message, object) => {
	// tslint:disable-next-line:no-console
	console.warn(`[${getTimestamp()}] [WARN] [${namespace}] ${message}`, object ? object : "");
};

const error = (namespace, message, object) => {
	// tslint:disable-next-line:no-console
	console.error(
		ConsoleColor.FgRed + `[${getTimestamp()}] [ERROR] [${namespace}] ${message}`,
		object ? object : "",
		ConsoleColor.Reset
	);
};

const success = (namespace, message, object) => {
	// tslint:disable-next-line:no-console
	console.log(
		ConsoleColor.FgGreen + `[${getTimestamp()}] [SUCCESS] [${namespace}] ${message}`,
		object ? object : "",
		ConsoleColor.Reset
	);
};

const debug = (namespace, message, object) => {
	// tslint:disable-next-line:no-console
	console.error(`[${getTimestamp()}] [DEBUG] [${namespace}] ${message}`, object ? object : "");
};

module.exports = {
	info,
	warn,
	error,
	success,
	debug,
};
