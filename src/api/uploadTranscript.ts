const baseUrl = 'https://nodejs-serverless-function-express-kivwskth7.vercel.app/?';

const url =
  baseUrl +
  new URLSearchParams({
    'x-vercel-protection-bypass': import.meta.env.VITE_VERCEL_AUTH,
  }).toString();

export const postTranscript = async (audio: FormData) => {
  // Vercel serverless function endpoint, limited to 4.5MB file size which we need to fix.
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: audio,
    });
    const { data } = await response.json();

    const responseFormatted = {
      id: data.id,
      title: 'txt',
      blocks: data.sentences,
    };
    return responseFormatted;
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : 'Unknown error');
  }
};
