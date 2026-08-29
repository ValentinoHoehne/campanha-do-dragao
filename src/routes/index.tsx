import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CLASSES,
  STAGES,
  FINAL_STAGE_ID,
  rollBossExclusive,
  stageWorld,
  DIFFICULTIES,
  damage,
  getStage,
  getDifficulty,
  scaleEnemy,
  pickEnemy,
  rollDrop,
  rarityDef,
  itemPower,
  sellPrice,
  heroAtk,
  heroDef,
  heroSAtk,
  heroSDef,
  heroCrit,
  loadSave,
  maxHp,
  newSave,
  persist,
  SAVE_KEY,
  xpToNext,
  enemySAtk,
  enemySDef,
  type ClassId,
  type Difficulty,
  type Enemy,
  type Item,
  type Save,
  type Slot,
  type ChronicleEntry,
  CHRONICLES,
} from "@/lib/game";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Campanha do Dragão — RPG de Turnos" },
      {
        name: "description",
        content:
          "Crie seu herói, escolha a dificuldade, colete drops, monte sua build e derrote o Dragão Sombrio em 6 estágios.",
      },
      { property: "og:title", content: "Campanha do Dragão — RPG de Turnos" },
      {
        property: "og:description",
        content: "RPG por turnos com classes, dificuldades, drops de itens, builds e chefão final.",
      },
    ],
  }),
  component: Game,
});

type Screen = "menu" | "create" | "hub" | "battle" | "shop" | "gear";

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="bar-track">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${pct}%`, backgroundColor: `var(--${color})` }}
      />
    </div>
  );
}

function StoryDialog({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/90 p-6 backdrop-blur-md">
      <div className="panel max-w-sm p-6 text-center shadow-2xl border-primary animate-in fade-in zoom-in duration-300">
        <div className="mb-4 text-4xl">📜</div>
        <p className="font-display text-lg leading-relaxed text-foreground italic mb-6">
          "{message}"
        </p>
        <button
          onClick={onClose}
          className="btn-block btn-block-press w-full bg-primary text-primary-foreground"
        >
          CONTINUAR
        </button>
      </div>
    </div>
  );
}

function Chronicles({
  unlocked,
  onClose,
}: {
  unlocked: string[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="panel w-full max-w-sm p-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-xl text-primary">Crônicas do Núcleo</h2>
          <button onClick={onClose} className="text-muted-foreground text-xs font-bold">FECHAR</button>
        </div>
        <div className="space-y-3">
          {CHRONICLES.map((c) => {
            const isUnlocked = unlocked.includes(c.id);
            return (
              <div key={c.id} className={`p-3 rounded-lg border-2 ${isUnlocked ? 'border-border bg-muted/30' : 'border-dashed border-muted opacity-50'}`}>
                <h3 className="text-sm font-black text-foreground mb-1">
                  {isUnlocked ? c.title : "???"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isUnlocked ? c.desc : "Continue sua jornada para revelar esta história."}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Game() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [save, setSave] = useState<Save | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const s = loadSave();
    if (s) setSave(s);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (save) persist(save);
  }, [save]);

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="font-display text-2xl text-muted-foreground">Carregando...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-4 pb-10 pt-16">
      <Navbar
        save={save}
        onMenuOpen={() => {}} // GameMenu uses its own state, let's refactor
        onReset={() => {
          try {
            localStorage.removeItem(SAVE_KEY);
          } catch { /* ignore */ }
          setSave(null);
          setScreen("menu");
        }}
        onHome={() => setScreen("menu")}
      />
      {screen === "menu" && (
        <Menu
          save={save}
          onContinue={() => setScreen("hub")}
          onNew={() => setScreen("create")}
        />
      )}
      {screen === "create" && (
        <Create
          onCreate={(id, name) => {
            setSave(newSave(id, name));
            setScreen("hub");
          }}
          onBack={() => setScreen("menu")}
        />
      )}
      {screen === "hub" && save && (
        <Hub
          save={save}
          setSave={setSave}
          onBattle={() => setScreen("battle")}
          onShop={() => setScreen("shop")}
          onGear={() => setScreen("gear")}
          onMenu={() => setScreen("menu")}
          onRecovery={() => {
            const newStage = Math.max(1, save.stage - 1);
            setSave({ ...save, stage: newStage, consecutiveLosses: 0 });
          }}
        />
      )}
      {screen === "shop" && save && (
        <Shop save={save} setSave={setSave} onBack={() => setScreen("hub")} />
      )}
      {screen === "gear" && save && (
        <Gear save={save} setSave={setSave} onBack={() => setScreen("hub")} />
      )}
      {screen === "battle" && save && (
        <Battle save={save} setSave={setSave} onExit={() => setScreen("hub")} />
      )}
    </main>
  );
}

function Navbar({
  save,
  onHome,
  onReset,
}: {
  save: Save | null;
  onHome: () => void;
  onReset: () => void;
  onMenuOpen: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [full, setFull] = useState(false);

  function close() {
    setOpen(false);
    setConfirm(false);
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setFull(false);
      } else {
        await document.documentElement.requestFullscreen();
        setFull(true);
      }
    } catch { /* não suportado */ }
    close();
  }

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-center bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="flex w-full max-w-md items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {save && (
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full border border-border/50">
                <span className="text-xs font-black text-gold">🪙 {save.gold}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() => setOpen(true)}
            className="btn-block btn-block-press h-9 w-9 !p-0 bg-secondary text-secondary-foreground"
          >
            <span className="flex flex-col gap-[3px] items-center">
              <span className="block h-[2px] w-4 rounded bg-current" />
              <span className="block h-[2px] w-4 rounded bg-current" />
              <span className="block h-[2px] w-4 rounded bg-current" />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end bg-background/80 p-3 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="panel mt-1 w-60 p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-3 px-1 text-lg text-primary">Menu</h2>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="btn-block btn-block-press w-full bg-primary text-primary-foreground"
                onClick={() => window.location.reload()}
              >
                Atualizar página
              </button>
              <button
                type="button"
                className="btn-block btn-block-press w-full bg-secondary text-secondary-foreground"
                onClick={() => {
                  onHome();
                  close();
                }}
              >
                Menu inicial
              </button>
              <button
                type="button"
                className="btn-block btn-block-press w-full bg-secondary text-secondary-foreground"
                onClick={toggleFullscreen}
              >
                {full ? "Sair da tela cheia" : "Tela cheia"}
              </button>
              {confirm ? (
                <button
                  type="button"
                  className="btn-block btn-block-press w-full bg-destructive text-destructive-foreground"
                  onClick={() => {
                    onReset();
                    close();
                  }}
                >
                  Confirmar exclusão
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!save}
                  className="btn-block btn-block-press w-full bg-destructive text-destructive-foreground"
                  onClick={() => setConfirm(true)}
                >
                  Apagar progresso
                </button>
              )}
              <button
                type="button"
                className="btn-block btn-block-press w-full bg-muted text-muted-foreground"
                onClick={close}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Title() {
  return (
    <header className="pb-6 text-center">
      <p className="font-display text-sm tracking-widest text-accent">CAMPANHA</p>
      <h1 className="text-4xl leading-none text-primary drop-shadow-[0_4px_0_rgba(0,0,0,0.45)]">
        DO DRAGÃO
      </h1>
      <p className="mt-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        RPG de combate por turnos
      </p>
    </header>
  );
}

function Menu({
  save,
  onContinue,
  onNew,
}: {
  save: Save | null;
  onContinue: () => void;
  onNew: () => void;
}) {
  return (
    <div className="flex min-h-[80vh] flex-col justify-center">
      <div className="mb-6 text-center text-7xl anim-idle">🐉</div>
      <Title />
      <div className="panel space-y-3 p-4">
        {save ? (
          <>
            <button
              onClick={onContinue}
              className="btn-block btn-block-press w-full bg-primary text-lg text-primary-foreground"
            >
              CONTINUAR
            </button>
            <p className="text-center text-xs text-muted-foreground">
              {save.name} • Nv. {save.level} • Estágio {save.stage}
            </p>
          </>
        ) : null}
        <button
          onClick={onNew}
          className="btn-block btn-block-press w-full bg-secondary text-secondary-foreground"
        >
          {save ? "NOVO JOGO" : "COMEÇAR AVENTURA"}
        </button>
      </div>
      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        O progresso é salvo automaticamente neste aparelho.
      </p>
    </div>
  );
}

function Create({
  onCreate,
  onBack,
}: {
  onCreate: (id: ClassId, name: string) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState("");
  const [picked, setPicked] = useState<ClassId>("guerreiro");

  return (
    <div>
      <Title />
      <label className="mb-1 block text-xs font-black uppercase tracking-widest text-muted-foreground">
        Nome do herói
      </label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value.slice(0, 14))}
        placeholder="Ex: Zoro_XxPRO"
        className="mb-5 w-full rounded-lg border-2 border-border bg-input px-3 py-3 text-base font-bold text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
      />

      <div className="space-y-3">
        {CLASSES.map((c) => {
          const active = picked === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setPicked(c.id)}
              className={`panel w-full p-3 text-left transition-transform ${
                active ? "border-primary" : "opacity-80"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl">{c.emoji}</span>
                <div className="flex-1">
                  <h3 className="text-xl text-foreground">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                  <p className="mt-1 text-[10px] italic text-accent/80 leading-tight line-clamp-2">
                    {c.lore}
                  </p>
                  <div className="mt-1 flex gap-3 text-[11px] font-black">
                    <span className="text-hp">HP {c.hp}</span>
                    <span className="text-primary">ATK {c.atk}</span>
                    <span className="text-accent">DEF {c.def}</span>
                  </div>
                </div>
              </div>
              <p className="mt-2 rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                ⚡ {c.skillName}: {c.skillDesc}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={onBack}
          className="btn-block btn-block-press flex-1 bg-secondary text-secondary-foreground"
        >
          VOLTAR
        </button>
        <button
          onClick={() => onCreate(picked, name.trim() || "Herói")}
          className="btn-block btn-block-press flex-[2] bg-primary text-primary-foreground"
        >
          JOGAR
        </button>
      </div>
    </div>
  );
}

function StatusBar({ save }: { save: Save }) {
  const cls = CLASSES.find((c) => c.id === save.classId)!;
  return (
    <div className="panel mb-4 p-3">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{cls.emoji}</span>
        <div className="flex-1">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg leading-none text-foreground">{save.name}</h2>
          </div>
          <p className="text-[11px] font-bold text-muted-foreground">
            {cls.name} • Nível {save.level}
          </p>
        </div>
      </div>
      <div className="mt-2">
        <Bar value={save.xp} max={xpToNext(save.level)} color="xp" />
        <p className="mt-1 text-[10px] font-bold text-muted-foreground">
          XP {save.xp}/{xpToNext(save.level)} • ❤️ {maxHp(save)} • ⚔️ {heroAtk(save)} • 🛡️{" "}
          {Math.round(heroDef(save))} • 🎯 {heroCrit(save)}% • 🧪 {save.potions}
        </p>
      </div>
    </div>
  );
}

function Hub({
  save,
  setSave,
  onBattle,
  onShop,
  onGear,
  onMenu,
  onRecovery,
}: {
  save: Save;
  setSave: (s: Save) => void;
  onBattle: () => void;
  onShop: () => void;
  onGear: () => void;
  onMenu: () => void;
  onRecovery: () => void;
}) {
  const [showChronicles, setShowChronicles] = useState(false);
  const stage = getStage(save.stage);
  const diff = getDifficulty(save.difficulty);
  return (
    <div>
      <StatusBar save={save} />

      {showChronicles && (
        <Chronicles
          unlocked={save.unlockedChronicles}
          onClose={() => setShowChronicles(false)}
        />
      )}

      {save.consecutiveLosses >= 3 && save.stage > 1 && (
        <div className="panel mb-4 border-accent p-3 text-center bg-accent/10">
          <h3 className="text-lg text-accent">Dificuldade Detectada ⚠️</h3>
          <p className="text-xs text-muted-foreground mb-2">
            Você perdeu {save.consecutiveLosses} vezes seguidas. Quer voltar um nível para treinar?
          </p>
          <button
            onClick={onRecovery}
            className="btn-block btn-block-press w-full bg-accent text-accent-foreground text-xs py-2"
          >
            VOLTAR UM ESTÁGIO
          </button>
        </div>
      )}

      {save.cleared && (
        <div className="panel mb-4 border-primary p-3 text-center">
          <h3 className="text-xl text-primary">
            {save.abyssCleared ? "ABISMO ESTELAR DOMINADO! 🌌" : "CAMPANHA CONCLUÍDA! 🏆"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {save.abyssCleared
              ? "Você derrotou Nyxaroth. Continue farmando para subir de nível."
              : "Avance para o Abismo Estelar e enfrente Nyxaroth."}
          </p>
        </div>
      )}

      <div className="panel mb-4 p-3">
        <h3 className="mb-2 text-base text-foreground">Dificuldade</h3>
        <div className="grid grid-cols-3 gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              onClick={() => setSave({ ...save, difficulty: d.id })}
              className={`btn-block btn-block-press px-1 py-2 text-[11px] ${
                save.difficulty === d.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {d.emoji} {d.name.toUpperCase()}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          {diff.desc} • Recompensas x{diff.rewardMult} • Chance de drop{" "}
          {Math.round(diff.dropChance * 100)}%
        </p>
      </div>

      <div className="panel mb-4 p-4">
        <p className="text-[11px] font-black uppercase tracking-widest text-accent">
          {stageWorld(stage)} • Estágio {stage.id} de {STAGES.length}
        </p>
        <h2 className="text-2xl text-foreground">{stage.name}</h2>
        <p className="text-xs text-muted-foreground">{stage.zone}</p>
        <div className="mt-3 flex gap-2 text-3xl">
          {stage.enemies.map((e) => (
            <span key={e.name}>{e.emoji}</span>
          ))}
        </div>
        <button
          onClick={onBattle}
          className="btn-block btn-block-press mt-4 w-full bg-primary text-lg text-primary-foreground"
        >
          ⚔️ ENTRAR NA BATALHA
        </button>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-2">
        <button
          onClick={onShop}
          className="btn-block btn-block-press bg-accent px-1 text-[10px] text-accent-foreground"
        >
          🏪 LOJA
        </button>
        <button
          onClick={onGear}
          className="btn-block btn-block-press bg-xp px-1 text-[10px] text-primary-foreground"
        >
          🎒 BUILD
        </button>
        <button
          onClick={() => setShowChronicles(true)}
          className="btn-block btn-block-press bg-primary px-1 text-[10px] text-primary-foreground"
        >
          📜 CRÔNICAS
        </button>
        <button
          onClick={onMenu}
          className="btn-block btn-block-press bg-secondary px-1 text-[10px] text-secondary-foreground"
        >
          🏰 MENU
        </button>
      </div>

      <div className="panel p-3">
        <h3 className="mb-2 text-base text-foreground">Mapa da Campanha</h3>
        <ol className="space-y-1">
          {STAGES.map((s, i) => {
            const done = s.id < save.stage;
            const current = s.id === save.stage;
            const newWorld = i === 0 || stageWorld(s) !== stageWorld(STAGES[i - 1]!);
            return (
              <li key={s.id}>
                {newWorld && (
                  <p className="mt-2 mb-1 text-[10px] font-black uppercase tracking-widest text-accent">
                    {stageWorld(s)}
                  </p>
                )}
                <span
                  className={`flex items-center gap-2 rounded-md px-2 py-1 text-xs font-bold ${
                    current ? "bg-muted text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <span>{done ? "✅" : current ? "📍" : "🔒"}</span>
                  <span>
                    {s.id}. {s.name}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

const UPGRADES = [
  { key: "bonusAtk" as const, label: "Espada Afiada", emoji: "⚔️", desc: "+4 de Ataque", cost: 60, amount: 4 },
  { key: "bonusDef" as const, label: "Armadura Reforçada", emoji: "🛡️", desc: "+3 de Defesa", cost: 55, amount: 3 },
  { key: "bonusHp" as const, label: "Coração de Ferro", emoji: "❤️", desc: "+25 de Vida máx.", cost: 70, amount: 25 },
];

function Shop({
  save,
  setSave,
  onBack,
}: {
  save: Save;
  setSave: (s: Save) => void;
  onBack: () => void;
}) {
  const potionCost = 25;
  return (
    <div>
      <StatusBar save={save} />
      <h2 className="mb-3 text-2xl text-foreground">🏪 Loja do Aldeão</h2>

      <div className="space-y-3">
        <div className="panel flex items-center gap-3 p-3">
          <span className="text-3xl">🧪</span>
          <div className="flex-1">
            <h3 className="text-base text-foreground">Poção de Vida</h3>
            <p className="text-[11px] text-muted-foreground">Cura 40% da vida máxima em combate.</p>
          </div>
          <button
            disabled={save.gold < potionCost}
            onClick={() =>
              setSave({ ...save, gold: save.gold - potionCost, potions: save.potions + 1 })
            }
            className="btn-block btn-block-press bg-gold px-3 py-2 text-xs text-primary-foreground"
          >
            {potionCost}🪙
          </button>
        </div>

        {UPGRADES.map((u) => {
          const owned = Math.round(save[u.key] / u.amount);
          const cost = Math.round(u.cost * Math.pow(1.6, owned));
          return (
            <div key={u.key} className="panel flex items-center gap-3 p-3">
              <span className="text-3xl">{u.emoji}</span>
              <div className="flex-1">
                <h3 className="text-base text-foreground">
                  {u.label} <span className="text-xs text-accent">Nv. {owned}</span>
                </h3>
                <p className="text-[11px] text-muted-foreground">{u.desc}</p>
              </div>
              <button
                disabled={save.gold < cost}
                onClick={() =>
                  setSave({ ...save, gold: save.gold - cost, [u.key]: save[u.key] + u.amount })
                }
                className="btn-block btn-block-press bg-gold px-3 py-2 text-xs text-primary-foreground"
              >
                {cost}🪙
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={onBack}
        className="btn-block btn-block-press mt-5 w-full bg-secondary text-secondary-foreground"
      >
        VOLTAR
      </button>
    </div>
  );
}

const SLOT_LABEL: Record<Slot, string> = {
  arma: "Arma",
  armadura: "Armadura",
  acessorio: "Acessório",
};

function ItemStats({ item }: { item: Item }) {
  return (
    <p className="text-[10px] font-black text-muted-foreground">
      {item.atk > 0 && <span className="text-primary">⚔️ +{item.atk} </span>}
      {item.def > 0 && <span className="text-accent">🛡️ +{item.def} </span>}
      {item.hp > 0 && <span className="text-hp">❤️ +{item.hp} </span>}
      {item.crit > 0 && <span className="text-xp">🎯 +{item.crit}%</span>}
    </p>
  );
}

function ItemCard({
  item,
  equipped,
  action,
}: {
  item: Item;
  equipped?: boolean;
  action?: React.ReactNode;
}) {
  const rd = rarityDef(item.rarity);
  return (
    <div className="panel flex items-center gap-2 p-2">
      <span className="text-2xl">{item.emoji}</span>
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm text-foreground">{item.name}</h4>
        <p className={`text-[10px] font-black uppercase ${rd.color}`}>
          {rd.name} • {SLOT_LABEL[item.slot]} {equipped ? "• EQUIPADO" : ""}
        </p>
        <ItemStats item={item} />
      </div>
      {action}
    </div>
  );
}

function Gear({
  save,
  setSave,
  onBack,
}: {
  save: Save;
  setSave: (s: Save) => void;
  onBack: () => void;
}) {
  const slots: Slot[] = ["arma", "armadura", "acessorio"];

  function equip(item: Item) {
    const current = save.equipped[item.slot];
    const inv = save.inventory.filter((i) => i.uid !== item.uid);
    if (current) inv.push(current);
    setSave({ ...save, inventory: inv, equipped: { ...save.equipped, [item.slot]: item } });
  }

  function unequip(slot: Slot) {
    const current = save.equipped[slot];
    if (!current) return;
    const eq = { ...save.equipped };
    delete eq[slot];
    setSave({ ...save, equipped: eq, inventory: [...save.inventory, current] });
  }

  function sell(item: Item) {
    setSave({
      ...save,
      gold: save.gold + sellPrice(item),
      inventory: save.inventory.filter((i) => i.uid !== item.uid),
    });
  }

  const sorted = [...save.inventory].sort((a, b) => itemPower(b) - itemPower(a));

  return (
    <div>
      <StatusBar save={save} />
      <h2 className="mb-3 text-2xl text-foreground">🎒 Sua Build</h2>

      <div className="mb-4 space-y-2">
        {slots.map((s) => {
          const item = save.equipped[s];
          return item ? (
            <ItemCard
              key={s}
              item={item}
              equipped
              action={
                <button
                  onClick={() => unequip(s)}
                  className="btn-block btn-block-press bg-muted px-2 py-2 text-[10px] text-muted-foreground"
                >
                  TIRAR
                </button>
              }
            />
          ) : (
            <div
              key={s}
              className="panel flex items-center gap-2 border-dashed p-2 text-xs text-muted-foreground"
            >
              <span className="text-2xl opacity-40">➕</span> {SLOT_LABEL[s]} vazio
            </div>
          );
        })}
      </div>

      <h3 className="mb-2 text-base text-foreground">
        Mochila <span className="text-xs text-muted-foreground">({save.inventory.length})</span>
      </h3>
      <div className="space-y-2">
        {sorted.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Nenhum item ainda. Derrote inimigos para conseguir drops!
          </p>
        )}
        {sorted.map((item) => (
          <ItemCard
            key={item.uid}
            item={item}
            action={
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => equip(item)}
                  className="btn-block btn-block-press bg-primary px-2 py-1 text-[10px] text-primary-foreground"
                >
                  EQUIPAR
                </button>
                <button
                  onClick={() => sell(item)}
                  className="btn-block btn-block-press bg-gold px-2 py-1 text-[10px] text-primary-foreground"
                >
                  {sellPrice(item)}🪙
                </button>
              </div>
            }
          />
        ))}
      </div>

      <button
        onClick={onBack}
        className="btn-block btn-block-press mt-5 w-full bg-secondary text-secondary-foreground"
      >
        VOLTAR
      </button>
    </div>
  );
}


function Battle({
  save,
  setSave,
  onExit,
}: {
  save: Save;
  setSave: (s: Save) => void;
  onExit: () => void;
}) {
  const cls = CLASSES.find((c) => c.id === save.classId)!;
  const stage = getStage(save.stage);
  const diff = getDifficulty(save.difficulty);
  const initialEnemy = useMemo<Enemy>(() => scaleEnemy(pickEnemy(stage), diff), [stage, diff]);

  const hpMax = maxHp(save);
  const [hp, setHp] = useState(hpMax);
  const [enemy, setEnemy] = useState<Enemy>(initialEnemy);
  const [ehp, setEhp] = useState(initialEnemy.hp);
  const [energy, setEnergy] = useState(2);
  const [potions, setPotions] = useState(save.potions);
  const [log, setLog] = useState<string[]>([`Um ${enemy.name} selvagem apareceu! (${diff.name})`]);
  const [busy, setBusy] = useState(false);
  const [hitEnemy, setHitEnemy] = useState(false);
  const [hitHero, setHitHero] = useState(false);
  const [pop, setPop] = useState<{ t: string; k: number } | null>(null);
  const [story, setStory] = useState<string | null>(null);
  const [result, setResult] = useState<
    null | { win: boolean; xp: number; gold: number; up: boolean; drop: Item | null }
  >(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: 9999, behavior: "smooth" });
  }, [log]);

  const push = (line: string) => setLog((l) => [...l.slice(-20), line]);

  function finish(win: boolean) {
    if (win) {
      // Check for story messages
      if (stage.postBossMessage) {
        setStory(stage.postBossMessage);
      }

      const gold = enemy.gold + (save.classId === "ladino" ? Math.round(enemy.gold * 0.2) : 0);
      let xp = save.xp + enemy.xp;
      let level = save.level;
      let up = false;
      while (xp >= xpToNext(level)) {
        xp -= xpToNext(level);
        level++;
        up = true;
      }

      const isFinal = stage.id === FINAL_STAGE_ID;
      const nextStage =
        isFinal || stage.id < save.stage ? save.stage : Math.min(save.stage + 1, STAGES.length);

      const unlocked = [...save.unlockedChronicles];
      if (stage.id === 3 && !unlocked.includes("fragmento_1")) unlocked.push("fragmento_1");
      if (stage.id === 5 && !unlocked.includes("fragmento_2")) unlocked.push("fragmento_2");
      if (stage.id === 7 && !unlocked.includes("fragmento_3")) unlocked.push("fragmento_3");
      if (stage.id === 9 && !unlocked.includes("fragmento_4")) unlocked.push("fragmento_4");
      if (stage.id === 12 && !unlocked.includes("revelacao")) unlocked.push("revelacao");

      const exclusive = enemy.boss ? rollBossExclusive(stage.id) : null;
      const drop = exclusive ?? rollDrop(stage.id, diff, !!enemy.boss);
      const worldBonus = isFinal && enemy.boss && !save.abyssCleared ? 1500 : 0;
      setSave({
        ...save,
        xp,
        level,
        gold: save.gold + gold + worldBonus,
        potions: worldBonus ? potions + 5 : potions,
        stage: nextStage,
        cleared: save.cleared || (stage.id === 12 && !!enemy.boss),
        abyssCleared: save.abyssCleared || (isFinal && !!enemy.boss),
        inventory: drop ? [...save.inventory, drop] : save.inventory,
        consecutiveLosses: 0,
        battleDeaths: 0,
        unlockedChronicles: unlocked,
      });
      setResult({ win: true, xp: enemy.xp, gold: gold + worldBonus, up, drop });
    } else {
      // Tiered money loss: 1st (10), 2nd (5), 3rd (2), 4th+ (0)
      const currentDeaths = save.lastBattleStageId === stage.id ? save.battleDeaths + 1 : 1;
      let lostGold = 10;
      if (currentDeaths === 2) lostGold = 5;
      else if (currentDeaths === 3) lostGold = 2;
      else if (currentDeaths >= 4) lostGold = 0;

      setSave({
        ...save,
        gold: Math.max(0, save.gold - lostGold),
        potions,
        consecutiveLosses: save.consecutiveLosses + 1,
        battleDeaths: currentDeaths,
        lastBattleStageId: stage.id,
      });
      setResult({ win: false, xp: 0, gold: lostGold, up: false, drop: null });
    }
  }

  function enemyTurn(currentHp: number) {
    const eAtk = enemy.attackType === "especial" ? enemySAtk(enemy) : enemy.atk;
    const hDef = enemy.attackType === "especial" ? heroSDef(save) : heroDef(save);

    const dmg = damage(eAtk, hDef);
    const nhp = Math.max(0, currentHp - dmg);
    setHitHero(true);
    setTimeout(() => setHitHero(false), 320);
    setHp(nhp);
    push(`${enemy.name} ataca e causa ${dmg} de dano.`);
    if (nhp <= 0) {
      push(`${save.name} caiu em combate...`);
      finish(false);
    }
    setBusy(false);
  }

  function act(kind: "attack" | "skill" | "potion" | "defend") {
    if (busy || result) return;
    setBusy(true);
    let dealt = 0;

    if (kind === "attack") {
      const hAtk = cls.attackType === "especial" ? heroSAtk(save) : heroAtk(save);
      const eDef = cls.attackType === "especial" ? enemySDef(enemy) : enemy.def;

      dealt = damage(hAtk, eDef);
      const crit = Math.random() * 100 < heroCrit(save);
      if (crit) dealt = Math.round(dealt * 1.8);
      push(
        crit
          ? `💥 CRÍTICO! ${save.name} causa ${dealt} de dano.`
          : `${save.name} ataca causando ${dealt} de dano.`,
      );
      setEnergy((e) => Math.min(6, e + 1));
    } else if (kind === "skill") {
      const hAtk = cls.skillType === "especial" ? heroSAtk(save) : heroAtk(save);
      const eDef = cls.skillType === "especial" ? 0 : enemy.def * 0.5; // Mage/Hybrid ignore def

      const mult = save.classId === "mago" ? 2.4 : save.classId === "ladino" ? 2.2 : 2;
      dealt = damage(hAtk * mult, eDef, 0.08);
      push(`⚡ ${cls.skillName}! ${dealt} de dano!`);
      setEnergy((e) => e - cls.skillCost);
    } else if (kind === "potion") {
      const heal = Math.round(hpMax * 0.40);
      setHp((h) => Math.min(hpMax, h + heal));
      setPotions((p) => p - 1);
      push(`🧪 Poção usada: +${heal} de vida.`);
      setPop({ t: `+${heal}`, k: Date.now() });
      setTimeout(() => enemyTurn(Math.min(hpMax, hp + heal)), 600);
      return;
    } else {
      setEnergy((e) => Math.min(6, e + 2));
      push(`🛡️ ${save.name} se defende e recupera energia.`);

      const eAtk = enemy.attackType === "especial" ? enemySAtk(enemy) : enemy.atk;
      const hDef = enemy.attackType === "especial" ? heroSDef(save) : heroDef(save);

      const dmg = Math.max(1, Math.round(damage(eAtk, hDef) * 0.4));
      const nhp = Math.max(0, hp - dmg);
      setHp(nhp);
      setTimeout(() => {
        push(`${enemy.name} ataca, mas só causa ${dmg}.`);
        if (nhp <= 0) finish(false);
        setBusy(false);
      }, 500);
      return;
    }

    const nehp = Math.max(0, ehp - dealt);
    setEhp(nehp);
    setHitEnemy(true);
    setPop({ t: `-${dealt}`, k: Date.now() });
    setTimeout(() => setHitEnemy(false), 320);

    if (nehp <= 0) {
      push(`${enemy.name} foi derrotado!`);

      // Multi-phase transition: Stage 11 (Dragon) -> Stage 12 (Architect)
      if (stage.id === 11) {
        setTimeout(() => {
          const finalBoss = scaleEnemy(pickEnemy(getStage(12)), diff);
          setEnemy(finalBoss);
          setEhp(finalBoss.hp);
          setStory("O Dragão Roxo cai! A energia corrompida foi liberada e o Arquiteto se revela para o confronto final.");
          push("FASE 2: O ARQUITETO APARECEU!");
          setBusy(false);
        }, 800);
      } else {
        setTimeout(() => finish(true), 500);
      }
      return;
    }
    setTimeout(() => enemyTurn(hp), 650);
  }

  if (result) {
    return (
      <div className="flex min-h-[85vh] flex-col justify-center">
        {story && <StoryDialog message={story} onClose={() => setStory(null)} />}
        <div className="panel p-6 text-center">
          <div className="text-6xl">{result.win ? "🏆" : "💀"}</div>
          <h2 className={`mt-2 text-3xl ${result.win ? "text-primary" : "text-destructive"}`}>
            {result.win ? "VITÓRIA!" : "DERROTA"}
          </h2>
          {result.win && stage.id === 12 ? (
            <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm font-bold text-primary mb-2">CAMPANHA CONCLUÍDA!</p>
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                O Núcleo foi restaurado. Os fragmentos foram reunidos. Mas algo muito maior despertou... o Vazio nos observa.
              </p>
            </div>
          ) : result.win ? (
            <p className="mt-2 text-sm font-bold text-muted-foreground">
              +{result.xp} XP • +{result.gold} 🪙
              {result.up && <span className="block text-xp">⬆️ SUBIU DE NÍVEL!</span>}
            </p>
          ) : (
            <p className="mt-2 text-sm font-bold text-muted-foreground">
              Você perdeu {result.gold} 🪙. {result.gold > 0 ? "Compre upgrades e tente de novo!" : "Desta vez você não perdeu ouro."}
            </p>
          )}
          {result.drop && (
            <div className="mt-4 text-left">
              <p className="mb-1 text-center text-xs font-black uppercase tracking-widest text-gold">
                🎁 Item dropado!
              </p>
              <ItemCard item={result.drop} />
              <p className="mt-1 text-center text-[10px] text-muted-foreground">
                Vá em 🎒 BUILD para equipar.
              </p>
            </div>
          )}
          <button
            onClick={() => {
              if (result.win && stage.id === 12) {
                 setSave({ ...save, cleared: true, runsCompleted: save.runsCompleted + 1 });
              }
              onExit();
            }}
            className="btn-block btn-block-press mt-5 w-full bg-primary text-primary-foreground"
          >
            {result.win && stage.id === 12 ? "FINALIZAR AVENTURA" : "VOLTAR AO ACAMPAMENTO"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="panel relative mb-3 overflow-hidden p-4 text-center">
        <p className="text-[11px] font-black uppercase tracking-widest text-accent">{stage.zone}</p>
        <div className={`my-2 text-6xl ${hitEnemy ? "anim-hit" : "anim-idle"}`}>{enemy.emoji}</div>
        {pop && (
          <span
            key={pop.k}
            className="pointer-events-none absolute left-1/2 top-1/2 font-display text-2xl text-hp anim-pop"
          >
            {pop.t}
          </span>
        )}
        <h2 className="text-xl text-foreground">
          {enemy.boss ? "👑 " : ""}
          {enemy.name}
        </h2>
        <div className="mt-2">
          <Bar value={ehp} max={enemy.hp} color="hp" />
          <p className="mt-1 text-[11px] font-bold text-muted-foreground">
            {ehp} / {enemy.hp} HP
          </p>
        </div>
      </div>

      <div
        ref={logRef}
        className="panel mb-3 h-24 overflow-y-auto p-3 text-xs font-bold leading-relaxed text-muted-foreground"
      >
        {log.map((l, i) => (
          <p key={i}>› {l}</p>
        ))}
      </div>

      <div className="panel mb-3 p-3">
        <div className="flex items-center gap-2">
          <span className={`text-3xl ${hitHero ? "anim-hit" : ""}`}>{cls.emoji}</span>
          <div className="flex-1">
            <div className="flex justify-between text-[11px] font-black">
              <span className="text-foreground">{save.name}</span>
              <span className="text-mana">⚡ {energy}/6</span>
            </div>
            <Bar value={hp} max={hpMax} color="hp" />
            <p className="mt-1 text-[10px] font-bold text-muted-foreground">
              {hp} / {hpMax} HP
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          disabled={busy}
          onClick={() => act("attack")}
          className="btn-block btn-block-press bg-primary text-primary-foreground"
        >
          ⚔️ ATACAR
        </button>
        <button
          disabled={busy || energy < cls.skillCost}
          onClick={() => act("skill")}
          className="btn-block btn-block-press bg-mana text-primary-foreground"
        >
          ⚡ {cls.skillName.toUpperCase()}
        </button>
        <button
          disabled={busy || potions <= 0}
          onClick={() => act("potion")}
          className="btn-block btn-block-press bg-xp text-primary-foreground"
        >
          🧪 POÇÃO ({potions})
        </button>
        <button
          disabled={busy}
          onClick={() => act("defend")}
          className="btn-block btn-block-press bg-secondary text-secondary-foreground"
        >
          🛡️ DEFENDER
        </button>
      </div>

      <button
        onClick={onExit}
        className="btn-block btn-block-press mt-3 w-full bg-muted text-xs text-muted-foreground"
      >
        FUGIR DA BATALHA
      </button>
    </div>
  );
}
