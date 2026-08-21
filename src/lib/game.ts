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
  world?: string;
  enemies: Enemy[];
}

export const WORLD_1 = "Mundo I — Reinos de Eldra";
export const WORLD_2 = "Mundo II — Abismo Estelar";

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
  {
    id: 7,
    name: "Portal Estelar",
    zone: "Abismo Estelar",
    world: WORLD_2,
    enemies: [
      { name: "Espectro Sideral", emoji: "👻", hp: 300, atk: 52, def: 22, xp: 320, gold: 220 },
      { name: "Larva do Vazio", emoji: "🪱", hp: 340, atk: 48, def: 26, xp: 340, gold: 235 },
    ],
  },
  {
    id: 8,
    name: "Jardim de Cristal",
    zone: "Abismo Estelar",
    world: WORLD_2,
    enemies: [
      { name: "Golem Prismático", emoji: "💎", hp: 400, atk: 60, def: 32, xp: 420, gold: 290 },
      { name: "Mariposa Astral", emoji: "🦋", hp: 360, atk: 68, def: 24, xp: 440, gold: 305 },
    ],
  },
  {
    id: 9,
    name: "Mar de Antimatéria",
    zone: "Abismo Estelar",
    world: WORLD_2,
    enemies: [
      { name: "Kraken do Vazio", emoji: "🦑", hp: 500, atk: 76, def: 36, xp: 560, gold: 380 },
      { name: "Devorador de Luz", emoji: "🕳️", hp: 470, atk: 84, def: 30, xp: 590, gold: 400 },
    ],
  },
  {
    id: 10,
    name: "Cidadela Quebrada",
    zone: "Abismo Estelar",
    world: WORLD_2,
    enemies: [
      { name: "Sentinela Ruína", emoji: "🤖", hp: 620, atk: 96, def: 46, xp: 760, gold: 520 },
      { name: "Arauto do Colapso", emoji: "☄️", hp: 580, atk: 108, def: 40, xp: 800, gold: 550 },
    ],
  },
  {
    id: 11,
    name: "Coração do Abismo",
    zone: "Fim do Abismo Estelar",
    world: WORLD_2,
    enemies: [
      {
        name: "NYXAROTH, O DEVORADOR",
        emoji: "🌌",
        hp: 1100,
        atk: 128,
        def: 58,
        xp: 2000,
        gold: 1500,
        boss: true,
      },
    ],
  },
];

export function stageWorld(s: Stage): string {
  return s.world ?? WORLD_1;
}

export const FINAL_STAGE_ID = 11;


/* ---------------- Dificuldade ---------------- */

export type Difficulty = "facil" | "medio" | "dificil";

export interface DifficultyDef {
  id: Difficulty;
  name: string;
  emoji: string;
  desc: string;
  enemyMult: number; // vida/ataque/defesa do inimigo
  rewardMult: number; // xp e ouro
  dropChance: number; // chance de drop por vitória
  rarityBonus: number; // empurra a raridade pra cima
}

export const DIFFICULTIES: DifficultyDef[] = [
  {
    id: "facil",
    name: "Fácil",
    emoji: "🟢",
    desc: "Inimigos fracos. Bom pra treinar.",
    enemyMult: 0.75,
    rewardMult: 0.8,
    dropChance: 0.35,
    rarityBonus: 0,
  },
  {
    id: "medio",
    name: "Médio",
    emoji: "🟡",
    desc: "Equilibrado. Drops decentes.",
    enemyMult: 1,
    rewardMult: 1,
    dropChance: 0.5,
    rarityBonus: 0.12,
  },
  {
    id: "dificil",
    name: "Difícil",
    emoji: "🔴",
    desc: "Inimigos brutais, mas os melhores itens.",
    enemyMult: 1.45,
    rewardMult: 1.7,
    dropChance: 0.72,
    rarityBonus: 0.3,
  },
];

export function getDifficulty(id: Difficulty): DifficultyDef {
  return DIFFICULTIES.find((d) => d.id === id) ?? DIFFICULTIES[1]!;
}

export function scaleEnemy(enemy: Enemy, diff: DifficultyDef): Enemy {
  return {
    ...enemy,
    hp: Math.round(enemy.hp * diff.enemyMult),
    atk: Math.round(enemy.atk * diff.enemyMult),
    def: Math.round(enemy.def * diff.enemyMult),
    xp: Math.round(enemy.xp * diff.rewardMult),
    gold: Math.round(enemy.gold * diff.rewardMult),
  };
}

/* ---------------- Itens / Drops ---------------- */

export type Slot = "arma" | "armadura" | "acessorio";
export type Rarity = "comum" | "raro" | "epico" | "lendario";

export interface Item {
  uid: string;
  name: string;
  emoji: string;
  slot: Slot;
  rarity: Rarity;
  atk: number;
  def: number;
  hp: number;
  crit: number; // % de chance de crítico
}

export const RARITIES: { id: Rarity; name: string; color: string; mult: number; weight: number }[] = [
  { id: "comum", name: "Comum", color: "text-muted-foreground", mult: 1, weight: 0.58 },
  { id: "raro", name: "Raro", color: "text-mana", mult: 1.6, weight: 0.27 },
  { id: "epico", name: "Épico", color: "text-xp", mult: 2.4, weight: 0.12 },
  { id: "lendario", name: "Lendário", color: "text-gold", mult: 3.6, weight: 0.03 },
];

export function rarityDef(r: Rarity) {
  return RARITIES.find((x) => x.id === r) ?? RARITIES[0]!;
}

const SLOT_BASES: Record<Slot, { names: string[]; emojis: string[]; atk: number; def: number; hp: number; crit: number }> = {
  arma: {
    names: ["Lâmina", "Machado", "Cajado", "Adaga", "Martelo"],
    emojis: ["⚔️", "🪓", "🔱", "🗡️", "🔨"],
    atk: 5,
    def: 0,
    hp: 0,
    crit: 3,
  },
  armadura: {
    names: ["Peitoral", "Manto", "Cota", "Couraça"],
    emojis: ["🛡️", "🧥", "🥋", "🦺"],
    atk: 0,
    def: 4,
    hp: 14,
    crit: 0,
  },
  acessorio: {
    names: ["Anel", "Amuleto", "Talismã", "Elmo"],
    emojis: ["💍", "📿", "🔮", "⛑️"],
    atk: 2,
    def: 1,
    hp: 8,
    crit: 4,
  },
};

const SUFFIXES: Record<Rarity, string[]> = {
  comum: ["de Ferro", "Gasto", "do Novato"],
  raro: ["de Aço", "do Vento", "Rúnico"],
  epico: ["das Sombras", "do Vulcão", "Congelante"],
  lendario: ["do Dragão", "Eterno", "do Caos"],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function rollRarity(bonus: number): Rarity {
  const r = Math.random() - bonus;
  if (r < 0.03) return "lendario";
  if (r < 0.15) return "epico";
  if (r < 0.42) return "raro";
  return "comum";
}

export function rollDrop(stageId: number, diff: DifficultyDef, boss = false): Item | null {
  const chance = boss ? 1 : diff.dropChance;
  if (Math.random() > chance) return null;
  const slot = pick<Slot>(["arma", "armadura", "acessorio"]);
  const base = SLOT_BASES[slot];
  const rarity = boss
    ? rollRarity(diff.rarityBonus + 0.25)
    : rollRarity(diff.rarityBonus);
  const rd = rarityDef(rarity);
  const tier = 1 + (stageId - 1) * 0.55;
  const scale = tier * rd.mult;
  const jitter = () => 0.85 + Math.random() * 0.3;
  return {
    uid: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: `${pick(base.names)} ${pick(SUFFIXES[rarity])}`,
    emoji: pick(base.emojis),
    slot,
    rarity,
    atk: Math.round(base.atk * scale * jitter()),
    def: Math.round(base.def * scale * jitter()),
    hp: Math.round(base.hp * scale * jitter()),
    crit: Math.round(base.crit * rd.mult * jitter()),
  };
}

export function itemPower(i: Item) {
  return i.atk * 3 + i.def * 3 + i.hp + i.crit * 2;
}

export function sellPrice(i: Item) {
  return Math.max(5, Math.round(itemPower(i) * 0.6));
}

/* ---------------- Save ---------------- */

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
  difficulty: Difficulty;
  inventory: Item[];
  equipped: Partial<Record<Slot, Item>>;
}

export const SAVE_KEY = "rpg-campanha-save-v1";

export function xpToNext(level: number) {
  return Math.round(50 * Math.pow(1.45, level - 1));
}

export function equippedList(save: Save): Item[] {
  return Object.values(save.equipped ?? {}).filter(Boolean) as Item[];
}

function gearSum(save: Save, key: "atk" | "def" | "hp" | "crit") {
  return equippedList(save).reduce((t, i) => t + (i[key] || 0), 0);
}

export function maxHp(save: Save) {
  const base = CLASSES.find((c) => c.id === save.classId)!;
  return base.hp + (save.level - 1) * 14 + save.bonusHp + gearSum(save, "hp");
}

export function heroAtk(save: Save) {
  const base = CLASSES.find((c) => c.id === save.classId)!;
  return base.atk + (save.level - 1) * 3 + save.bonusAtk + gearSum(save, "atk");
}

export function heroDef(save: Save) {
  const base = CLASSES.find((c) => c.id === save.classId)!;
  return base.def + (save.level - 1) * 1.5 + save.bonusDef + gearSum(save, "def");
}

export function heroCrit(save: Save) {
  const base = save.classId === "ladino" ? 15 : 5;
  return Math.min(75, base + gearSum(save, "crit"));
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
    difficulty: "medio",
    inventory: [],
    equipped: {},
  };
}

export function migrate(s: Save): Save {
  return {
    ...s,
    difficulty: s.difficulty ?? "medio",
    inventory: Array.isArray(s.inventory) ? s.inventory : [],
    equipped: s.equipped ?? {},
  };
}

export function loadSave(): Save | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    return raw ? migrate(JSON.parse(raw) as Save) : null;
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
