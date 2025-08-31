import './App.css';
import { useEffect, useState, useRef } from 'react';
import { type AudioBlock } from './types';
import { findAudioBlock } from './utils';
import { FaCirclePlay, FaCircleStop } from 'react-icons/fa6';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { fetchTranscript } from './api/fetchTranscript';
import ErrorBoundary from './Errorboundary';

import { useQuery } from '@tanstack/react-query';

export const App = () => {
  const [audioTime, setAudioTime] = useState(0);
  const [selectedText, setSelectedText] = useState<AudioBlock>();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const { isLoading, error, data } = useQuery({ queryKey: ['transcript'], queryFn: fetchTranscript });

  const handleBlockClick = (block: AudioBlock) => {
    const audioFile = audioRef.current;
    if (!audioFile) return;

    // Set the current time of the audio to the start of the block
    audioFile.currentTime = block.start;
    const middleTime = (block.start + block.end) / 2;
    setAudioTime(middleTime);

    // Highlight the text block
    setSelectedText(block);
  };

  const handleScrubberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audioFile = audioRef.current;
    if (!audioFile || !data) return;

    // Get the current time of the audio
    const newTime = parseFloat(event.target.value);
    setAudioTime(newTime);
    audioFile.currentTime = newTime;

    // Find the block that corresponds to the current time
    const foundAudioBlock = findAudioBlock(data, newTime);

    if (foundAudioBlock) {
      setSelectedText(foundAudioBlock);
    }
  };

  const togglePlay = () => {
    const audioFile = audioRef.current;
    if (!audioFile) return;
    audioFile.play.call(audioFile);
    setAudioTime(audioFile.currentTime);
    setIsAudioPlaying(true);

    // Highlight the first block if audio starts from the beginning
    if (audioFile.currentTime === 0 && data?.blocks) {
      setSelectedText(data?.blocks[0]);
    }
  };

  const togglePause = () => {
    const audioFile = audioRef.current;
    if (!audioFile) return;
    audioFile.pause.call(audioFile);
    setIsAudioPlaying(false);
    setAudioTime(audioFile.currentTime);
  };

  // Set audio text if audioTime changes
  useEffect(() => {
    if (audioTime === 0 || !data?.blocks) return;

    const foundAudioBlock = data.blocks.find(
      (block: { start: number; end: number }) => audioTime >= block.start && audioTime <= block.end,
    );

    setSelectedText(foundAudioBlock);
  }, [audioTime, data]);

  if (error) return <h2> Error </h2>;

  if (isLoading) {
    return (
      <div data-testid="loading" className="centered">
        <AiOutlineLoading3Quarters size={32} className="loading-icon" />
      </div>
    );
  }

  if (!data?.blocks.length) {
    return (
      <div className="centered">
        <h2> No data </h2>
      </div>
    );
  }

  const { audioUrl, blocks } = data;

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-dark-grey w-screen pt-4 pb-4">
        <div className="flex justify-center items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Audio App</h1>
        </div>
      </header>
      <main>
        <ErrorBoundary>
          <div className="transcript">
            <ul className="blocks overflow-scroll">
              {blocks.length > 0 &&
                blocks.map((block: AudioBlock, index: number) => {
                  const isHighlighted = selectedText?.text === block.text;
                  return (
                    <li
                      key={`${block.start + index}`}
                      aria-label={isHighlighted ? 'block-highlighted' : undefined}
                      onClick={() => handleBlockClick(block)}
                      className={isHighlighted ? 'block-highlighted' : ''}
                    >
                      <p> {block.text} </p>
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="controls">
            <audio
              ref={audioRef}
              controls
              id="audio"
              src={audioUrl}
              className="audio"
              aria-label="audio player"
              hidden
            />
            {!isAudioPlaying ? (
              <button type="button" aria-label="Play" onClick={togglePlay}>
                <FaCirclePlay size={32} />
              </button>
            ) : (
              <button type="button" aria-label="Pause" onClick={togglePause}>
                <FaCircleStop size={32} />
              </button>
            )}
            <input
              type="range"
              id="audio-scrubber"
              aria-label="Audio Scrubber"
              min="0"
              max={audioRef.current?.duration}
              value={audioTime}
              onChange={handleScrubberChange}
            />
          </div>
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default App;
