export type AudioBlock = {
  end: number;
  start: number;
  text: string;
};

export type Audio = {
  id: string;
  title: string;
  audioUrl: string;
  blocks: AudioBlock[];
};
