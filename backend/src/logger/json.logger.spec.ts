import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('проверяем что formatMessage возвращает валидный JSON', () => {
    const result = logger.formatMessage('log', 'Test message');
    const parsed = JSON.parse(result);
    expect(parsed.level).toBe('log');
    expect(parsed.message).toBe('Test message');
  });

  it('проверяем что метод log вызывает console.log', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    logger.log('Test message');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const expectedOutput = logger.formatMessage('log', 'Test message');
    expect(consoleSpy).toHaveBeenCalledWith(expectedOutput);
  });

  it('проверяем что метод error вызывает console.log', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    logger.error('Error message');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const expectedOutput = logger.formatMessage('error', 'Error message');
    expect(consoleSpy).toHaveBeenCalledWith(expectedOutput);
  });

  it('проверяем что метод warn вызывает console.log', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    logger.warn('Warning message');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const expectedOutput = logger.formatMessage('warn', 'Warning message');
    expect(consoleSpy).toHaveBeenCalledWith(expectedOutput);
  });

  it('проверяем что optionalParams попадают в JSON', () => {
    const result = logger.formatMessage('log', 'Test', 'param1', 'param2');
    const parsed = JSON.parse(result);
    expect(parsed.optionalParams).toEqual(['param1', 'param2']);
  });
});
