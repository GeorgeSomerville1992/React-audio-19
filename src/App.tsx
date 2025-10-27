'use client';
import { useState } from 'react';
import { Transcript } from './transcript/Transcript';
import { postTranscript } from './api/uploadTranscript';
import { useMutation } from '@tanstack/react-query';
import { useErrorBoundary, ErrorBoundary } from 'react-error-boundary';
import './App.css';

function Fallback({ error }: { error: Error }) {
  const { resetBoundary } = useErrorBoundary();

  return (
    <div className="flex justify-center items-center p-32 items-center flex-col gap-4" role="alert">
      <h4>Something went wrong</h4>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetBoundary}>Try again</button>
    </div>
  );
}

export const App = () => {
  const { mutate, isPending, error } = useMutation({ mutationKey: ['transcript'], mutationFn: postTranscript });
  const { showBoundary } = useErrorBoundary();

  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>();
  const [fileError, setFileError] = useState<boolean>(false);

  const onUploadTranscript = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const formData = new FormData();

    if (!file) {
      console.error('No file selected');
      showBoundary(new Error('No file selected'));
      return;
    }

    if (file.size > 1048576 * 4.5) {
      console.error('File size exceeds 4.5 MB');
      showBoundary(new Error('File size exceeds 4.5 MB'));
      return;
    }

    formData.append('audio', file);
    mutate(formData);
    // Simulate an upload process
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFileError(false);
      setFile(e.target.files[0]);
      const audioUrl = URL.createObjectURL(e.target.files[0]);
      setAudioUrl(audioUrl);
    }
  };

  return (
    <div>
      <header className="bg-dark-grey w-screen pt-4 pb-4">
        <div className="flex justify-center items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Transcript App</h1>
        </div>
      </header>
      <ErrorBoundary FallbackComponent={Fallback}>
        <main>
          <form className="transcript-form" onSubmit={onUploadTranscript} encType="multipart/form-data">
            <label htmlFor="transcript" className="transcript-upload">
              <i className="fa fa-cloud-upload"></i> Upload file (no larger than 4.5 MB)
            </label>
            <input className="fileInput" id="transcript" type="file" name="transcript" onChange={handleFileChange} />
            {file && <p className="file-name">Selected file: {file.name}</p>}
            {fileError && <p className="error-text">Please select a valid audio file.</p>}
            <button type="submit">Submit</button>
          </form>
          <Transcript isLoading={isPending} error={error} audioUrl={audioUrl} />
        </main>
      </ErrorBoundary>
    </div>
  );
};

export const AppContainer = () => {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <App />
    </ErrorBoundary>
  );
};
