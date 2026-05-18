import type { GameState } from '../game/types';
import { RACES } from '../game/data/races';
import { LOCATIONS } from '../game/data/locations';
import { doPersonAction } from '../game/engine';
import { RACE_IMAGES } from '../assets/pixel';
import GameLayout from '../components/GameLayout';
import BottomNav from '../components/BottomNav';
import StatBar from '../components/StatBar';
import { useBanner } from '../hooks/useBanner';
import { useAudio } from '../hooks/useAudio';

interface Props {
  gameState: GameState;
  personId: string | null;
  onUpdate: (s: GameState) => void;
  onNavigate: (s: GameState['screen']) => void;
}

const PX = { fontFamily: 'Press Start 2P, monospace' };

// ── Action definitions ────────────────────────────────────────────────────────
export interface PersonAction {
  id: string;
  label: string;
  emoji: string;
  cost?: string;
  desc: string;
  category: 'social' | 'romance' | 'business' | 'conflict';
}

export const PERSON_ACTIONS: PersonAction[] = [
  // Social
  { id: 'talk',         label: 'TALK',         emoji: '💬', desc: 'Chat casually. Slight rel & stamina drain.',                    category: 'social'   },
  { id: 'compliment',   label: 'COMPLIMENT',   emoji: '😊', desc: 'Flatter them. Rel+Trust up, their respect rises.',             category: 'social'   },
  { id: 'apologize',    label: 'APOLOGIZE',    emoji: '🙏', desc: 'Make amends. Rel & trust recover slightly.',                   category: 'social'   },
  { id: 'share_rumor',  label: 'SHARE RUMOR',  emoji: '🗣️', desc: 'Trade info. Builds trust, small rep bump.',                   category: 'social'   },
  { id: 'give_gift',    label: 'GIVE GIFT',    emoji: '🎁', cost: '25g', desc: 'Spend 25g. Big rel & trust boost.',              category: 'social'   },
  { id: 'ask_rumor',    label: 'ASK RUMOR',    emoji: '👂', cost: 'Trust≥40', desc: 'Get a market rumor from them.',             category: 'social'   },
  // Romance
  { id: 'flirt',        label: 'FLIRT',        emoji: '😍', desc: 'Try your charm. Raises or lowers rel based on charisma.',     category: 'romance'  },
  { id: 'go_drink',     label: 'GO DRINK',     emoji: '🍺', cost: '15g', desc: 'Share a drink. Stamina−, rel+, heat cools.',    category: 'romance'  },
  { id: 'make_love',    label: 'MAKE LOVE',    emoji: '❤️', cost: 'Rel≥60', desc: 'Intimate moment. Health+ & deep bond.',     category: 'romance'  },
  { id: 'propose_partnership', label: 'PARTNER', emoji: '🤝', cost: 'Trust≥60', desc: 'Forge a business alliance. Rep+ both.', category: 'romance'  },
  // Business
  { id: 'bribe',        label: 'BRIBE',        emoji: '💰', cost: '30g', desc: 'Pay 30g to buy favour. Risky.',               category: 'business' },
  { id: 'loan_gold',    label: 'LOAN GOLD',    emoji: '🏦', cost: '50g', desc: 'Lend 50g. They owe you — collectable later.', category: 'business' },
  { id: 'collect_debt', label: 'COLLECT',      emoji: '💸', cost: 'Debt>0', desc: 'Demand repayment of owed gold.',           category: 'business' },
  { id: 'extort',       label: 'EXTORT',       emoji: '🗡️', cost: 'Fear≥30', desc: 'Squeeze money out. Fear+, rep−.',       category: 'business' },
  // Conflict
  { id: 'insult',       label: 'INSULT',       emoji: '😤', desc: 'Trash-talk them. Rel drops, fear minimal.',                  category: 'conflict' },
  { id: 'threaten',     label: 'THREATEN',     emoji: '😠', desc: 'Intimidate. Their fear+, your public rep−.',                 category: 'conflict' },
  { id: 'fight',        label: 'FIGHT',        emoji: '⚔️', desc: 'Brawl it out. Health risk for both, rep shifts.',           category: 'conflict' },
  { id: 'betray',       label: 'BETRAY',       emoji: '🗡️', desc: 'Sell them out. Big money gain, destroy trust forever.',     category: 'conflict' },
];

// ── Per-role action restrictions ──────────────────────────────────────────────────────
// Actions allowed per role. Anything not in the list is BLOCKED for that role.
type PersonRole = 'family' | 'merchant' | 'dealer' | 'rival' | 'friend' | 'lover' | 'enemy' | 'contact' | 'informant' | 'gang_member';

const ROLE_ALLOWED_ACTIONS: Record<PersonRole, string[]> = {
  family: [
    'talk', 'compliment', 'apologize', 'give_gift',
    // No romance with family. No conflict. Limited business.
    'loan_gold', 'collect_debt',
  ],
  merchant: [
    'talk', 'compliment', 'apologize', 'share_rumor', 'give_gift', 'ask_rumor',
    'go_drink', 'bribe', 'loan_gold', 'collect_debt',
    // No romantic/intimate. Conflict allowed but frowned upon.
    'insult', 'threaten',
  ],
  dealer: [
    'talk', 'compliment', 'apologize', 'share_rumor', 'give_gift', 'ask_rumor',
    'go_drink', 'propose_partnership', 'bribe', 'loan_gold', 'collect_debt', 'extort',
    'insult', 'threaten', 'fight', 'betray',
  ],
  rival: [
    'talk', 'apologize', 'share_rumor', 'give_gift',
    'bribe', 'extort',
    'insult', 'threaten', 'fight', 'betray',
  ],
  friend: [
    'talk', 'compliment', 'apologize', 'share_rumor', 'give_gift', 'ask_rumor',
    'flirt', 'go_drink', 'make_love', 'propose_partnership',
    'bribe', 'loan_gold', 'collect_debt',
    'insult', 'threaten', 'betray',
  ],
  lover: [
    'talk', 'compliment', 'apologize', 'give_gift',
    'flirt', 'go_drink', 'make_love',
    'loan_gold', 'collect_debt',
    'insult', 'betray',
  ],
  enemy: [
    'talk', 'apologize', 'bribe',
    'insult', 'threaten', 'fight', 'betray', 'extort',
  ],
  contact: [
    'talk', 'compliment', 'apologize', 'share_rumor', 'give_gift', 'ask_rumor',
    'go_drink', 'bribe', 'loan_gold', 'collect_debt',
    'insult', 'threaten',
  ],
  informant: [
    'talk', 'compliment', 'give_gift', 'ask_rumor', 'share_rumor',
    'bribe', 'loan_gold', 'collect_debt', 'extort',
    'threaten',
  ],
  gang_member: [
    'talk', 'compliment', 'give_gift', 'bribe',
    'loan_gold', 'collect_debt', 'extort',
    'insult', 'threaten', 'fight', 'betray',
  ],
};

// Age gates on categories
const AGE_GATE_CATEGORIES: Record<string, number> = {
  romance: 16,   // romantic/intimate actions require age 16+
  conflict: 12,  // fighting/threatening require age 12+
  business: 10,  // business dealings require age 10+
};

export function isActionAllowed(
  actionId: string,
  category: PersonAction['category'],
  role: PersonRole,
  playerAge: number,
): { allowed: boolean; reason?: string } {
  // Age gate check
  const minAge = AGE_GATE_CATEGORIES[category];
  if (minAge && playerAge < minAge) {
    return { allowed: false, reason: `Age ≥${minAge} required` };
  }
  // Role check
  const allowed = ROLE_ALLOWED_ACTIONS[role] ?? [];
  if (!allowed.includes(actionId)) {
    return { allowed: false, reason: `Not with a ${role}` };
  }
  return { allowed: true };
}

const CATEGORY_LABEL: Record<string, string> = {
  social:   '── SOCIAL ──',
  romance:  '── ROMANCE ──',
  business: '── BUSINESS ──',
  conflict: '── CONFLICT ──',
};

const CATEGORY_COLOR: Record<string, string> = {
  social:   'text-blue-400',
  romance:  'text-pink-400',
  business: 'text-accent',
  conflict: 'text-destructive',
};

const CATEGORIES: Array<PersonAction['category']> = ['social', 'romance', 'business', 'conflict'];

export default function PersonDetailScreen({ gameState: gs, personId, onUpdate, onNavigate }: Props) {
  const { showBanner } = useBanner();
  const { playSfx } = useAudio();

  if (!personId || !gs.people[personId]) {
    return (
      <div className="min-h-screen bg-background flex flex-col pb-16 items-center justify-center">
        <p className="text-[9px] text-muted-foreground" style={PX}>PERSON NOT FOUND</p>
        <button onClick={() => onNavigate('people')} className="mt-4 text-[9px] text-primary" style={PX}>← BACK</button>
        <BottomNav current="people" onNavigate={onNavigate} />
      </div>
    );
  }

  const person = gs.people[personId];
  const race = RACES[person.raceId];
  const location = person.locationId ? LOCATIONS[person.locationId] : null;
  const raceImg = RACE_IMAGES[person.raceId];

  const relLabel = person.relationship >= 60 ? 'Beloved' :
    person.relationship >= 30 ? 'Friendly' :
    person.relationship >= 10 ? 'Neutral' :
    person.relationship >= -20 ? 'Suspicious' :
    person.relationship >= -50 ? 'Hostile' : 'Enemy';

  const relColor = person.relationship >= 30 ? 'text-primary' :
    person.relationship >= 0 ? 'text-muted-foreground' : 'text-destructive';

  const handleAction = (actionId: string) => {
    const action = PERSON_ACTIONS.find(a => a.id === actionId);
    if (!action) return;

    // Pre-flight checks (client-side guards — engine has them too but UX needs feedback)
    if (actionId === 'make_love' && person.relationship < 60) {
      showBanner(`${person.name} isn't close enough for that. (Rel < 60)`, 'warning'); return;
    }
    if (actionId === 'ask_rumor' && person.trust < 40) {
      showBanner(`${person.name} doesn't trust you enough. (Trust < 40)`, 'warning'); return;
    }
    if (actionId === 'propose_partnership' && person.trust < 60) {
      showBanner(`${person.name} doesn't trust you enough. (Trust < 60)`, 'warning'); return;
    }
    if (actionId === 'collect_debt' && person.debtToPlayer <= 0) {
      showBanner(`${person.name} doesn't owe you anything.`, 'warning'); return;
    }
    if (actionId === 'extort' && person.fear < 30) {
      showBanner(`${person.name} isn't afraid of you yet. (Fear < 30)`, 'warning'); return;
    }
    if (actionId === 'give_gift' && gs.player.money < 25) {
      showBanner(`Not enough gold to give a gift. (25g needed)`, 'error'); return;
    }
    if (actionId === 'go_drink' && gs.player.money < 15) {
      showBanner(`Not enough gold to buy drinks. (15g needed)`, 'error'); return;
    }
    if (actionId === 'bribe' && gs.player.money < 30) {
      showBanner(`Not enough gold to bribe. (30g needed)`, 'error'); return;
    }
    if (actionId === 'loan_gold' && gs.player.money < 50) {
      showBanner(`Not enough gold to loan. (50g needed)`, 'error'); return;
    }

    playSfx('click');
    const newState = doPersonAction(gs, personId, actionId);
    onUpdate(newState);

    // Outcome feedback from log
    const lastLog = newState.eventLog[0];
    showBanner(`${action.emoji} ${lastLog?.text ?? action.label + ' done.'}`, 'info');
  };

  return (
    <GameLayout
      gameState={gs}
      panelExtra={
        <p className="text-[9px] text-white/60 mt-1" style={{ fontFamily: 'Courier New, monospace' }}>
          Tap an action to interact
        </p>
      }
    >
      {/* Person header */}
      <div className="bg-card border-b border-border px-3 py-3">
        <button
          onClick={() => onNavigate('people')}
          className="text-[9px] text-muted-foreground hover:text-foreground mb-2 block"
          style={PX}
        >
          ← BACK TO PEOPLE
        </button>
        <div className="flex items-center gap-3">
          {raceImg ? (
            <img src={raceImg} alt={race.name} className="w-14 h-14 object-contain flex-shrink-0" style={{imageRendering:"pixelated"}} loading="lazy" />
          ) : (
            <span className="text-4xl">{person.emoji}</span>
          )}
          <div>
            <p className="text-[11px] font-bold text-foreground" style={PX}>{person.name}</p>
            <p className="text-[9px] text-muted-foreground ui-text">
              {race.name} · Age {person.age} · {person.role.toUpperCase()}
            </p>
            {location && <p className="text-[9px] text-muted-foreground ui-text">{location.name}</p>}
            <p className={`text-[9px] font-bold mt-1 ui-text ${relColor}`}>{relLabel}</p>
          </div>
        </div>
      </div>

      <div className="px-3 py-2 space-y-3 pb-20">
        {/* Relationship meters */}
        <div className="bg-card border border-border p-3 space-y-2">
          <p className="text-[9px] text-muted-foreground mb-1" style={PX}>RELATIONSHIP</p>
          <StatBar label={`REL (${person.relationship > 0 ? '+' : ''}${person.relationship})`} value={Math.max(0, Math.min(100, ((person.relationship + 100) / 200) * 100))} color="hsl(142 60% 45%)" showValue={false} />
          <StatBar label={`TRUST ${person.trust}`} value={person.trust} color="hsl(200 70% 55%)" showValue={false} />
          <StatBar label={`FEAR ${person.fear}`} value={person.fear} color="hsl(0 70% 50%)" showValue={false} />
          <StatBar label={`RESPECT ${person.respect}`} value={person.respect} color="hsl(270 60% 60%)" showValue={false} />
        </div>

        {/* Traits + debts */}
        <div className="bg-card border border-border p-3">
          <div className="flex flex-wrap gap-1 mb-2">
            {person.traits.map(t => (
              <span key={t} className="text-[9px] px-1 bg-secondary text-secondary-foreground ui-text">{t}</span>
            ))}
          </div>
          {(person.debtToPlayer > 0 || person.playerDebtToThem > 0) && (
            <div>
              {person.debtToPlayer > 0 && <p className="text-[9px] text-primary ui-text">Owes you: {person.debtToPlayer}g</p>}
              {person.playerDebtToThem > 0 && <p className="text-[9px] text-destructive ui-text">You owe: {person.playerDebtToThem}g</p>}
            </div>
          )}
        </div>

        {/* Actions — grouped by category */}
        <div>
          {CATEGORIES.map(cat => {
            const acts = PERSON_ACTIONS.filter(a => a.category === cat);
            return (
              <div key={cat} className="mb-3">
                <p className={`text-[8px] mb-1 ${CATEGORY_COLOR[cat]}`} style={PX}>{CATEGORY_LABEL[cat]}</p>
                <div className="grid grid-cols-2 gap-1">
                  {acts.map(action => {
                    // Determine if blocked
                    let blockedReason = '';
                    if (action.id === 'make_love' && person.relationship < 60) blockedReason = 'Rel<60';
                    if (action.id === 'ask_rumor' && person.trust < 40) blockedReason = 'Trust<40';
                    if (action.id === 'propose_partnership' && person.trust < 60) blockedReason = 'Trust<60';
                    if (action.id === 'collect_debt' && person.debtToPlayer <= 0) blockedReason = 'No debt';
                    if (action.id === 'extort' && person.fear < 30) blockedReason = 'Fear<30';
                    // Role + age gate check
                    const roleCheck = isActionAllowed(action.id, action.category, person.role as PersonRole, gs.player.age);
                    const finalBlocked = !!blockedReason || !roleCheck.allowed;
                    const finalReason = blockedReason || roleCheck.reason || '';

                    // Distinguish age-gate from role-gate for styling
                    const isAgeLocked = !roleCheck.allowed && roleCheck.reason?.startsWith('Age');
                    const isRoleLocked = !roleCheck.allowed && !isAgeLocked;

                    return (
                      <button
                        key={action.id}
                        data-testid={`action-${action.id}`}
                        onClick={() => !finalBlocked && handleAction(action.id)}
                        className={`bg-card border text-left transition-all p-2 relative ${
                          isAgeLocked
                            ? 'border-yellow-600/50 opacity-70 cursor-not-allowed'
                            : isRoleLocked || !!blockedReason
                            ? 'border-border opacity-40 cursor-not-allowed'
                            : 'border-border hover:border-primary/50 active:bg-primary/10 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-sm">{action.emoji}</span>
                          <span className={`text-[8px] font-bold truncate ${ isAgeLocked ? 'text-yellow-400' : 'text-foreground' }`} style={PX}>{action.label}</span>
                          {isAgeLocked && (
                            <span className="ml-auto text-[8px] font-bold text-yellow-400 bg-yellow-900/40 border border-yellow-600/50 px-1 py-0.5 flex-shrink-0" style={PX}>
                              🔒 {roleCheck.reason}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground ui-text leading-tight">{action.desc}</p>
                        {action.cost && !finalReason && (
                          <span className="text-[9px] text-accent ui-text mt-0.5 block">{action.cost}</span>
                        )}
                        {!isAgeLocked && finalReason && (
                          <span className="text-[9px] text-destructive ui-text mt-0.5 block">{finalReason}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Memories */}
        {person.memories.length > 0 && (
          <div className="bg-card border border-border p-3">
            <p className="text-[9px] text-muted-foreground mb-2" style={PX}>MEMORIES</p>
            <div className="space-y-1">
              {person.memories.slice(0, 6).map((mem, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-[9px] text-muted-foreground ui-text w-12 flex-shrink-0">Age {mem.age}</span>
                  <p className="text-[9px] text-muted-foreground ui-text italic">"{mem.description}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav current="people" onNavigate={onNavigate} />
    </GameLayout>
  );
}
