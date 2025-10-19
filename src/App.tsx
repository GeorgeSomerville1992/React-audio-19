import { useState } from 'react';
import { Transcript } from './transcript/Transcript';
import { postTranscript } from './api/uploadTranscript';
import { useMutation } from '@tanstack/react-query';

export const App = () => {
  const { mutate, isPending, error } = useMutation({ mutationKey: ['transcript'], mutationFn: postTranscript });

  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>();

  const onUploadTranscript = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const formData = new FormData();
    if (file) {
      formData.append('audio', file);
      mutate(formData);
    } else {
      // TODO handle no file selected
      console.error('No file selected');
    }

    // Simulate an upload process
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      const audioUrl = URL.createObjectURL(e.target.files[0]);
      setAudioUrl(audioUrl);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-dark-grey w-screen pt-4 pb-4">
        <div className="flex justify-center items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Audio App</h1>
        </div>
      </header>
      <main>
        <form onSubmit={onUploadTranscript} encType="multipart/form-data">
          <input type="hidden" name="productId" />
          <input id="transcript" type="file" name="audio" onChange={handleFileChange} />
          <button type="submit">Upload Transcript</button>
        </form>
        <Transcript isLoading={isPending} error={error} audioUrl={audioUrl} />
      </main>
    </div>
  );
};
