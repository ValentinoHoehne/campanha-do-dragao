export type ClassId = "guerreiro" | "mago" | "ladino" | "arqueiro" | "hibrido";

export type DamageType = "fisico" | "especial";

export interface HeroClass {
  id: ClassId;
  name: string;
  emoji: string;
  desc: string;
  lore: string;
  hp: number;
  atk: number; // ataque físico
  def: number; // defesa física
  satk: number; // ataque especial
  sdef: number; // defesa especial
  attackType: DamageType; // tipo do ataque básico
  skillType: DamageType;
  skillName: string;
  skillDesc: string;
  skillCost: number;
  spriteRow?: number;
  spriteCol?: number;
  spriteSheet?: "blue" | "red";
}

export const CLASSES: HeroClass[] = [
  {
    id: "guerreiro",
    name: "Guerreiro",
    emoji: "🛡️",
    desc: "Tanque bruto das Sentinelas do Núcleo Azul.",
    lore: "Elite defensiva das Sentinelas do Núcleo Azul, treinado para ser a barreira intransponível contra a corrupção vermelha.",
    hp: 115,
    atk: 13,
    def: 8,
    satk: 4,
    sdef: 5,
    attackType: "fisico",
    skillType: "fisico",
    skillName: "Golpe Brutal",
    skillDesc: "Dano pesado (x2) ignorando metade da defesa.",
    skillCost: 3,
    spriteRow: 0,
    spriteCol: 2,
    spriteSheet: "blue",
  },
  {
    id: "mago",
    name: "Mago",
    emoji: "🔮",
    desc: "Canalizador das energias puras do Núcleo Azul.",
    lore: "Um mestre das energias azuis, capaz de purificar a instabilidade elemental deixada pela Ordem Vermelha.",
    hp: 85,
    atk: 12,
    def: 3,
    satk: 22,
    sdef: 11,
    attackType: "especial",
    skillType: "especial",
    skillName: "Bola de Fogo",
    skillDesc: "Explosão mágica (x2.4) que ignora a defesa.",
    skillCost: 4,
    spriteRow: 1,
    spriteCol: 2,
    spriteSheet: "blue",
  },
  {
    id: "ladino",
    name: "Bandido",
    emoji: "🗡️",
    desc: "Ex-membro da Ordem Vermelha, agora leal ao Azul.",
    lore: "Após desertar da Legião de Sangue, ele usa seu conhecimento das sombras para sabotar os planos dos antigos aliados.",
    hp: 95,
    atk: 17,
    def: 5,
    satk: 6,
    sdef: 5,
    attackType: "fisico",
    skillType: "fisico",
    skillName: "Ataque Furtivo",
    skillDesc: "Acerto crítico garantido (x2.2) e +ouro.",
    skillCost: 3,
    spriteRow: 2,
    spriteCol: 2,
    spriteSheet: "blue",
  },
  {
    id: "arqueiro",
    name: "Arqueiro",
    emoji: "🏹",
    desc: "Atirador de precisão das Sentinelas.",
    lore: "Seus arcos disparam flechas de luz azul pura, criadas a partir de energia condensada do Núcleo, tornando-o letal à distância.",
    hp: 92,
    atk: 20,
    def: 6,
    satk: 5,
    sdef: 4,
    attackType: "fisico",
    skillType: "fisico",
    skillName: "Chuva de Luz",
    skillDesc: "Rajada de flechas luminosas (x2.1 físico) ignorando metade da defesa.",
    skillCost: 3,
    spriteRow: 3,
    spriteCol: 2,
    spriteSheet: "blue",
  },
  {
    id: "hibrido",
    name: "Guerreiro Híbrido",
    emoji: "🐲",
    desc: "Guerreiro que domina o equilíbrio do Núcleo.",
    lore: "Um defensor que absorveu a essência equilibrada do Núcleo Azul, liberando chamas purificadoras contra o Vazio.",
    hp: 102,
    atk: 12,
    def: 6,
    satk: 18,
    sdef: 9,
    attackType: "especial",
    skillType: "especial",
    skillName: "Sopro Flamejante",
    skillDesc: "Jato de fogo (x2.3 especial) que ignora a defesa especial.",
    skillCost: 4,
    spriteRow: 4,
    spriteCol: 2,
    spriteSheet: "blue",
  },
];

export interface Enemy {
  name: string;
  emoji: string;
  hp: number;
  atk: number; // ataque físico
  def: number; // defesa física
  satk?: number; // ataque especial (padrão derivado)
  sdef?: number; // defesa especial (padrão derivado)
  attackType?: DamageType;
  xp: number;
  gold: number;
  boss?: boolean;
  spriteRow?: number;
  spriteCol?: number;
  spriteSheet?: "blue" | "red";
}

export interface Stage {
  id: number;
  name: string;
  zone: string;
  world?: string;
  enemies: Enemy[];
  postBossMessage?: string;
}

export const WORLD_1 = "Mundo I — Terras Devastadas";
export const WORLD_2 = "Mundo II — Reino das Cinzas";
export const WORLD_3 = "Mundo III — Abismo Arcano";
export const WORLD_4 = "Mundo IV — Reino Celestial";
export const WORLD_5 = "Mundo V — O Coração Partido";

export const STAGES: Stage[] = [
  {
    id: 1,
    name: "Fronteira Ocupada",
    zone: "Terras Devastadas",
    world: WORLD_1,
    enemies: [
      { name: "Recruta Vermelho", emoji: "👤", hp: 40, atk: 8, def: 2, xp: 20, gold: 12, spriteRow: 0, spriteCol: 0 },
      { name: "Soldado da Ordem Vermelha", emoji: "👤", hp: 52, atk: 10, def: 3, xp: 26, gold: 16, spriteRow: 1, spriteCol: 0 },
    ],
  },
  {
    id: 2,
    name: "Vila Sitiada",
    zone: "Terras Devastadas",
    world: WORLD_1,
    enemies: [
      { name: "Batedor Vermelho", emoji: "👤", hp: 70, atk: 14, def: 4, xp: 40, gold: 24, spriteRow: 2, spriteCol: 0 },
      { name: "Assassino Vermelho", emoji: "👤", hp: 80, atk: 16, def: 5, xp: 48, gold: 30, spriteRow: 3, spriteCol: 0 },
    ],
  },
  {
    id: 3,
    name: "Acampamento da Ruína",
    zone: "Terras Devastadas",
    world: WORLD_1,
    enemies: [
      {
        name: "COMANDANTE DA RUÍNA",
        emoji: "👤",
        hp: 200,
        atk: 24,
        def: 12,
        xp: 150,
        gold: 100,
        boss: true,
        spriteRow: 0,
        spriteCol: 4,
      },
    ],
    postBossMessage: "Um fragmento despertou. Faltam quatro.",
  },
  {
    id: 4,
    name: "Passagem das Cinzas",
    zone: "Reino das Cinzas",
    world: WORLD_2,
    enemies: [
      { name: "Piromante Vermelho", emoji: "👤", hp: 160, atk: 28, def: 10, xp: 120, gold: 85, spriteRow: 1, spriteCol: 4 },
      { name: "Cruzado Carbonizado", emoji: "👤", hp: 180, atk: 32, def: 12, xp: 140, gold: 95, spriteRow: 2, spriteCol: 4 },
    ],
  },
  {
    id: 5,
    name: "Palácio de Fogo",
    zone: "Reino das Cinzas",
    world: WORLD_2,
    enemies: [
      {
        name: "LORDE DAS CINZAS",
        emoji: "👤",
        hp: 380,
        atk: 42,
        def: 18,
        xp: 400,
        gold: 300,
        boss: true,
        spriteRow: 3, spriteCol: 4,
      },
    ],
    postBossMessage: "Você continua reunindo os fragmentos... exatamente como ele planejou.",
  },
  {
    id: 6,
    name: "Cidadela Arcaica",
    zone: "Abismo Arcano",
    world: WORLD_3,
    enemies: [
      { name: "Mago do Abismo Vermelho", emoji: "👤", hp: 280, atk: 48, def: 20, xp: 280, gold: 180, spriteRow: 4, spriteCol: 0 },
      { name: "Inquisidor Arcano", emoji: "👤", hp: 300, atk: 54, def: 22, xp: 300, gold: 200, spriteRow: 4, spriteCol: 1 },
    ],
  },
  {
    id: 7,
    name: "Torre do Selo",
    zone: "Abismo Arcano",
    world: WORLD_3,
    enemies: [
      {
        name: "ARQUIMAGO RENEGADO",
        emoji: "👤",
        hp: 600,
        atk: 68,
        def: 26,
        xp: 700,
        gold: 500,
        boss: true,
        spriteRow: 4,
        spriteCol: 4,
      },
    ],
    postBossMessage: "O Núcleo não era apenas uma fonte de energia. Era também um selo.",
  },
  {
    id: 8,
    name: "Templo da Luz",
    zone: "Reino Celestial",
    world: WORLD_4,
    enemies: [
      { name: "Paladino Corrompido", emoji: "👤", hp: 450, atk: 78, def: 32, xp: 550, gold: 350, spriteRow: 0, spriteCol: 3 },
      { name: "Guardião da Ordem Vermelha", emoji: "👤", hp: 500, atk: 82, def: 40, xp: 600, gold: 380, spriteRow: 1, spriteCol: 3 },
    ],
  },
  {
    id: 9,
    name: "Portões do Éter",
    zone: "Reino Celestial",
    world: WORLD_4,
    enemies: [
      {
        name: "GENERAL DO VAZIO",
        emoji: "👤",
        hp: 850,
        atk: 96,
        def: 45,
        xp: 1200, gold: 800,
        boss: true,
        spriteRow: 2, spriteCol: 3,
      },
    ],
    postBossMessage: "A energia celestial está diretamente ligada ao Núcleo. O Arquiteto aguarda.",
  },
  {
    id: 10,
    name: "Fronteira do Vazio",
    zone: "O Coração Partido",
    world: WORLD_5,
    enemies: [
      { name: "Arauto do Colapso Vermelho", emoji: "👤", hp: 600, atk: 105, def: 42, xp: 900, gold: 600, spriteRow: 5, spriteCol: 0 },
      { name: "Executor da Ordem", emoji: "👤", hp: 650, atk: 112, def: 46, xp: 950, gold: 650, spriteRow: 5, spriteCol: 1 },
    ],
  },
  {
    id: 11,
    name: "O Altar do Núcleo",
    zone: "O Coração Partido",
    world: WORLD_5,
    enemies: [
      {
        name: "O CAMPEÃO DO NÚCLEO VERMELHO",
        emoji: "👤",
        hp: 1200,
        atk: 135,
        def: 60,
        xp: 2500,
        gold: 1500,
        boss: true,
        spriteRow: 0,
        spriteCol: 5,
        spriteSheet: "red",
      },
    ],
    postBossMessage: "A energia corrompida foi liberada. O Arquiteto se revela.",
  },
  {
    id: 12,
    name: "Confronto Final",
    zone: "O Coração Partido",
    world: WORLD_5,
    enemies: [
      {
        name: "O ARQUITETO",
        emoji: "👤",
        hp: 1800,
        atk: 160,
        def: 75,
        xp: 5000,
        gold: 3000,
        boss: true,
        spriteRow: 3, spriteCol: 5,
      },
    ],
    postBossMessage: "O Núcleo foi restaurado. Mas o que despertou não deveria existir...",
  },
];

export function stageWorld(s: Stage): string {
  return s.world ?? WORLD_1;
}

export const FINAL_STAGE_ID = 12;


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
    dropChance: 0.45,
    rarityBonus: 0,
  },
  {
    id: "medio",
    name: "Médio",
    emoji: "🟡",
    desc: "Equilibrado. Drops decentes.",
    enemyMult: 1,
    rewardMult: 1,
    dropChance: 0.6,
    rarityBonus: 0.12,
  },
  {
    id: "dificil",
    name: "Difícil",
    emoji: "🔴",
    desc: "Inimigos brutais, mas os melhores itens.",
    enemyMult: 1.45,
    rewardMult: 1.7,
    dropChance: 0.85,
    rarityBonus: 0.3,
  },
];

export function getDifficulty(id: Difficulty): DifficultyDef {
  return DIFFICULTIES.find((d) => d.id === id) ?? DIFFICULTIES[1]!;
}

export function enemySAtk(e: Enemy) {
  return e.satk ?? Math.round(e.atk * 0.7);
}

export function enemySDef(e: Enemy) {
  return e.sdef ?? Math.round(e.def * 0.8);
}

export function enemyAtkFor(e: Enemy, type: DamageType) {
  return type === "especial" ? enemySAtk(e) : e.atk;
}

export function enemyDefFor(e: Enemy, type: DamageType) {
  return type === "especial" ? enemySDef(e) : e.def;
}

export function scaleEnemy(enemy: Enemy, diff: DifficultyDef): Enemy {
  return {
    ...enemy,
    hp: Math.round(enemy.hp * diff.enemyMult),
    atk: Math.round(enemy.atk * diff.enemyMult),
    def: Math.round(enemy.def * diff.enemyMult),
    satk: Math.round(enemySAtk(enemy) * diff.enemyMult),
    sdef: Math.round(enemySDef(enemy) * diff.enemyMult),
    attackType: enemy.attackType ?? "fisico",
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
  atk: number; // ataque físico
  def: number; // defesa física
  satk?: number; // ataque especial
  sdef?: number; // defesa especial
  hp: number;
  crit: number; // % de chance de crítico
  spriteRow?: number;
  spriteCol?: number;
  spriteSheet?: "blue" | "red";
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

const SLOT_BASES: Record<
  Slot,
  { names: string[]; emojis: string[]; atk: number; def: number; satk: number; sdef: number; hp: number; crit: number; spriteCol: number }
> = {
  arma: {
    names: ["Lâmina", "Machado", "Cajado", "Adaga", "Martelo", "Arco"],
    emojis: ["⚔️", "🪓", "🔱", "🗡️", "🔨", "🏹"],
    atk: 5,
    def: 0,
    satk: 4,
    sdef: 0,
    hp: 0,
    crit: 3,
    spriteCol: 0,
  },
  armadura: {
    names: ["Peitoral", "Manto", "Cota", "Couraça"],
    emojis: ["🛡️", "🧥", "🥋", "🦺"],
    atk: 0,
    def: 4,
    satk: 0,
    sdef: 3,
    hp: 14,
    crit: 0,
    spriteCol: 1,
  },
  acessorio: {
    names: ["Botas", "Botinas", "Grevilhas", "Sandálias"],
    emojis: ["👢", "👞", "👟", "🥾"],
    atk: 2,
    def: 1,
    satk: 2,
    sdef: 1,
    hp: 8,
    crit: 4,
    spriteCol: 2,
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
  const focus: DamageType = Math.random() < 0.5 ? "fisico" : "especial";
  return {
    uid: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: `${pick(base.names)} ${pick(SUFFIXES[rarity])}`,
    emoji: pick(base.emojis),
    slot,
    rarity,
    atk: Math.round(base.atk * scale * jitter() * (focus === "fisico" ? 1.25 : 0.45)),
    def: Math.round(base.def * scale * jitter() * (focus === "fisico" ? 1.2 : 0.6)),
    satk: Math.round(base.satk * scale * jitter() * (focus === "especial" ? 1.25 : 0.45)),
    sdef: Math.round(base.sdef * scale * jitter() * (focus === "especial" ? 1.2 : 0.6)),
    hp: Math.round(base.hp * scale * jitter()),
    crit: Math.round(base.crit * rd.mult * jitter()),
    spriteRow: 0,
    spriteCol: base.spriteCol,
  };
}

/* --- Drops exclusivos do chefe do Abismo Estelar (estágio 11) --- */

const ABYSS_BOSS_ITEMS: Omit<Item, "uid">[] = [
  {
    name: "Lâmina de Nyxaroth",
    emoji: "🌠",
    slot: "arma",
    rarity: "lendario",
    atk: 62,
    def: 0,
    hp: 0,
    crit: 22,
    spriteRow: 0,
    spriteCol: 0,
  },
  {
    name: "Couraça do Vazio",
    emoji: "🌑",
    slot: "armadura",
    rarity: "lendario",
    atk: 0,
    def: 48,
    hp: 180,
    crit: 0,
    spriteRow: 0,
    spriteCol: 1,
  },
  {
    name: "Pegadas do Abismo",
    emoji: "👣",
    slot: "acessorio",
    rarity: "lendario",
    atk: 24,
    def: 14,
    hp: 90,
    crit: 30,
    spriteRow: 0,
    spriteCol: 2,
  },
];

export function rollBossExclusive(stageId: number): Item | null {
  if (stageId !== FINAL_STAGE_ID) return null;
  const base = pick(ABYSS_BOSS_ITEMS);
  const jitter = () => 0.92 + Math.random() * 0.16;
  return {
    ...base,
    uid: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    atk: Math.round(base.atk * jitter()),
    def: Math.round(base.def * jitter()),
    hp: Math.round(base.hp * jitter()),
    crit: Math.round(base.crit * jitter()),
    spriteRow: 0,
    spriteCol: base.spriteCol,
  };
}


export function itemPower(i: Item) {
  return (i.atk + (i.satk ?? 0)) * 3 + (i.def + (i.sdef ?? 0)) * 3 + i.hp + i.crit * 2;
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
  statPoints: number;
  cleared: boolean;
  abyssCleared?: boolean;

  difficulty: Difficulty;
  inventory: Item[];
  equipped: Partial<Record<Slot, Item>>;
  consecutiveLosses: number;
  battleDeaths: number;
  lastBattleStageId: number;
  unlockedChronicles: string[];
  runsCompleted: number;
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

export function heroSAtk(save: Save) {
  const base = CLASSES.find((c) => c.id === save.classId)!;
  return base.satk + (save.level - 1) * 3 + gearSum(save, "satk");
}

export function heroSDef(save: Save) {
  const base = CLASSES.find((c) => c.id === save.classId)!;
  return base.sdef + (save.level - 1) * 1.5 + gearSum(save, "sdef");
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
    statPoints: 0,
    cleared: false,
    abyssCleared: false,
    difficulty: "medio",
    inventory: [],
    equipped: {},
    consecutiveLosses: 0,
    battleDeaths: 0,
    lastBattleStageId: 0,
    unlockedChronicles: [],
    runsCompleted: 0,
  };
}

export function migrate(s: Save): Save {
  return {
    ...s,
    statPoints: s.statPoints ?? 0,
    difficulty: s.difficulty ?? "medio",
    abyssCleared: s.abyssCleared ?? false,
    inventory: Array.isArray(s.inventory) ? s.inventory : [],
    equipped: s.equipped ?? {},
    consecutiveLosses: s.consecutiveLosses ?? 0,
    battleDeaths: s.battleDeaths ?? 0,
    lastBattleStageId: s.lastBattleStageId ?? 0,
    unlockedChronicles: s.unlockedChronicles ?? [],
    runsCompleted: s.runsCompleted ?? 0,
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

/* ---------------- Crônicas ---------------- */

export interface ChronicleEntry {
  id: string;
  title: string;
  desc: string;
}

export const CHRONICLES: ChronicleEntry[] = [
  {
    id: "fragmento_1",
    title: "Fragmento I: O Despertar",
    desc: "Um fragmento misterioso de energia pura, recuperado nas Terras Devastadas. O mundo começa a reagir à sua presença.",
  },
  {
    id: "fragmento_2",
    title: "Fragmento II: A Manipulação",
    desc: "O Senhor das Cinzas sugeriu que a nossa busca pelos fragmentos faz parte de um plano maior. Alguém nos observa.",
  },
  {
    id: "fragmento_3",
    title: "Fragmento III: O Selo",
    desc: "Registros antigos no Abismo Arcano revelem que o Núcleo não era apenas energia; era uma prisão para algo terrível.",
  },
  {
    id: "fragmento_4",
    title: "Fragmento IV: A Conexão",
    desc: "A energia celestial pulsa em sincronia com os fragmentos. O Arquiteto está perto de concluir sua obra.",
  },
  {
    id: "revelacao",
    title: "Revelação: A Verdade",
    desc: "O Núcleo foi restaurado, mas a vitória foi uma ilusão. Nós libertamos o Vazio. O verdadeiro inimigo despertou.",
  },
];
