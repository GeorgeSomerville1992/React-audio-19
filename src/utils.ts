import { type Audio, type AudioBlock } from './types.ts';

export const findAudioBlock = (data: Audio, audioTime: number): AudioBlock | undefined =>
  data.blocks.find((block) => audioTime / 1000 >= block.start && audioTime / 1000 <= block.end);
