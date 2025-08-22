import { render, screen, fireEvent, act } from '@testing-library/react';
import { App } from './App';
import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import mockData from './__mocks__/transcript.json';

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
        id: '',
        title: ''
      },
      error: null,
    });
    render(<App />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders transcript and blocks', () => {
    mocks.useTranscript.mockReturnValue({ loading: false, data: mockData, error: null });
    render(<App />);
    expect(screen.getByText('Good day, and welcome to the first quarter 2023 GoGo Inc. earnings conference call.')).toBeInTheDocument();
  });

  it('highlights block on click', () => {
    mocks.useTranscript.mockReturnValue({ loading: false, data: mockData, error: null });
    render(<App />);
    const block = screen.getByText('Good day, and welcome to the first quarter 2023 GoGo Inc. earnings conference call.');
    fireEvent.click(block);
    expect(block).toHaveClass('block-highlighted');
  });

  it('updates selected text when audioTime changes', () => {
    const setSelectedText = vi.fn();
    vi.spyOn(React, 'useState').mockReturnValue([null, setSelectedText]);

    render(<App />);
    act(() => {
      // Simulate audioTime change
      setSelectedText({ text: 'Good day, and welcome to the first quarter 2023 GoGo Inc. earnings conference call.' });
    });

    expect(setSelectedText).toHaveBeenCalledWith({ text: 'Good day, and welcome to the first quarter 2023 GoGo Inc. earnings conference call.' });
  });
});
