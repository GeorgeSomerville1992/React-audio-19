import { findAudioBlock } from './utils';
import { type Audio } from './types';
import { describe, expect, it } from 'vitest';

describe('findAudioBlock', () => {
  const mockAudio: Audio = {
    blocks: [
      {
        start: 0,
        end: 10,
        text: 'Text1',
      },
      {
        start: 11,
        end: 20,
        text: 'text2',
      },
      {
        start: 21,
        end: 30,
        text: 'text3',
      },
    ],
    id: '',
    title: '',
    audioUrl: '',
  };

  it('should return the correct AudioBlock when audioTime is within a block range', () => {
    const result = findAudioBlock(mockAudio, 15000); // 15 seconds
    expect(result).toEqual({ start: 11, end: 20, text: 'text2' });
  });

  it('should return undefined when audioTime is outside all block ranges', () => {
    const result = findAudioBlock(mockAudio, 35000); // 35 seconds
    expect(result).toBeUndefined();
  });

  it('should return the first matching AudioBlock when audioTime is on the boundary of a block', () => {
    const result = findAudioBlock(mockAudio, 10000); // 10 seconds
    expect(result).toEqual({ start: 0, end: 10, text: 'Text1' });
  });

  it('should handle an empty blocks array and return undefined', () => {
    const emptyAudio: Audio = {
      blocks: [],
      id: '',
      title: '',
      audioUrl: '',
    };
    const result = findAudioBlock(emptyAudio, 5000); // 5 seconds
    expect(result).toBeUndefined();
  });
});
