import { useState, FC } from "react";
import { DreamInsightCard } from "@/shared/types/types";
import { Button } from "@/shared/components/Ui/button";
import { Card } from "@/shared/components/Ui/card";
;
export const DreamAnalysis: FC<{ analysisCards: DreamInsightCard[] }> = ({
  analysisCards,
}) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {analysisCards.length > 0
          ? analysisCards.map((card) => (
              <button
                key={card.id}
                onClick={() =>
                  setSelectedAnalysis(
                    selectedAnalysis === card.id ? null : card.id,
                  )
                }
                className={`p-4 border cursor-pointer rounded-lg transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  selectedAnalysis === card.id
                    ? "border-primary bg-primary/5 ring-2 ring-primary ring-opacity-50 shadow-md"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 ">
                      <svg
                        className={`w-4 h-4 ${
                          selectedAnalysis === card.id
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={card.icon}
                        />
                      </svg>
                      <span
                        className={`text-sm font-medium ${
                          selectedAnalysis === card.id
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {card.title}
                      </span>
                    </div>
                    <span
                      className={`text-lg font-bold ${
                        selectedAnalysis === card.id
                          ? "text-primary"
                          : "text-primary"
                      }`}
                    >
                      {card.count}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground text-left">
                    {card.summary}
                  </p>
                </div>
              </button>
            ))
          : [1, 2, 3, 4].map((placeholder) => (
              <div
                key={placeholder}
                className="p-4 border border-border rounded-lg bg-card animate-pulse h-24 flex flex-col justify-center items-start"
              >
                <div className="w-12 h-4 bg-muted/50 rounded mb-2"></div>
                <div className="w-20 h-3 bg-muted/40 rounded mb-1"></div>
                <div className="w-16 h-3 bg-muted/30 rounded"></div>
              </div>
            ))}
      </div>

      {selectedAnalysis && (
        <Card className="border-primary/30 bg-primary/5  mt-6 animate-in slide-in-from-bottom-2 duration-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      analysisCards.find((c) => c.id === selectedAnalysis)
                        ?.icon || ""
                    }
                  />
                </svg>
                <h3 className="text-lg font-semibold text-foreground">
                  {analysisCards.find((c) => c.id === selectedAnalysis)?.title}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedAnalysis(null)}
                className="h-8 w-8 p-0"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>

            <div className="space-y-4">
              {analysisCards.find((c) => c.id === selectedAnalysis)?.details}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
