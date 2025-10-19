import { http, HttpResponse } from 'msw';
import { describe, expect, it, afterEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Transcript } from './Transcript';
import { server } from '../__mocks__/node';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import transcript from '../__mocks__/transcript.json';
import { userEvent } from '@testing-library/user-event';

const transcriptUrl = 'https://main.d319k8lxxb3z56.amplifyapp.com/api/transcripts/gg1aa17c-0a31-495c-8e9d-6179de3d3111';

afterEach(() => {
  server.resetHandlers();
});

const mocks = vi.hoisted(() => {
  return {
    useMutationState: vi.fn(),
  };
});

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const original = await importOriginal<typeof import('@tanstack/react-query')>();
  return {
    ...original,
    useMutationState: (...args: unknown[]) => mocks.useMutationState(...args),
  };
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
    vi.resetAllMocks();
  });

  const defaultProps = {
    isLoading: false,
    error: null,
    audioUrl: '',
  };

  it('renders loading state', async () => {
    server.use(
      http.get(transcriptUrl, () => {
        return HttpResponse.json(transcript);
      }),
    );

    mocks.useMutationState.mockReturnValue({ data: [transcript] });

    render(<Transcript isLoading error={null} audioUrl="" />, { wrapper: AllTheProviders });

    await waitFor(async () => {
      expect(await screen.getByTestId('loading')).toBeInTheDocument();
      // expect(await screen.findByText('Audio App')).toBeInTheDocument();
    });
  });

  it('renders error state', async () => {
    server.use(
      http.get(transcriptUrl, () => {
        return HttpResponse.error();
      }),
    );

    mocks.useMutationState.mockReturnValue({ data: [transcript] });

    render(<Transcript isLoading={false} error="Error" audioUrl="" />, { wrapper: AllTheProviders });

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

    mocks.useMutationState.mockReturnValue({ data: [noData] });

    server.use(http.get(transcriptUrl, () => HttpResponse.json(noData)));

    render(<Transcript {...defaultProps} />, { wrapper: AllTheProviders });
    await waitFor(async () => {
      expect(await screen.getByText('No data')).toBeInTheDocument();
    });
  });

  it('renders transcript and blocks', async () => {
    mocks.useMutationState.mockReturnValue([transcript]);

    render(<Transcript {...defaultProps} />, { wrapper: AllTheProviders });

    await waitFor(async () => {
      expect(
        await screen.getByText('Good day, and welcome to the first quarter 2023 GoGo Inc. earnings conference call.'),
      );
    });
  });

  it('correctly highlights blocks on a user click', async () => {
    mocks.useMutationState.mockReturnValue([transcript]);
    render(<Transcript {...defaultProps} />, { wrapper: AllTheProviders });
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

    // const text = await screen.findByText('So we make it up to the quantity.');

    // user.click(text);
    // await waitFor(async () => {
    //   expect(await screen.findByRole('listitem', { name: 'block-highlighted' })).toHaveTextContent(
    //     'So we make it up to the quantity.',
    //   );
    // });
  });

  it('correctly highlights blocks when audio is played and paused', async () => {
    mocks.useMutationState.mockReturnValue([transcript]);
    render(<Transcript {...defaultProps} />, { wrapper: AllTheProviders });
    const user = userEvent.setup();

    await waitFor(async () => {
      expect(
        await screen.getByText('Good day, and welcome to the first quarter 2023 GoGo Inc. earnings conference call.'),
      );
    });
    const playButton = screen.getByRole('button', { name: /play/i });

    expect(playButton).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /pause/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('listitem', { name: 'block-highlighted' })).not.toBeInTheDocument();

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

  it('correctly highlights blocks when scrubber input is used', async () => {
    // Fix this one
    mocks.useMutationState.mockReturnValue([transcript]);
    render(<Transcript {...defaultProps} />, { wrapper: AllTheProviders });

    await waitFor(async () => {
      expect(
        await screen.getByText('Good day, and welcome to the first quarter 2023 GoGo Inc. earnings conference call.'),
      );
    });

    const rangeScrubber = await screen.getByRole('slider', { name: /audio scrubber/i });

    fireEvent.change(rangeScrubber, { target: { value: 4.8 } });

    await waitFor(async () => {
      expect(await screen.findByRole('listitem', { name: 'block-highlighted' })).toHaveTextContent(
        'Good day, and welcome to the first quarter 2023 GoGo Inc. earnings conference call.',
      );
    });
  });
});
