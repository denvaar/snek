import drawGame from './drawGame'

describe('draw game', () => {
  let consoleLogMock: jest.SpyInstance<void, [any?, ...any[]]>;
  let consoleClearMock: jest.SpyInstance<void, [any?, ...any[]]>;
  beforeEach(() => {
    consoleLogMock = jest.spyOn(console, 'log').mockImplementation();
    consoleClearMock = jest.spyOn(console, 'clear').mockImplementation();
  });
  afterEach(() => {
    consoleLogMock.mockRestore();
    consoleClearMock.mockRestore();
  });

  it('should be a function', () => {
    expect(typeof drawGame).toBe('function')
  });

  it('should write game state', () => {
    const initialState: GameState = {
      status: 'playing',
      snake: [[7, 1], [6, 1], [5, 1], [4, 1], [3, 1], [2, 1], [1, 1]],
      heading: 'right',
      food: [10, 10],
    };
    drawGame(initialState);
    expect(consoleLogMock.mock.calls[0]).toMatchSnapshot();
  });

  it('should write rainbow color snek', () => {
    const initialState: GameState = {
      status: 'playing',
      snake: [[11, 1], [10, 1], [9, 1], [8, 1], [7, 1], [6, 1], [5, 1], [4, 1], [3, 1], [2, 1], [1, 1]],
      heading: 'right',
      food: [10, 10],
    };
    drawGame(initialState);
    expect(consoleLogMock.mock.calls[0]).toMatchSnapshot();
  });

});