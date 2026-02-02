import { FC } from "react";
import { SafeDreamParams } from "@/shared/types/types";

export const DreamNarration: FC<{ safeDream: SafeDreamParams }> = ({
  safeDream,
}) => {
  return (
    <div className="p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          Dream Narrative
        </h2>
        <div className="prose prose-invert max-w-none">
          <div className="p-6 bg-muted/20 rounded-lg border border-border">
            <p className="text-base sm:text-lg leading-relaxed text-foreground whitespace-pre-wrap">
              {safeDream.dreamText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
