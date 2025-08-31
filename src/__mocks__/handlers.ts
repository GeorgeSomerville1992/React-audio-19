import { http, HttpResponse } from 'msw';
import transcript from './transcript.json';

export const handlers = [
  http.get('https://main.d319k8lxxb3z56.amplifyapp.com/api/transcripts/gg1aa17c-0a31-495c-8e9d-6179de3d3111', () => {
    return HttpResponse.json(transcript);
  }),
];
