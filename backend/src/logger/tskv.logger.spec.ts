import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    jest.spyOn(global, 'Date').mockImplementation(
      () =>
        ({
          toISOString: () => '2024-11-03T12:00:00.000Z',
        }) as any,
    );

    logger = new TskvLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('проверяем что formatMessage возвращает TSKV формат', () => {
    const result = logger.formatMessage('log', 'Test message');
    expect(result).toContain('level=log');
    expect(result).toContain('message=Test message');
    expect(result).toContain('timestamp=');
    expect(result).toContain('\t');
  });

  it('проверяем что поля разделены табуляцией', () => {
    const result = logger.formatMessage('error', 'Error occurred');
    const fields = result.split('\t');
    expect(fields.length).toBeGreaterThanOrEqual(3);
    expect(fields[0]).toContain('level=');
    expect(fields[1]).toContain('message=');
    expect(fields[2]).toContain('timestamp=');
  });

  it('проверяем что optionalParams включаются в вывод', () => {
    const result = logger.formatMessage('warn', 'Warning', 'param1', 'param2');
    expect(result).toContain('params=');
    expect(result).toContain('["param1","param2"]');
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
});
