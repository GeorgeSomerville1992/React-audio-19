const url = 'https://main.d319k8lxxb3z56.amplifyapp.com/api/transcripts/gg1aa17c-0a31-495c-8e9d-6179de3d3111';

export const fetchTranscript = async () => {
  try {
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : 'Unknown error');
  }
};
