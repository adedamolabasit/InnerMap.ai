import { Badge } from "@/shared/components/Ui/badge";
import { SafeDreamParams } from "../types/types";
import { DreamInsightCard } from "../types/types";

export const infoCards = (safeDream: SafeDreamParams): DreamInsightCard[] => [
  {
    id: "symbols",
    title: "Symbols",
    count: safeDream.intake?.symbols?.length,
    icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z",
    summary: "Key symbols and imagery from your dream",
    details: (
      <>
        <div className="flex flex-wrap gap-2">
          {safeDream.intake.symbols.map((symbol: any, index: number) => (
            <Badge key={index} variant="secondary" className="text-sm">
              {symbol}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Symbols represent significant objects, places, or concepts in your
          dream. They often carry metaphorical meaning related to your
          subconscious thoughts.
        </p>
      </>
    ),
  },
  {
    id: "characters",
    title: "Characters",
    count: safeDream.intake.characters.length,
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 1.197v-1a6 6 0 00-9-5.197M9 21v-1a6 6 0 0112 0v1z",
    summary: "People and entities in your dream",
    details: (
      <>
        <div className="space-y-2">
          {safeDream.intake.characters.map(
            (character: string, index: number) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm p-2 hover:bg-muted/50 rounded-lg"
              >
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-foreground">{character}</span>
              </div>
            ),
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Characters in dreams often represent aspects of yourself or
          significant people in your life. They can symbolize different
          emotions, traits, or relationships.
        </p>
      </>
    ),
  },
  {
    id: "emotions",
    title: "Emotions",
    count: safeDream.intake.emotions.length,
    icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    summary: "Emotional tones experienced",
    details: (
      <>
        <div className="flex flex-wrap gap-2">
          {safeDream.intake.emotions.map((emotion, index) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-secondary/20 text-secondary-foreground border-secondary/30 text-sm"
            >
              {emotion}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Emotions in dreams reflect your subconscious feelings about situations
          in your waking life. Strong or recurring emotions often point to areas
          needing attention.
        </p>
      </>
    ),
  },
  {
    id: "themes",
    title: "Themes",
    count: safeDream.reflection.themes.length,
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    summary: "Major themes identified",
    details: (
      <>
        <div className="space-y-3">
          {safeDream.reflection.themes.map((theme, index) => (
            <div
              key={index}
              className="p-3 bg-primary/5 rounded-lg border border-primary/10"
            >
              <p className="text-sm font-medium text-foreground">{theme}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Themes represent the core patterns and messages in your dream. They
          provide insight into recurring issues or significant life themes.
        </p>
      </>
    ),
  },
  {
    id: "actions",
    title: "Actions",
    count: safeDream.intake.actions.length,
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    summary: "Notable actions and behaviors",
    details: (
      <>
        <div className="space-y-3">
          {safeDream.intake.actions.map((action, index) => (
            <div
              key={index}
              className="text-sm text-foreground pl-4 border-l-2 border-primary/30 py-2"
            >
              {action}
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Actions in dreams reveal how you're responding to situations and your
          level of agency. They can indicate active or passive approaches to
          life challenges.
        </p>
      </>
    ),
  },
  {
    id: "repetitions",
    title: "Repeated Elements",
    count: safeDream.intake.repeated_elements.length,
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    summary: "Patterns and recurring elements",
    details: (
      <>
        <div className="space-y-3">
          {safeDream.intake.repeated_elements.map((element, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                <span className="text-sm text-foreground">{element}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                Recurring
              </Badge>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Repeated elements highlight patterns that are particularly significant
          in your subconscious. These often point to unresolved issues or deeply
          ingrained habits.
        </p>
      </>
    ),
  },
];
