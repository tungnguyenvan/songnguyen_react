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

class Logging {
    private static getTimestamp(): string {
        return new Date().toISOString();
    }

    static info = (namespace: string, message: string, object?: any) => {
        // tslint:disable-next-line:no-console
        console.info(ConsoleColor.FgCyan, `[${Logging.getTimestamp()}] [INFO] [${namespace}] ${message}`, object ? object : "", ConsoleColor.Reset);
    };

    static warn = (namespace: string, message: string, object?: any) => {
        // tslint:disable-next-line:no-console
        console.warn(`[${Logging.getTimestamp()}] [WARN] [${namespace}] ${message}`, object ? object : "");
    };

    static error = (namespace: string, message: string, object?: any) => {
        // tslint:disable-next-line:no-console
        console.error(ConsoleColor.FgRed + `[${Logging.getTimestamp()}] [ERROR] [${namespace}] ${message}`, object ? object : "", ConsoleColor.Reset);
    };

    static success = (namespace: string, message: string, object?: any) => {
        // tslint:disable-next-line:no-console
        console.log(ConsoleColor.FgGreen + `[${Logging.getTimestamp()}] [SUCCESS] [${namespace}] ${message}`, object ? object : "", ConsoleColor.Reset);
    };

    static debug = (namespace: string, message: string, object?: any) => {
        // tslint:disable-next-line:no-console
        console.log(`[${Logging.getTimestamp()}] [DEBUG] [${namespace}] ${message}`, object ? object : "");
    };
}

export default Logging;
