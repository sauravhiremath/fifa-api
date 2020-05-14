import { Logger, transports as _transports } from 'winston';
import dateformat from 'dateformat';
import { grey, cyan, yellow, red } from 'chalk';

export default new Logger({
    level: 'silly',
    transports: [
        new _transports.Console({
            timestamp() {
                return dateformat(Date.now(), 'yyyy-mm-dd HH:MM:ss.l');
            },
            formatter(options) {
                let message = '';

                if (options.message !== undefined) {
                    message = options.message;
                }

                let meta = '';

                if (options.meta && Object.keys(options.meta).length) {
                    meta = '\n\t' + JSON.stringify(options.meta);
                }

                let level = options.level.toUpperCase();

                switch (level) {
                    case 'DEBUG':
                        level = grey(level);
                        message = grey(message)
                        break;

                    case 'INFO':
                        level = cyan(level);
                        message = cyan(message);
                        break;

                    case 'WARN':
                        level = yellow(level);
                        message = yellow(message);
                        break;

                    case 'ERROR':
                        level = red(level);
                        message = red(message);
                        break;

                    default:
                        break;
                }

                const output = ['[' + options.timestamp() + '][' + level + ']', message, meta];

                return output.join(' ');
            }
        })
    ]
});
