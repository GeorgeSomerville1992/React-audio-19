Requirements:

- Fetch the transcript data from the url provided in the code. Correctly type the returned data with Typescript.
  The page should display the title, and each text block on screen.

- The audio player should be able to play the audio of the earnings report.
- Audio should not be playing when page is initially loaded. It should only play when user clicks play.
- Each block of the transcript and the audio should be in sync. Think of it like subtitles on a movie. E.g. when audio is playing from the start (0s), the
  first block should be highlighted.
- When the audio starts playing the second block’s audio, the second block should be highlighted. On each block, use a data-testid of 'block-highlighted' or 'test-block'. You should also use the css classes provided.
- Clicking on a text block should highlight that block, and scrub the audio player to that block’s start time.
- When the audio player is scrubbed to a specific time, the correct block should be highlighted.

Deployment link

https://react-audio-19.vercel.app/

Notes:

- Working tests using MSW, removing need for mocking entire hooks/network files
- No more test ID's
- Working audio tag connected with a range input.
