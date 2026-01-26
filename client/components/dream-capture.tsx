"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DreamCaptureProps {
  onSave: (dream: string, title: string) => void;
  onBack: () => void;
  isSaving?: boolean;
}

export function DreamCapture({ onSave, onBack, isSaving }: DreamCaptureProps) {
  const [dreamText, setDreamText] = useState("");
  const [title, setTitle] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptText, setTranscriptText] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      let audioChunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const transcriptionDemo =
          "I was walking through a forest... the trees were glowing... there was a path I needed to follow...";
        setTranscriptText(transcriptionDemo);
        setDreamText(transcriptionDemo);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      alert("Microphone access denied");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleSave = () => {
    if (!dreamText.trim()) {
      alert("Please write or record a dream first");
      return;
    }
    onSave(dreamText, title || "Untitled Dream");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Capture Your Dream
            </h1>
            <p className="text-muted-foreground">
              Record what you remember when you wake up
            </p>
          </div>
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 border-border bg-card">
              <label className="block text-sm font-medium text-foreground mb-3">
                Dream Title (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., The Forest Path"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </Card>

            <Card className="p-6 border-border bg-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  Voice Recording
                </h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    isRecording
                      ? "bg-destructive/20 text-destructive"
                      : "bg-muted"
                  }`}
                >
                  {isRecording ? "Recording..." : "Ready"}
                </span>
              </div>
              <div className="flex gap-3">
                {!isRecording ? (
                  <Button
                    variant="default"
                    onClick={handleStartRecording}
                    className="flex-1"
                  >
                    🎤 Start Recording
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    onClick={handleStopRecording}
                    className="flex-1 bg-destructive hover:bg-destructive/90"
                  >
                    ⊘ Stop Recording
                  </Button>
                )}
              </div>
              {transcriptText && (
                <div className="mt-4 p-4 bg-background rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-2">
                    Transcribed:
                  </p>
                  <p className="text-foreground">{transcriptText}</p>
                </div>
              )}
            </Card>

            {/* Text Input */}
            <Card className="p-6 border-border bg-card space-y-4">
              <label className="block text-sm font-medium text-foreground">
                Dream Description
              </label>
              <textarea
                placeholder="Write down all the details you remember from your dream... the setting, people, colors, emotions, and any other vivid details."
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                rows={10}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="flex gap-3">
                <Button
                  variant="default"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                      Analyzing...
                    </>
                  ) : (
                    "Save & Analyze"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="flex-1 bg-transparent"
                >
                  Discard
                </Button>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-6 border-border bg-card space-y-4">
              <h3 className="font-semibold text-foreground">
                Tips for Better Recall
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Record immediately upon waking</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>
                    Include sensory details (colors, textures, sounds)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Note your emotions and mood</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Write in present tense as if happening now</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-border bg-primary/5 space-y-3">
              <h3 className="font-semibold text-foreground text-sm">
                Word Count
              </h3>
              <p className="text-2xl font-bold text-primary">
                {dreamText.split(/\s+/).filter(Boolean).length}
              </p>
              <p className="text-xs text-muted-foreground">words captured</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
