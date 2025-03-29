import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AudioRecordingContextType {
  recordedUri: string | null;
  isRecording: boolean;
  isLoading: boolean;
  recordingTime: number;
  setRecordedUri: React.Dispatch<React.SetStateAction<string | null>>;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setRecordingTime: React.Dispatch<React.SetStateAction<number>>;
}

const AudioRecordingContext = createContext<
  AudioRecordingContextType | undefined
>(undefined);

export const AudioRecordingProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  return (
    <AudioRecordingContext.Provider
      value={{
        recordedUri,
        isRecording,
        isLoading,
        recordingTime,
        setRecordingTime,
        setIsLoading,
        setIsRecording,
        setRecordedUri,
      }}
    >
      {children}
    </AudioRecordingContext.Provider>
  );
};

export const useAudioRecording = () => {
  const context = useContext(AudioRecordingContext);
  if (!context) {
    throw new Error(
      'useAudioRecording must be used within an AudioRecordingProvider'
    );
  }
  return context;
};
