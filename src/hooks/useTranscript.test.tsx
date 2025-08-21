import { expect, test, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTranscript } from './useTranscript';

// fetchMocker to mock actualy fetch
import createFetchMock from 'vitest-fetch-mock';

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

const transcriptData = {
  id: 'gg1aa17c-0a31-495c-8e9d-6179de3d3111',
  title: 'Gogo Q1 2023',
  audioUrl: 'https://main.d319k8lxxb3z56.amplifyapp.com/gg1aa17c-0a31-495c-8e9d-6179de3d3111.ogg',
  blocks: [
    {
      end: 6.5200000000000005,
      start: 0,
      text: 'Some blocks',
    },
  ],
};

test('gives null when first called', async () => {
  const firstResponse = {
    data: null,
    error: null,
    loading: true,
  };

  fetchMocker.mockResponseOnce(JSON.stringify(transcriptData));
  const { result } = renderHook(() => useTranscript());
  expect(result.current).toEqual(firstResponse);
});

test('to call the API and give back the transcript', async () => {
  const response = {
    data: transcriptData,
    error: null,
    loading: false,
  };
  fetchMocker.mockResponseOnce(JSON.stringify(transcriptData));
  const { result } = renderHook(() => useTranscript());

  await waitFor(() => {
    expect(result.current).toEqual(response);
  });
  expect(fetchMocker).toBeCalledWith(
    'https://main.d319k8lxxb3z56.amplifyapp.com/api/transcripts/gg1aa17c-0a31-495c-8e9d-6179de3d3111',
  );
});

test('handles fetch error', async () => {
  const errorResponse = {
    data: null,
    error: 'Failed to fetch transcript',
    loading: false,
  };

  fetchMocker.mockRejectOnce(new Error('Failed to fetch transcript'));
  const { result } = renderHook(() => useTranscript());

  await waitFor(() => {
    expect(result.current).toEqual(errorResponse);
  });
});
