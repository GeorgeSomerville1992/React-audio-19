import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { App } from './App';
import { describe, expect, it, vi } from 'vitest';
import React from 'react';

const mockData = {
  audioUrl: 'test-audio.mp3',
  blocks: [
    { start: 0, end: 5, text: 'Hello world' },
    { start: 6, end: 10, text: 'This is a test' },
  ],
};

const mocks = vi.hoisted(() => ({
  useTranscript: vi.fn(() => ({ loading: false, data: mockData, error: null })),
}));

vi.mock('./hooks/useTranscript', () => ({
  useTranscript: mocks.useTranscript,
}));

describe('Home Component', () => {
  it('renders loading state', () => {
    mocks.useTranscript.mockReturnValue({ loading: true, data: mockData, error: null });
    render(<App />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders error state', () => {
    // @ts-expect-error test
    mocks.useTranscript.mockReturnValue({ loading: false, data: mockData, error: 'Error' });
    render(<App />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders no data state', () => {
    mocks.useTranscript.mockReturnValue({
      loading: false,
      data: {
        blocks: [],
        audioUrl: '',
      },
      error: null,
    });
    render(<App />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders transcript and blocks', () => {
    mocks.useTranscript.mockReturnValue({ loading: false, data: mockData, error: null });
    render(<App />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.getByText('This is a test')).toBeInTheDocument();
  });

  it('highlights block on click', () => {
    mocks.useTranscript.mockReturnValue({ loading: false, data: mockData, error: null });
    render(<App />);
    const block = screen.getByText('Hello world');
    fireEvent.click(block);
    expect(block).toHaveClass('block-highlighted');
  });

  it('updates selected text when audioTime changes', () => {
    const setSelectedText = vi.fn();
    vi.spyOn(React, 'useState').mockReturnValue([null, setSelectedText]);

    render(<App />);
    act(() => {
      // Simulate audioTime change
      setSelectedText({ text: 'Hello world' });
    });

    expect(setSelectedText).toHaveBeenCalledWith({ text: 'Hello world' });
  });
});
