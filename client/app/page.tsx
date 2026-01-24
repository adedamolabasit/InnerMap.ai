"use client";

import { useState } from "react";
import { LandingPage } from "@/components/landing-page";
import { DreamCapture } from "@/components/dream-capture";
import { DreamJournal } from "@/components/dream-journal";
import { InsightsDashboard } from "@/components/insights-dashboard";
import { DreamDetails } from "@/components/dream-details";
import { useUserDreams } from "@/api/hooks/useQuery";
import { DreamListResponse } from "@/api/types";

import { useCreateDream } from "@/api/hooks/useMutate";

interface Dream {
  id: string;
  title: string;
  content: string;
  date: string;
  mood?: string;
}

interface DreamResponse {
  _id: string;
  userId: string;
  dreamText: string;
  intake: {
    symbols: string[];
    characters: string[];
    emotions: string[];
    actions: string[];
    repeated_elements: string[];
    agency: number;
  };
  reflection: {
    themes: string[];
    insights: string;
    suggested_action_hint: string;
  };
  action: {
    type: string;
    content: string;
    duration?: string;
    agenticHooks: string[];
  };
  createdAt: string;
}

type View = "landing" | "capture" | "journal" | "insights" | "details";

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("landing");

  const {
    data: dreams = [],
    isLoading: loadingAllDreams,
    isError,
  } = useUserDreams("iiei");

  // const [dreams, setDreams] = useState<Dream[]>([
  //   {
  //     id: "1",
  //     title: "The Floating City",
  //     content:
  //       "I was standing on a cloud platform looking down at a magnificent city below. The buildings were made of crystalline structures that glowed with soft light. People were walking on bridges made of light, moving between the towers. I felt a sense of wonder and possibility. I could hear music coming from somewhere, a melody I couldn\'t quite recognize but felt deeply familiar. As I watched, the city started to shift and change, revealing new pathways and connections I hadn\'t seen before. The colors shifted from blue to purple to gold. I felt safe and curious, wanting to explore every corner of this dream world.",
  //     date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  //     mood: "Peaceful",
  //   },
  //   {
  //     id: "2",
  //     title: "The Garden Path",
  //     content:
  //       "I found myself in an overgrown garden with winding paths. Plants were everywhere, some familiar and some completely alien. The garden was wild and untamed, yet somehow perfectly balanced. As I walked deeper, I discovered small pockets of incredible beauty - flowers that seemed to glow from within, ancient trees with wise faces, streams of clear water. I felt like I was on a journey of discovery, each turn revealing something new. The further I went, the more I understood that this wasn't just a place, but a representation of possibilities within myself.",
  //     date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  //     mood: "Curious",
  //   },
  //   {
  //     id: "3",
  //     title: "Ocean of Stars",
  //     content:
  //       "Instead of water, the ocean was made of stars and cosmic light. I was swimming through this luminous sea, and each movement created ripples of color. Below me, the depths seemed infinite, filled with possibilities. Above, the sky mirrored the ocean. I wasn't afraid of the vastness - instead, I felt connected to everything. The experience of moving through this star-ocean felt like freedom, like I could go anywhere and be anything. It was both calming and exhilarating.",
  //     date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  //     mood: "Expansive",
  //   },
  // ]);

  const [dream, setDream] = useState<DreamResponse>({
    userId: "1",
    dreamText:
      "I found my self in a strange town, in the town, I was in the palace of the king, I was welcomed, by al and celebrated l,  for some reason I left the palace intentionally, like I got distracted or something, I couldn't located the palace again, looking  at it, it was my fault that I couldn't get to the palace again, I got distracted, i think  someone was showing me the way before but I got distracted till the person left,  i  think I got distracted playing in the river, so I tried to locate my way through the locals of that town, they kept giving me a wrong direction because anywhere go to with the direction I kept Getting lost the more, asking locals again I kept getting  lost the more, on my way, I met a mad man that way preventing me to pass a particular route, I fought him, and he fought me back but he didn't really go away, until I saw one of my old friend who was familiar with that place,  so he helped me talk to the mad man from afar, I think he knows the language of the mad to trick him out of the way, I was able to pass that route so I asked him for the road to the palace , it's like he gave me the wrong direction and at this point I don't really trust the locals again, I was trying to locate the palace by my self, just to be sure my friend was not lying, I asked another local for the way to the palace I asked a woman and  her kid separately and they both told me two different things different from what my old friend said and I feel  what the mother and the son said ware influence by the presence of my old friend so at this point I don't trust anyone but I tried to look for the palace myself, so I kept going and I asked the last man, they are two walking together , they don't want to talk, they just walked past me and the man was aggressive in a way, but when I walked pass led him he said something to the other man he was walking with  that  he purposely didn't tell me the route to the kings palace that he knows the place and  other people have been asking knows the place too, that they just don't want to tell me because they are all jealous or in-secured that why do I have to be the one to be living the kings palace, and I work up",
    intake: {
      symbols: [
        "strange town",
        "king's palace",
        "river",
        "locals",
        "route",
        "mad man",
      ],
      characters: [
        "self",
        "king",
        "old friend",
        "mad man",
        "woman",
        "woman's kid",
        "two men walking together",
      ],
      emotions: [
        "welcomed",
        "celebrated",
        "distracted",
        "lost",
        "frustrated",
        "distrust",
        "conflicted",
        "confused",
        "aggressed",
      ],
      actions: [
        "left palace intentionally",
        "got distracted playing in river",
        "asked locals for directions",
        "fought mad man",
        "received help from old friend",
        "questioned trustworthiness of locals",
        "searched for palace independently",
        "confronted by two men who refused to help",
      ],
      repeated_elements: [
        "getting lost",
        "asking locals for directions",
        "distrust of others",
      ],
      agency: 0.3,
    },
    reflection: {
      themes: [
        "Feeling lost or disconnected despite initial acceptance",
        "Distraction and the consequences of losing focus",
        "Challenges in trusting others and discerning truth",
        "The journey to reclaim a valuable or rightful place",
        "Encountering obstacles and opposition",
        "Seeking help and experiencing mixed support",
        "Inner conflict between trust and skepticism",
        "Feelings of jealousy and insecurity from others around you",
      ],
      insights:
        "This dream gently reflects your experience of being welcomed and valued but then losing your way due to distraction. It highlights your struggle to navigate external confusion and internal doubts, especially around whom to trust as you try to find your path back to a place of security or success. The interactions suggest a yearning for guidance balanced with awareness of deception or resistance from others, symbolizing a deeper exploration of self-trust and resilience.",
      suggested_action_hint:
        "Consider reconnecting with what grounds and centers you to regain focus, and gently explore where you may be feeling uncertain about whom or what to trust in your waking life.",
    },
    action: {
      type: "reflect",
      content:
        "Consider exploring moments in your waking life where you feel disconnected or distracted. Reflect on how trust and skepticism currently influence your relationships, and how these feelings may shape your inner conflicts. This reflection may gently guide you to recognize where you desire more clarity or support.",
      agenticHooks: [
        "Notice moments of distraction and their impact on your focus during the day.",
        "Observe feelings of trust and doubt in your interactions with others.",
        "Identify situations that evoke insecurity or jealousy and gently explore their origins.",
      ],
      // hookResults: [
      //     {
      //         hook: "Notice moments of distraction and their impact on your focus during the day.",
      //         status: "ignored",
      //         executedAt: "2026-01-24T12:46:38.719Z",
      //         _id: "6974bf2e3c2a1a98e63a5eef"
      //     },
      //     {
      //         hook: "Observe feelings of trust and doubt in your interactions with others.",
      //         status: "ignored",
      //         executedAt: "2026-01-24T12:46:38.719Z",
      //         _id: "6974bf2e3c2a1a98e63a5ef0"
      //     },
      //     {
      //         hook: "Identify situations that evoke insecurity or jealousy and gently explore their origins.",
      //         status: "ignored",
      //         executedAt: "2026-01-24T12:46:38.719Z",
      //         _id: "6974bf2e3c2a1a98e63a5ef1"
      //     }
      // ],
      // completed: false,
      // _id: "6974bf2e3c2a1a98e63a5eee"
    },
    _id: "6974bf2e3c2a1a98e63a5eed",
    createdAt: "2026-01-24T12:46:38.732Z",
  });
  const [selectedDream, setSelectedDream] = useState<DreamListResponse | null>(
    null,
  );

  const { mutate: createDream } = useCreateDream();

  const handleSaveDream = (content: string) => {
    createDream(
      {
        dreamText: content,
        userId: "iiei",
      },
      {
        onSuccess: (data) => {
          console.log("Dream analysis successful ✅", data);
        },
        onError: (error) => {
          console.error("Dream analysis failed ❌", error);
        },
      },
    );
  };

  const handleSelectDream = (dream: DreamListResponse) => {
    setSelectedDream(dream);
    setCurrentView("details");
  };

  // const handleDeleteDream = (id: string) => {
  //   setDream(dreams.filter((d) => d.id !== id));
  // };

  const renderView = () => {
    switch (currentView) {
      case "landing":
        return <LandingPage onGetStarted={() => setCurrentView("journal")} />;
      case "capture":
        return (
          <DreamCapture
            onSave={handleSaveDream}
            onBack={() => setCurrentView("journal")}
          />
        );
      case "journal":
        return (
          <DreamJournal
            dreams={dreams as DreamListResponse[]}
            onNewDream={() => setCurrentView("capture")}
            onBack={() => setCurrentView("landing")}
            onSelectDream={handleSelectDream}
          />
        );
      // case "insights":
      //   return (
      //     <InsightsDashboard
      //       onBack={() => setCurrentView("journal")}
      //       dreamCount={dreams.length}
      //     />
      //   );
      case "details":
        return selectedDream ? (
          <DreamDetails
            dream={dream}
            onBack={() => setCurrentView("journal")}
            // onDelete={handleDeleteDream}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {!loadingAllDreams && renderView()}

      {/* Floating Navigation */}
      {currentView !== "landing" && (
        <div className="fixed bottom-6 right-6 flex gap-2">
          {currentView === "journal" && (
            <button
              onClick={() => setCurrentView("insights")}
              className="px-4 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity shadow-lg"
            >
              Insights
            </button>
          )}
        </div>
      )}
    </main>
  );
}
