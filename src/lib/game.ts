export type ClassId = "guerreiro" | "mago" | "ladino";

export interface HeroClass {
  id: ClassId;
  name: string;
  emoji: string;
  desc: string;
  hp: number;
  atk: number;
  def: number;
  skillName: string;
  skillDesc: string;
  skillCost: number;
}

export const CLASSES: HeroClass[] = [
  {
    id: "guerreiro",
    name: "Guerreiro",
    emoji: "🛡️",
    desc: "Tanque bruto. Muita vida, aguenta pancada.",
    hp: 120,
    atk: 14,
    def: 8,
    skillName: "Golpe Brutal",
    skillDesc: "Dano pesado (x2) ignorando metade da defesa.",
    skillCost: 3,
  },
  {
    id: "mago",
    name: "Mago",
    emoji: "🔮",
    desc: "Dano mágico alto, mas frágil.",
    hp: 85,
    atk: 22,
    def: 3,
    skillName: "Bola de Fogo",
    skillDesc: "Explosão mágica (x2.4) que ignora a defesa.",
    skillCost: 4,
  },
  {
    id: "ladino",
    name: "Ladino",
    emoji: "🗡️",
    desc: "Rápido e crítico. Rouba ouro extra.",
    hp: 95,
    atk: 17,
    def: 5,
    skillName: "Ataque Furtivo",
    skillDesc: "Acerto crítico garantido (x2.2) e +ouro.",
    skillCost: 3,
  },
];

export interface Enemy {
  name: string;
  emoji: string;
  hp: number;
  atk: number;
  def: number;
  xp: number;
  gold: number;
  boss?: boolean;
}

export interface Stage {
  id: number;
  name: string;
  zone: string;
  enemies: Enemy[];
}

export const STAGES: Stage[] = [
  {
    id: 1,
    name: "Vila Inicial",
    zone: "Planície dos Novatos",
    enemies: [
      { name: "Slime Azul", emoji: "🟦", hp: 40, atk: 8, def: 2, xp: 20, gold: 12 },
      { name: "Rato Gigante", emoji: "🐀", hp: 52, atk: 10, def: 3, xp: 26, gold: 16 },
    ],
  },
  {
    id: 2,
    name: "Floresta Sombria",
    zone: "Bosque Amaldiçoado",
    enemies: [
      { name: "Lobo Faminto", emoji: "🐺", hp: 70, atk: 14, def: 4, xp: 40, gold: 24 },
      { name: "Aranha Venenosa", emoji: "🕷️", hp: 80, atk: 16, def: 5, xp: 48, gold: 30 },
    ],
  },
  {
    id: 3,
    name: "Mina Abandonada",
    zone: "Túneis de Obsidiana",
    enemies: [
      { name: "Goblin Minerador", emoji: "👺", hp: 100, atk: 19, def: 7, xp: 65, gold: 45 },
      { name: "Golem de Pedra", emoji: "🪨", hp: 140, atk: 21, def: 12, xp: 85, gold: 60 },
    ],
  },
  {
    id: 4,
    name: "Castelo de Gelo",
    zone: "Pico Congelado",
    enemies: [
      { name: "Cavaleiro Gélido", emoji: "🧊", hp: 160, atk: 26, def: 12, xp: 110, gold: 80 },
      { name: "Feiticeira do Norte", emoji: "❄️", hp: 150, atk: 32, def: 8, xp: 130, gold: 95 },
    ],
  },
  {
    id: 5,
    name: "Vulcão Ancião",
    zone: "Cratera Escaldante",
    enemies: [
      { name: "Imp Flamejante", emoji: "🔥", hp: 190, atk: 34, def: 12, xp: 165, gold: 120 },
      { name: "Guardião de Lava", emoji: "🌋", hp: 240, atk: 38, def: 16, xp: 200, gold: 150 },
    ],
  },
  {
    id: 6,
    name: "Trono do Dragão",
    zone: "Fim da Campanha",
    enemies: [
      {
        name: "DRAGÃO SOMBRIO",
        emoji: "🐉",
        hp: 420,
        atk: 46,
        def: 20,
        xp: 500,
        gold: 400,
        boss: true,
      },
    ],
  },
];

export interface Save {
  classId: ClassId;
  name: string;
  level: number;
  xp: number;
  gold: number;
  potions: number;
  stage: number; // highest unlocked stage id
  bonusAtk: number;
  bonusDef: number;
  bonusHp: number;
  cleared: boolean;
}

export const SAVE_KEY = "rpg-campanha-save-v1";

export function xpToNext(level: number) {
  return Math.round(50 * Math.pow(1.45, level - 1));
}

export function maxHp(save: Save) {
  const base = CLASSES.find((c) => c.id === save.classId)!;
  return base.hp + (save.level - 1) * 14 + save.bonusHp;
}

export function heroAtk(save: Save) {
  const base = CLASSES.find((c) => c.id === save.classId)!;
  return base.atk + (save.level - 1) * 3 + save.bonusAtk;
}

export function heroDef(save: Save) {
  const base = CLASSES.find((c) => c.id === save.classId)!;
  return base.def + (save.level - 1) * 1.5 + save.bonusDef;
}

export function newSave(classId: ClassId, name: string): Save {
  return {
    classId,
    name,
    level: 1,
    xp: 0,
    gold: 30,
    potions: 3,
    stage: 1,
    bonusAtk: 0,
    bonusDef: 0,
    bonusHp: 0,
    cleared: false,
  };
}

export function loadSave(): Save | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    return raw ? (JSON.parse(raw) as Save) : null;
  } catch {
    return null;
  }
}

export function persist(save: Save) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

export function damage(atk: number, def: number, variance = 0.15) {
  const raw = Math.max(1, atk - def * 0.6);
  const v = 1 + (Math.random() * 2 - 1) * variance;
  return Math.max(1, Math.round(raw * v));
}

export function getStage(id: number): Stage {
  return STAGES.find((s) => s.id === id) ?? STAGES[STAGES.length - 1]!;
}

export function pickEnemy(stage: Stage): Enemy {
  return stage.enemies[Math.floor(Math.random() * stage.enemies.length)]!;
}
