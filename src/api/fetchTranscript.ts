// const url = 'https://api.assemblyai.com/v2/transcript/587cb0b0-2f70-455b-8dcc-36d5ea45e515';

const uploadUrl = 'https://cdn.assemblyai.com/upload/587cb0b0-2f70-455b-8dcc-36d5ea45e515';

const headers = {
  authorization: 'f78fc2bf44734e6a8de3bc2b73d7ae91',
};

export const fetchTranscript = async () => {
  try {
    const response = await fetch(uploadUrl, {
      method: 'GET',
      headers,
    });
    const result = await response.json();
    return result;
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : 'Unknown error');
  }
};
