import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('Displays the blocks correctly', async () => {
    render(<App />);

    const blocks = await screen.findAllByTestId('test-block');
    expect(blocks[0]).toHaveTextContent(
      'Good day, and welcome to the first quarter 2023 GoGo Inc. earnings conference call.',
    );
    expect(blocks[50]).toHaveTextContent('The first is the higher level of maintenance events.');
    expect(blocks[blocks.length - 1]).toHaveTextContent('This now concludes our call, and you may disconnect.');
  });

  it('plays and pauses audio', async () => {
    render(<App />);

    const audio = await screen.findByTestId('test-audio');
    const playButton = screen.getByTestId('test-play-button');

    expect(playButton).toBeInTheDocument();
    expect(screen.queryByTestId('test-pause-button')).not.toBeInTheDocument();

    expect(audio).toHaveAttribute(
      'src',
      'https://main.d319k8lxxb3z56.amplifyapp.com/gg1aa17c-0a31-495c-8e9d-6179de3d3111.ogg',
    );

    act(() => {
      fireEvent.click(playButton);
    });
    const pauseButton = screen.getByTestId('test-pause-button');
    expect(pauseButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(pauseButton);
    });

    expect(playButton).toBeInTheDocument();
  });
  // weirdly does not cover linr 17-41 on coverage
  it('Highlights block correctly on audio time update', async () => {
    render(<App />);

    const audio = await screen.findByTestId('test-audio');

    expect(screen.queryByTestId('test-block-highlighted')).not.toBeInTheDocument();

    act(() => {
      fireEvent.timeUpdate(audio, {
        target: {
          currentTime: 2,
        },
      });
    });
    act(async () => {
      expect(await screen.findByTestId('test-block-highlighted')).toHaveTextContent(
        'Good day, and welcome to the first quarter 2023 GoGo Inc. earnings conference call.',
      );
    });

    act(async () => {
      expect((await screen.findByTestId('test-block-highlighted')).childNodes).toHaveClass('block-highlighted');
    });

    // A random block from 2387 - 2389s
    act(() => {
      fireEvent.timeUpdate(audio, {
        target: {
          currentTime: 2388,
        },
      });
    });

    act(async () => {
      expect(await screen.findByTestId('test-block-highlighted')).toHaveTextContent(
        'So we make it up to the quantity.',
      );
    });

    // // Last block 4021 - 4037s
    act(() => {
      fireEvent.timeUpdate(audio, {
        target: {
          currentTime: 4030,
        },
      });
    });
    act(async () => {
      expect(await screen.findByTestId('test-block-highlighted')).toHaveTextContent(
        'This now concludes our call, and you may disconnect.',
      );
    });
  });
});
