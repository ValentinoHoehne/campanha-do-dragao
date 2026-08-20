import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CLASSES,
  STAGES,
  damage,
  getStage,
  pickEnemy,
  heroAtk,
  heroDef,
  loadSave,
  maxHp,
  newSave,
  persist,
  xpToNext,
  type ClassId,
  type Enemy,
  type Save,
} from "@/lib/game";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Campanha do Dragão — RPG de Turnos" },
      {
        name: "description",
        content:
          "Crie seu herói, enfrente monstros em batalhas por turnos, evolua de nível e derrote o Dragão Sombrio em 6 estágios.",
      },
      { property: "og:title", content: "Campanha do Dragão — RPG de Turnos" },
      {
        property: "og:description",
        content: "RPG de combate por turnos com classes, loja, upgrades e chefão final.",
      },
    ],
  }),
  component: Game,
});

type Screen = "menu" | "create" | "hub" | "battle" | "shop";

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
    <main className="mx-auto min-h-screen w-full max-w-md px-4 pb-10 pt-6">
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
          onBattle={() => setScreen("battle")}
          onShop={() => setScreen("shop")}
          onMenu={() => setScreen("menu")}
        />
      )}
      {screen === "shop" && save && (
        <Shop save={save} setSave={setSave} onBack={() => setScreen("hub")} />
      )}
      {screen === "battle" && save && (
        <Battle save={save} setSave={setSave} onExit={() => setScreen("hub")} />
      )}
    </main>
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
            <span className="text-xs font-black text-gold">🪙 {save.gold}</span>
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
          {Math.round(heroDef(save))} • 🧪 {save.potions}
        </p>
      </div>
    </div>
  );
}

function Hub({
  save,
  onBattle,
  onShop,
  onMenu,
}: {
  save: Save;
  onBattle: () => void;
  onShop: () => void;
  onMenu: () => void;
}) {
  const stage = getStage(save.stage);
  return (
    <div>
      <StatusBar save={save} />

      {save.cleared && (
        <div className="panel mb-4 border-primary p-3 text-center">
          <h3 className="text-xl text-primary">CAMPANHA CONCLUÍDA! 🏆</h3>
          <p className="text-xs text-muted-foreground">
            Continue farmando o Dragão Sombrio para subir de nível.
          </p>
        </div>
      )}

      <div className="panel mb-4 p-4">
        <p className="text-[11px] font-black uppercase tracking-widest text-accent">
          Estágio {stage.id} de {STAGES.length}
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

      <div className="mb-4 grid grid-cols-2 gap-3">
        <button
          onClick={onShop}
          className="btn-block btn-block-press bg-accent text-accent-foreground"
        >
          🏪 LOJA
        </button>
        <button
          onClick={onMenu}
          className="btn-block btn-block-press bg-secondary text-secondary-foreground"
        >
          🏰 MENU
        </button>
      </div>

      <div className="panel p-3">
        <h3 className="mb-2 text-base text-foreground">Mapa da Campanha</h3>
        <ol className="space-y-1">
          {STAGES.map((s) => {
            const done = s.id < save.stage;
            const current = s.id === save.stage;
            return (
              <li
                key={s.id}
                className={`flex items-center gap-2 rounded-md px-2 py-1 text-xs font-bold ${
                  current ? "bg-muted text-foreground" : "text-muted-foreground"
                }`}
              >
                <span>{done ? "✅" : current ? "📍" : "🔒"}</span>
                <span>
                  {s.id}. {s.name}
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
            <p className="text-[11px] text-muted-foreground">Cura 45% da vida em combate.</p>
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
  const enemy = useMemo<Enemy>(() => pickEnemy(stage), [stage]);

  const hpMax = maxHp(save);
  const [hp, setHp] = useState(hpMax);
  const [ehp, setEhp] = useState(enemy.hp);
  const [energy, setEnergy] = useState(2);
  const [potions, setPotions] = useState(save.potions);
  const [log, setLog] = useState<string[]>([`Um ${enemy.name} selvagem apareceu!`]);
  const [busy, setBusy] = useState(false);
  const [hitEnemy, setHitEnemy] = useState(false);
  const [hitHero, setHitHero] = useState(false);
  const [pop, setPop] = useState<{ t: string; k: number } | null>(null);
  const [result, setResult] = useState<null | { win: boolean; xp: number; gold: number; up: boolean }>(
    null,
  );
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: 9999, behavior: "smooth" });
  }, [log]);

  const push = (line: string) => setLog((l) => [...l.slice(-20), line]);

  function finish(win: boolean) {
    if (win) {
      const gold = enemy.gold + (save.classId === "ladino" ? Math.round(enemy.gold * 0.2) : 0);
      let xp = save.xp + enemy.xp;
      let level = save.level;
      let up = false;
      while (xp >= xpToNext(level)) {
        xp -= xpToNext(level);
        level++;
        up = true;
      }
      const nextStage =
        enemy.boss || stage.id < save.stage ? save.stage : Math.min(save.stage + 1, STAGES.length);
      setSave({
        ...save,
        xp,
        level,
        gold: save.gold + gold,
        potions,
        stage: enemy.boss ? save.stage : nextStage,
        cleared: save.cleared || !!enemy.boss,
      });
      setResult({ win: true, xp: enemy.xp, gold, up });
    } else {
      setSave({ ...save, gold: Math.max(0, save.gold - 10), potions });
      setResult({ win: false, xp: 0, gold: 0, up: false });
    }
  }

  function enemyTurn(currentHp: number) {
    const dmg = damage(enemy.atk, heroDef(save));
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
      dealt = damage(heroAtk(save), enemy.def);
      push(`${save.name} ataca causando ${dealt} de dano.`);
      setEnergy((e) => Math.min(6, e + 1));
    } else if (kind === "skill") {
      const mult = save.classId === "mago" ? 2.4 : save.classId === "ladino" ? 2.2 : 2;
      const def = save.classId === "mago" ? 0 : enemy.def * 0.5;
      dealt = damage(heroAtk(save) * mult, def, 0.08);
      push(`⚡ ${cls.skillName}! ${dealt} de dano!`);
      setEnergy((e) => e - cls.skillCost);
    } else if (kind === "potion") {
      const heal = Math.round(hpMax * 0.45);
      setHp((h) => Math.min(hpMax, h + heal));
      setPotions((p) => p - 1);
      push(`🧪 Poção usada: +${heal} de vida.`);
      setPop({ t: `+${heal}`, k: Date.now() });
      setTimeout(() => enemyTurn(Math.min(hpMax, hp + heal)), 600);
      return;
    } else {
      setEnergy((e) => Math.min(6, e + 2));
      push(`🛡️ ${save.name} se defende e recupera energia.`);
      const dmg = Math.max(1, Math.round(damage(enemy.atk, heroDef(save)) * 0.4));
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
      setTimeout(() => finish(true), 500);
      setBusy(false);
      return;
    }
    setTimeout(() => enemyTurn(hp), 650);
  }

  if (result) {
    return (
      <div className="flex min-h-[85vh] flex-col justify-center">
        <div className="panel p-6 text-center">
          <div className="text-6xl">{result.win ? "🏆" : "💀"}</div>
          <h2 className={`mt-2 text-3xl ${result.win ? "text-primary" : "text-destructive"}`}>
            {result.win ? "VITÓRIA!" : "DERROTA"}
          </h2>
          {result.win ? (
            <p className="mt-2 text-sm font-bold text-muted-foreground">
              +{result.xp} XP • +{result.gold} 🪙
              {result.up && <span className="block text-xp">⬆️ SUBIU DE NÍVEL!</span>}
            </p>
          ) : (
            <p className="mt-2 text-sm font-bold text-muted-foreground">
              Você perdeu 10 🪙. Compre upgrades e tente de novo!
            </p>
          )}
          <button
            onClick={onExit}
            className="btn-block btn-block-press mt-5 w-full bg-primary text-primary-foreground"
          >
            VOLTAR AO ACAMPAMENTO
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
