import { type Audio, type AudioBlock } from './types.ts';

export const findAudioBlock = (data: Audio, audioTime: number): AudioBlock | undefined =>
  data.blocks.find((block) => audioTime >= block.start && audioTime <= block.end);
