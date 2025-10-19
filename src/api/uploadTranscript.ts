const baseUrl = 'https://nodejs-serverless-function-express-kivwskth7.vercel.app/?';

const url =
  baseUrl +
  new URLSearchParams({
    'x-vercel-protection-bypass': import.meta.env.VITE_VERCEL_AUTH,
  }).toString();

export const postTranscript = async (audio: FormData) => {
  // SORT ANNOYING 4.5 LIMIT FROM VERCEL
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
      audioUrl: 'https://main.d319k8lxxb3z56.amplifyapp.com/gg1aa17c-0a31-495c-8e9d-6179de3d3111.ogg',
    };

    return responseFormatted;
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : 'Unknown error');
  }
};
