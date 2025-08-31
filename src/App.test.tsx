import { http, HttpResponse } from 'msw';
import { describe, expect, it, afterEach, beforeAll } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { server } from './__mocks__/node';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import transcript from './__mocks__/transcript.json';

const transcriptUrl = 'https://main.d319k8lxxb3z56.amplifyapp.com/api/transcripts/gg1aa17c-0a31-495c-8e9d-6179de3d3111';

beforeAll(() => server.listen());

afterEach(() => {
  server.resetHandlers();
});

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    queryCache: new QueryCache(),
    defaultOptions: {
      queries: {
        experimental_prefetchInRender: true,
        staleTime: 0,
        retry: false,
      },
    },
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('Home Component', () => {
  afterEach(() => {
    server.resetHandlers();
  });

  it('renders loading state', async () => {
    server.use(
      http.get(transcriptUrl, () => {
        return HttpResponse.json(transcript);
      }),
    );
    render(<App />, { wrapper: AllTheProviders });

    await waitFor(async () => {
      // TODO Automated test - could not find anyway other way for loading state.
      expect(await screen.getByTestId('loading')).toBeInTheDocument();
      expect(await screen.findByText('Audio App')).toBeInTheDocument();
    });
  });

  it('renders error state', async () => {
    server.use(
      http.get(transcriptUrl, () => {
        return HttpResponse.error();
      }),
    );

    render(<App />, { wrapper: AllTheProviders });

    await waitFor(async () => {
      expect(await screen.getByText('Error')).toBeInTheDocument();
    });
  });

  it('renders no data state', async () => {
    const noData = {
      blocks: [],
      audioUrl: '',
      id: '',
      title: '',
    };

    server.use(http.get(transcriptUrl, () => HttpResponse.json(noData)));
    render(<App />, { wrapper: AllTheProviders });
    await waitFor(async () => {
      expect(await screen.getByText('No data')).toBeInTheDocument();
    });
  });

  it('renders transcript and blocks', async () => {
    render(<App />, { wrapper: AllTheProviders });

    await waitFor(async () => {
      expect(
        await screen.getByText('Good day, and welcome to the first quarter 2023 GoGo Inc. earnings conference call.'),
      );
    });
  });

  it('highlights block on click', async () => {
    render(<App />, { wrapper: AllTheProviders });
    const user = userEvent.setup();
    const block = await waitFor(async () => {
      return screen.getByText('Good day, and welcome to the first quarter 2023 GoGo Inc. earnings conference call.');
    });

    user.click(block);

    await waitFor(async () => {
      expect(await screen.findByRole('listitem', { name: 'block-highlighted' })).toHaveTextContent(
        'Good day, and welcome to the first quarter 2023 GoGo Inc. earnings conference call.',
      );
    });

    const text = await screen.findByText('So we make it up to the quantity.');

    user.click(text);
    await waitFor(async () => {
      expect(await screen.findByRole('listitem', { name: 'block-highlighted' })).toHaveTextContent(
        'So we make it up to the quantity.',
      );
    });
  });

  it('Correct blocks are highlighted when audio is played and paused', async () => {
    render(<App />, { wrapper: AllTheProviders });
    const user = userEvent.setup();

    const audio = await screen.findByTestId('test-audio');
    const playButton = screen.getByRole('button', { name: /play/i });

    expect(playButton).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /pause/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('listitem', { name: 'block-highlighted' })).not.toBeInTheDocument();
    expect(audio).toHaveAttribute(
      'src',
      'https://main.d319k8lxxb3z56.amplifyapp.com/gg1aa17c-0a31-495c-8e9d-6179de3d3111.ogg',
    );

    user.click(playButton);

    await waitFor(async () => {
      expect(await screen.findByRole('listitem', { name: 'block-highlighted' })).toHaveTextContent(
        'Good day, and welcome to the first quarter 2023 GoGo Inc. earnings conference call.',
      );
    });
    // stop the audio
    const pauseButton = screen.getByRole('button', { name: /pause/i });
    await waitFor(async () => {
      expect(pauseButton).toBeInTheDocument();
    });

    // doesn't work with user.click
    fireEvent.click(pauseButton);

    expect(playButton).toBeInTheDocument();
  });

  it('Correct blocks are highlighted when scrubber input is handled', async () => {
    render(<App />, { wrapper: AllTheProviders });

    await waitFor(async () => {
      expect(
        await screen.getByText('Good day, and welcome to the first quarter 2023 GoGo Inc. earnings conference call.'),
      );
    });

    const rangeScrubber = await screen.getByRole('slider', { name: /audio scrubber/i });

    fireEvent.change(rangeScrubber, { target: { value: 4800 } });

    await waitFor(async () => {
      expect(await screen.findByRole('listitem', { name: 'block-highlighted' })).toHaveTextContent(
        'Any forward-looking statements that we make today are based on assumptions as of the state.',
      );
    });
  });
});
