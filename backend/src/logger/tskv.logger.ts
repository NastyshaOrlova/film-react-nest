import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  formatMessage(level: string, message: any, ...optionalParams: any[]) {
    const logData = {
      level: level,
      message: String(message),
      timestamp: new Date().toISOString(),
    };

    if (optionalParams.length > 0) {
      logData['params'] = JSON.stringify(optionalParams);
    }

    const pairs = Object.entries(logData);
    const tskvPairs = pairs.map(([key, value]) => `${key}=${value}`);
    const tskvString = tskvPairs.join('\t');

    return tskvString;
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('warn', message, ...optionalParams));
  }

  debug(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }

  fatal(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('fatal', message, ...optionalParams));
  }
}
