import { Logger, transports as _transports } from 'winston';
import dateformat from 'dateformat';
import { cyan, yellow, red } from 'chalk';

export default new Logger({
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
                    case 'INFO':
                        level = cyan(level);
                        break;

                    case 'WARN':
                        level = yellow(level);
                        break;

                    case 'ERROR':
                        level = red(level);
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
