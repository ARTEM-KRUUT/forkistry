import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { formatClock, useStepTimers } from './useStepTimers.js';

const steps = [{ timerSeconds: 3 }, { timerSeconds: 60 }, { timerSeconds: 0 }];

describe('таймеры шагов', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('старт, пауза, сброс и стоп', () => {
    const { result } = renderHook(() => useStepTimers(steps));
    act(() => result.current.start(1));
    act(() => vi.advanceTimersByTime(10_000));
    expect(result.current.timers[1]).toMatchObject({ running: true, remaining: 50 });

    act(() => result.current.pause(1));
    act(() => vi.advanceTimersByTime(10_000));
    expect(result.current.timers[1]).toMatchObject({ running: false, remaining: 50 });

    act(() => result.current.reset(1));
    expect(result.current.timers[1].remaining).toBe(60);

    act(() => result.current.start(1));
    act(() => result.current.stop(1));
    expect(result.current.timers[1]).toMatchObject({ running: false, remaining: 60 });
  });

  it('по окончании — сигнал ровно один раз, таймеры шагов независимы', () => {
    const onFinish = vi.fn();
    const { result } = renderHook(() => useStepTimers(steps, onFinish));
    act(() => {
      result.current.start(0);
      result.current.start(1);
    });
    act(() => vi.advanceTimersByTime(3500));
    expect(result.current.timers[0]).toMatchObject({ done: true, running: false, remaining: 0 });
    expect(result.current.timers[1].running).toBe(true);
    act(() => vi.advanceTimersByTime(2000));
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(onFinish).toHaveBeenCalledWith(0);
  });

  it('формат часов', () => {
    expect(formatClock(1536)).toBe('25:36');
    expect(formatClock(59)).toBe('0:59');
    expect(formatClock(3725)).toBe('1:02:05');
  });
});
