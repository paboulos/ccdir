#!/usr/bin/env node
const ccdir = require('./ccdir'); // eslint-disable-line @typescript-eslint/no-var-requires
const prodEnv = process.env.NODE_ENV === 'ccdir_dev' ? false : true;
const { error, log } = console;

const colors = {
    Reset: '\x1b[0m',
    Bright: '\x1b[1m',
    fg: {
        Red: '\x1b[31m',
        Green: '\x1b[32m',
        Yellow: '\x1b[33m',
        Cyan: '\x1b[36m',
    },
    bg: {
        Black: '\x1b[40m',
        White: '\x1b[47m',
    },
};

const printHelp = (help: boolean, errMsg: string) => {
    const print = help ? log : error;
    if (errMsg) {
        print(colors.fg.Red, 'Error:', colors.Reset, ` ${errMsg}\n`);
    }
    print('Usage: ccdir <Command> <path> [<path>]');
    print('');
    print('deletes or copies all files and folders at "path" recursively.');
    print('');
    print('Commands:');
    print('');
    print('  -h, --help    Display this usage info');
    print('  -cl,          Removes the files and folders from the first path argument');
    print('  -cp,          Copies the files an folders at path to the second path argument');
    if (prodEnv) process.exit(help ? 0 : 1);
    if (help) return 0;
    return 1;
};
export const main = (cmd: string | undefined, source = '', destination = '') => {
    if (cmd) {
        switch (cmd) {
            case '-cl': {
                try {
                    if (source) {
                        ccdir.clean(source);
                        break;
                    } else return printHelp(false, 'clear requires a path');
                } catch (error) {
                    return printHelp(false, error.message);
                }
            }
            case '-cp': {
                try {
                    if (source && destination) {
                        ccdir.copy(source, destination);
                        break;
                    } else return printHelp(false, 'copy requires source and destination paths');
                } catch (error) {
                    return printHelp(false, error.message);
                }
            }
            case '-h': {
                return printHelp(true, '');
            }
            case '--help': {
                return printHelp(true, '');
            }
            default: {
                return printHelp(false, 'Invalid agruments');
            }
        }
    } else {
        return printHelp(false, 'Invalid or missing command');
    }
};

if (prodEnv) {
    const command = process.argv[2] ? process.argv[2] : undefined;
    const src = process.argv[3] ? process.argv[3] : undefined;
    const dest: string | undefined = process.argv[4] ? process.argv[4] : undefined;
    main(command, src, dest);
}
