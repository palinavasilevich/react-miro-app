export type User = {
  id: string;
  email: string;
  password: string;
};

export type Board = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt: string;
  isFavorite: boolean;
};

function randomDate() {
  const start = new Date();
  start.setDate(start.getDate() - 30);
  const end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  ).toISOString();
}

function generateBoardName() {
  const adjectives = [
    "Strategic", "Creative", "Innovative", "Annual", "Quarterly",
    "Important", "Urgent", "Key", "Long-term", "Operational",
    "Tactical", "Analytical", "Research",
  ];
  const nouns = [
    "Plan", "Project", "Design", "Report", "Analysis",
    "Concept", "Process", "Prototype", "Overview", "Presentation",
    "Marketing", "Development", "Budget", "Research", "Launch", "Meeting",
  ];
  const themes = [
    "Product", "Team", "Company", "Campaign", "Strategy",
    "Market", "Brand", "Business", "Project", "Quarter",
    "Year", "User", "Client",
  ];
  const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  return `${pick(adjectives)} ${pick(nouns)} ${pick(themes)}`;
}

export function generateBoards(count: number): Board[] {
  return Array.from({ length: count }, () => {
    const createdAt = randomDate();
    const updatedAt = new Date(
      new Date(createdAt).getTime() + Math.random() * 86400000 * 10,
    ).toISOString();
    const lastOpenedAt = new Date(
      new Date(updatedAt).getTime() + Math.random() * 86400000 * 5,
    ).toISOString();

    return {
      id: crypto.randomUUID(),
      name: generateBoardName(),
      createdAt,
      updatedAt,
      lastOpenedAt,
      isFavorite: Math.random() > 0.7,
    };
  });
}

export type StickerNode = {
  id: string;
  type: "sticker";
  text: string;
  x: number;
  y: number;
};

// boardId -> nodes[]
export const nodesByBoard = new Map<string, StickerNode[]>();

export const users: User[] = [
  { id: "1", email: "admin@gmail.com", password: "123456" },
];

// userId -> boards[]
export const boardsByUser = new Map<string, Board[]>([
  ["1", generateBoards(100)],
]);
