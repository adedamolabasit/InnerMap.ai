"use client";

import { useState, useRef } from "react";
import { Button } from "@/shared/components/Ui/button";
import { Card } from "@/shared/components/Ui/card";
import { useToast } from "@/shared/hooks/useToast";
import { useRouter, usePathname } from "next/navigation";

interface DreamCaptureProps {
  onSave: (dream: string) => void;
  onBack: () => void;
  isSaving?: boolean;
}

type SpeechRecognitionType = any;

export function DreamCapture({ onSave, isSaving }: DreamCaptureProps) {
  const [dreamText, setDreamText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptText, setTranscriptText] = useState("");

  const router = useRouter();
  const pathname = usePathname();

  const { toast } = useToast();

  const recognitionRef = useRef<SpeechRecognitionType | null>(null);

  const handleStartRecording = async () => {
    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert("Speech recognition not supported");
        return;
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          }
        }

        if (finalTranscript) {
          setTranscriptText((prev) => prev + finalTranscript);
          setDreamText((prev) => prev + finalTranscript);
        }
      };

      recognition.onerror = () => {
        recognition.stop();
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      setIsRecording(true);
    } catch {
      toast({
        title: "Access denied",
        description: "Microphone access denied.",
      });
    }
  };

  const handleStopRecording = () => {
    recognitionRef.current?.stop();
  };
  const handleSave = () => {
    if (!dreamText.trim()) {
      toast({
        title: "Record a dream",
        description: "Please write or record a dream first.",
      });

      return;
    }
    onSave(dreamText);
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
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => router.push(`${pathname}?view=journal`)}
          >
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
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
                    className="flex-1 cursor-pointer"
                  >
                    🎤 Start Recording
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    onClick={handleStopRecording}
                    className="flex-1 bg-destructive hover:bg-destructive/90 cursor-pointer"
                  >
                    ⊘ Stop Recording
                  </Button>
                )}
              </div>

              {transcriptText && (
                <div className="mt-4 p-4 bg-background rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-2">
                    Recording Notes:
                  </p>
                  <p className="text-foreground">{transcriptText}</p>
                </div>
              )}
            </Card>

            <Card className="p-6 border-border bg-card space-y-4">
              <label className="block text-sm font-medium text-foreground">
                Dream Description
              </label>
              <textarea
                placeholder="Write down all the details you remember from your dream..."
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                rows={10}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />

              <div className="flex gap-3">
                <Button
                  variant="default"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 cursor-pointer"
                >
                  {isSaving ? "Analyzing..." : "Save & Analyze"}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push(`${pathname}?view=journal`)}
                  className="flex-1 bg-transparent cursor-pointer"
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
                <li>• Record immediately upon waking</li>
                <li>• Include sensory details</li>
                <li>• Note emotions</li>
                <li>• Speak naturally</li>
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
