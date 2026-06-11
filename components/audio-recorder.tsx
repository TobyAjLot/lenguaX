"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, Trash2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AudioRecording, RecordingState } from "@/types";
import { formatDuration } from "@/lib/utils-extra";

interface AudioRecorderProps {
  onSend?: (audioUrl: string, duration: number) => void;
  onCancel?: () => void;
}

export function AudioRecorder({ onSend, onCancel }: AudioRecorderProps) {
  const [recording, setRecording] = useState<AudioRecording>({
    state: "idle",
    duration: 0,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const recordingStartRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Request microphone access
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current =
        new // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window.AudioContext || (window as any).webkitAudioContext)();
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      recordingStartRef.current = Date.now();

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecording((prev) => ({
          ...prev,
          state: "preview",
          audioUrl,
        }));

        stream.getTracks().forEach((track) => track.stop());
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      };

      mediaRecorder.start();

      // Start timer
      timerIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor(
          (Date.now() - recordingStartRef.current) / 1000,
        );
        setRecording((prev) => ({ ...prev, duration: elapsed }));
      }, 100);

      setRecording((prev) => ({ ...prev, state: "recording", duration: 0 }));
    } catch (err) {
      setRecording((prev) => ({
        ...prev,
        state: "permissionDenied",
        error: "Microphone access denied",
      }));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const playAudio = () => {
    if (!audioElementRef.current && recording.audioUrl) {
      audioElementRef.current = new Audio(recording.audioUrl);
    }

    if (audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause();
      } else {
        audioElementRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const deleteRecording = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    setRecording({ state: "idle", duration: 0 });
    setIsPlaying(false);
  };

  const sendRecording = async () => {
    if (recording.audioUrl) {
      setRecording((prev) => ({ ...prev, state: "uploading" }));
      // Simulate upload
      setTimeout(() => {
        onSend?.(recording.audioUrl!, recording.duration);
        setRecording({ state: "idle", duration: 0 });
        setIsPlaying(false);
      }, 800);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Handle audio end
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  }, []);

  if (recording.state === "idle") {
    return (
      <Button
        onClick={startRecording}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Mic className="w-4 h-4" />
        Record Audio
      </Button>
    );
  }

  if (recording.state === "permissionDenied") {
    return (
      <div className="text-sm text-red-600 dark:text-red-400">
        {recording.error}
      </div>
    );
  }

  if (recording.state === "recording") {
    return (
      <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950 px-3 py-2 rounded-lg">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium text-red-700 dark:text-red-200">
          Recording {formatDuration(recording.duration)}
        </span>
        <Button
          onClick={stopRecording}
          size="sm"
          variant="destructive"
          className="ml-auto gap-1"
        >
          <Square className="w-3 h-3" />
          Stop
        </Button>
      </div>
    );
  }

  if (
    recording.state === "preview" ||
    recording.state === "uploading" ||
    recording.state === "success"
  ) {
    return (
      <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
        <Button
          onClick={playAudio}
          size="sm"
          variant="ghost"
          disabled={recording.state === "uploading"}
          className="gap-1"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>
        <span className="text-sm font-medium">
          {recording.state === "uploading"
            ? "Uploading..."
            : formatDuration(recording.duration)}
        </span>
        <Button
          onClick={deleteRecording}
          size="sm"
          variant="ghost"
          disabled={recording.state === "uploading"}
          className="gap-1"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        <Button
          onClick={sendRecording}
          size="sm"
          disabled={recording.state === "uploading"}
          className="ml-auto gap-1"
        >
          <Send className="w-3 h-3" />
          Send
        </Button>
      </div>
    );
  }

  return null;
}
