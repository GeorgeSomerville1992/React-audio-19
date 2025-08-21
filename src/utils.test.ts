import { describe, expect, it } from 'vitest';
import { findAudioBlock } from './utils';
import { type Audio } from './types.ts';

describe('findAudioBlock', () => {
  it('should return the correct AudioBlock for a given time', () => {
    const audioData: Audio = {
      id: '1',
      title: 'Test Audio',
      audioUrl: 'http://example.com/audio.mp3',
      blocks: [
        { start: 0, end: 10, text: 'Block 1' },
        { start: 11, end: 20, text: 'Block 2' },
        { start: 21, end: 30, text: 'Block 3' },
      ],
    };

    expect(findAudioBlock(audioData, 5)).toEqual({ start: 0, end: 10, text: 'Block 1' });
    expect(findAudioBlock(audioData, 15)).toEqual({ start: 11, end: 20, text: 'Block 2' });
    expect(findAudioBlock(audioData, 25)).toEqual({ start: 21, end: 30, text: 'Block 3' });
    expect(findAudioBlock(audioData, -1)).toBeUndefined();
    expect(findAudioBlock(audioData, 35)).toBeUndefined();
  });
});
