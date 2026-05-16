import type { GameEvent } from '../types';

export const TRAVEL_EVENTS: GameEvent[] = [
  {
    id: 'bandit_ambush',
    title: 'Bandits on the Road',
    emoji: '🗡️',
    description: 'A group of masked figures blocks your path. "Your goods or your health," their leader growls.',
    choices: [
      {
        id: 'pay',
        label: 'Hand over some money',
        outcomes: [{
          description: 'You pay them off. They let you pass.',
          probability: 1,
          effects: [
            { type: 'money', value: -25 },
            { type: 'heat', value: 2 },
            { type: 'log', text: 'You paid off bandits to let you pass.' },
          ],
        }],
      },
      {
        id: 'fight',
        label: 'Try to fight your way through',
        outcomes: [
          {
            description: 'You fight them off. Bloody but victorious.',
            probability: 0.4,
            effects: [
              { type: 'health', value: -15 },
              { type: 'reputation_fear', value: 5 },
              { type: 'log', text: 'You fought off the bandits. You took damage but kept your goods.' },
            ],
          },
          {
            description: 'They overpower you. You lose goods and health.',
            probability: 0.6,
            effects: [
              { type: 'health', value: -25 },
              { type: 'money', value: -40 },
              { type: 'log', text: 'The bandits bested you. You lost money and health.' },
            ],
          },
        ],
      },
      {
        id: 'bluff',
        label: 'Bluff with a charismatic story',
        requiresStat: { stat: 'charisma', min: 30 },
        outcomes: [
          {
            description: 'Your story amuses them. They let you pass.',
            probability: 0.65,
            effects: [
              { type: 'reputation_public', value: 2 },
              { type: 'log', text: 'Your bluff worked. The bandits laughed and let you by.' },
            ],
          },
          {
            description: 'They see through it and take more.',
            probability: 0.35,
            effects: [
              { type: 'money', value: -50 },
              { type: 'log', text: 'Your bluff failed. They were insulted and took extra.' },
            ],
          },
        ],
      },
    ],
    tags: ['travel', 'danger', 'combat'],
  },
  {
    id: 'mysterious_merchant',
    title: 'Mysterious Roadside Merchant',
    emoji: '🎪',
    description: 'A hooded figure waves you over from a cart piled with mysterious goods. "I have things you won\'t find in any market..."',
    choices: [
      {
        id: 'browse',
        label: 'Browse their goods',
        outcomes: [
          {
            description: 'You find something unusual at a good price.',
            probability: 0.6,
            effects: [
              { type: 'money', value: -30 },
              { type: 'reputation_underworld', value: 3 },
              { type: 'log', text: 'The mysterious merchant sold you something rare at a fair price.' },
            ],
          },
          {
            description: 'The goods are counterfeit. You were scammed.',
            probability: 0.4,
            effects: [
              { type: 'money', value: -30 },
              { type: 'log', text: 'The goods were counterfeit. You were taken for a fool.' },
            ],
          },
        ],
      },
      {
        id: 'ignore',
        label: 'Walk past without stopping',
        outcomes: [{
          description: 'You walk on. Better safe than sorry.',
          probability: 1,
          effects: [{ type: 'log', text: 'You ignored the mysterious merchant and traveled on.' }],
        }],
      },
    ],
    tags: ['travel', 'merchant', 'luck'],
  },
  {
    id: 'guard_checkpoint',
    title: 'Guard Checkpoint',
    emoji: '🛡️',
    description: 'Guards have set up a checkpoint on the road. They\'re inspecting all travelers carefully.',
    choices: [
      {
        id: 'cooperate',
        label: 'Cooperate with the inspection',
        outcomes: [
          {
            description: 'They find nothing suspicious. You continue.',
            probability: 0.7,
            effects: [
              { type: 'heat', value: -3 },
              { type: 'log', text: 'The guards found nothing. Your heat cooled slightly.' },
            ],
          },
          {
            description: 'They confiscate suspicious goods.',
            probability: 0.3,
            effects: [
              { type: 'heat', value: 10 },
              { type: 'money', value: -20 },
              { type: 'log', text: 'The guards found your contraband and confiscated some. Heat rose.' },
            ],
          },
        ],
      },
      {
        id: 'bribe',
        label: 'Slip the guard some coins',
        outcomes: [
          {
            description: 'The guard pockets the coin and waves you through.',
            probability: 0.7,
            effects: [
              { type: 'money', value: -20 },
              { type: 'heat', value: -5 },
              { type: 'log', text: 'A well-placed coin bought you passage.' },
            ],
          },
          {
            description: 'The guard arrests you for bribery.',
            probability: 0.3,
            effects: [
              { type: 'money', value: -50 },
              { type: 'heat', value: 20 },
              { type: 'health', value: -5 },
              { type: 'log', text: 'The guard refused the bribe and detained you briefly. Costly.' },
            ],
          },
        ],
      },
      {
        id: 'sneak',
        label: 'Find a way around',
        requiresStat: { stat: 'luck', min: 25 },
        outcomes: [
          {
            description: 'You find a hidden path and slip through.',
            probability: 0.65,
            effects: [
              { type: 'log', text: 'You found a hidden path around the checkpoint.' },
            ],
          },
          {
            description: 'You\'re caught trying to evade.',
            probability: 0.35,
            effects: [
              { type: 'heat', value: 25 },
              { type: 'money', value: -40 },
              { type: 'log', text: 'Caught trying to evade. The fine was steep.' },
            ],
          },
        ],
      },
    ],
    tags: ['travel', 'law', 'heat'],
  },
  {
    id: 'rival_encounter',
    title: 'Rival on the Road',
    emoji: '😈',
    description: 'You cross paths with a dealer you\'ve heard of. They eye your pack with calculating interest.',
    choices: [
      {
        id: 'confront',
        label: 'Confront them directly',
        outcomes: [{
          description: 'You make it clear you know the trade too.',
          probability: 1,
          effects: [
            { type: 'reputation_underworld', value: 3 },
            { type: 'reputation_fear', value: 3 },
            { type: 'log', text: 'You confronted the rival dealer. They know your name now.' },
          ],
        }],
      },
      {
        id: 'share_info',
        label: 'Share some market info',
        outcomes: [{
          description: 'You exchange tips. A useful contact is made.',
          probability: 1,
          effects: [
            { type: 'reputation_underworld', value: 5 },
            { type: 'log', text: 'You traded market info with the rival dealer. Mutual respect formed.' },
          ],
        }],
      },
      {
        id: 'avoid',
        label: 'Ignore and walk past',
        outcomes: [{
          description: 'You avoid eye contact and move on.',
          probability: 1,
          effects: [{ type: 'log', text: 'You passed the rival without a word.' }],
        }],
      },
    ],
    tags: ['travel', 'rival', 'underworld'],
  },
  {
    id: 'helpful_traveler',
    title: 'Helpful Traveler',
    emoji: '😊',
    description: 'A friendly traveler walks alongside you and offers route advice.',
    choices: [
      {
        id: 'chat',
        label: 'Walk and talk with them',
        outcomes: [
          {
            description: 'They share useful trade information.',
            probability: 0.7,
            effects: [
              { type: 'stat', stat: 'intelligence', value: 1 },
              { type: 'reputation_public', value: 2 },
              { type: 'log', text: 'A friendly traveler shared useful market gossip with you.' },
            ],
          },
          {
            description: 'A pleasant walk. Nothing more.',
            probability: 0.3,
            effects: [
              { type: 'stamina', value: 3 },
              { type: 'log', text: 'You had a pleasant conversation that lifted your spirits.' },
            ],
          },
        ],
      },
      {
        id: 'decline',
        label: 'Prefer to travel alone',
        outcomes: [{
          description: 'You nod politely and move ahead.',
          probability: 1,
          effects: [{ type: 'log', text: 'You politely declined the company and pressed on.' }],
        }],
      },
    ],
    tags: ['travel', 'positive', 'social'],
  },
];

export const MARKET_EVENTS: GameEvent[] = [
  {
    id: 'price_spike',
    title: 'Market Rumor: Price Spike',
    emoji: '📈',
    description: 'Whispers in the market say a certain item\'s price is rising rapidly elsewhere.',
    choices: [
      {
        id: 'buy_now',
        label: 'Buy more to capitalize',
        outcomes: [{
          description: 'You stock up on the item in question.',
          probability: 1,
          effects: [
            { type: 'log', text: 'You stocked up based on the price rumor.' },
          ],
        }],
      },
      {
        id: 'ignore',
        label: 'Ignore the rumor',
        outcomes: [{
          description: 'You shrug and continue normal trading.',
          probability: 1,
          effects: [{ type: 'log', text: 'You dismissed the market rumor.' }],
        }],
      },
    ],
    tags: ['market', 'rumor'],
  },
];

export const AGE_UP_EVENTS: GameEvent[] = [
  {
    id: 'mother_letter',
    title: 'A Letter from Mother',
    emoji: '💌',
    description: 'Your mother sends a letter asking why you never visit. "Are you safe? Are you eating?"',
    choices: [
      {
        id: 'visit',
        label: 'Plan to visit her',
        outcomes: [{
          description: 'You make a mental note to visit.',
          probability: 1,
          effects: [
            { type: 'reputation_public', value: 5 },
            { type: 'log', text: 'You wrote back promising to visit your mother.' },
          ],
        }],
      },
      {
        id: 'send_money',
        label: 'Send her some money',
        outcomes: [{
          description: 'You send a generous sum with the next courier.',
          probability: 1,
          effects: [
            { type: 'money', value: -30 },
            { type: 'reputation_public', value: 3 },
            { type: 'log', text: 'You sent your mother money. She\'ll worry a little less.' },
          ],
        }],
      },
      {
        id: 'ignore',
        label: 'Ignore the letter',
        outcomes: [{
          description: 'You set the letter aside. There\'s always tomorrow.',
          probability: 1,
          effects: [
            { type: 'reputation_public', value: -3 },
            { type: 'log', text: 'You ignored your mother\'s letter. It weighs on you.' },
          ],
        }],
      },
    ],
    tags: ['family', 'relationship', 'age_up'],
  },
  {
    id: 'health_scare',
    title: 'Health Scare',
    emoji: '🤒',
    description: 'You wake up feeling ill. The traveling life takes its toll.',
    choices: [
      {
        id: 'rest',
        label: 'Rest and recover properly',
        outcomes: [{
          description: 'You take a few days to recover fully.',
          probability: 1,
          effects: [
            { type: 'health', value: 15 },
            { type: 'money', value: -15 },
            { type: 'log', text: 'You rested and recovered from the illness.' },
          ],
        }],
      },
      {
        id: 'push_through',
        label: 'Push through and keep trading',
        outcomes: [
          {
            description: 'You fight through it. Barely.',
            probability: 0.5,
            effects: [
              { type: 'health', value: -5 },
              { type: 'log', text: 'You pushed through the illness. Your body isn\'t happy.' },
            ],
          },
          {
            description: 'The illness worsens significantly.',
            probability: 0.5,
            effects: [
              { type: 'health', value: -20 },
              { type: 'stamina', value: -15 },
              { type: 'log', text: 'The illness worsened. You needed to rest anyway.' },
            ],
          },
        ],
      },
    ],
    tags: ['health', 'age_up'],
  },
  {
    id: 'rival_spreads_rumor',
    title: 'Rival Spreads Rumors',
    emoji: '😤',
    description: 'Word reaches you that someone is spreading lies about your goods being counterfeit.',
    choices: [
      {
        id: 'confront',
        label: 'Confront the rumor-monger directly',
        outcomes: [
          {
            description: 'You find and confront them. They back down.',
            probability: 0.55,
            effects: [
              { type: 'reputation_fear', value: 5 },
              { type: 'reputation_public', value: -2 },
              { type: 'log', text: 'You confronted the source of the rumors. They backed down in fear.' },
            ],
          },
          {
            description: 'The confrontation makes things worse.',
            probability: 0.45,
            effects: [
              { type: 'reputation_public', value: -8 },
              { type: 'log', text: 'The confrontation backfired. People are talking more now.' },
            ],
          },
        ],
      },
      {
        id: 'ignore',
        label: 'Rise above it',
        outcomes: [{
          description: 'You let your results speak for themselves.',
          probability: 1,
          effects: [
            { type: 'reputation_underworld', value: 2 },
            { type: 'log', text: 'You ignored the rumors with dignity. Some respected that.' },
          ],
        }],
      },
      {
        id: 'spread_counter',
        label: 'Spread counter-rumors',
        outcomes: [
          {
            description: 'Your counter-rumors land well.',
            probability: 0.6,
            effects: [
              { type: 'stat', stat: 'charisma', value: 1 },
              { type: 'log', text: 'Your counter-rumors were effective. The damage was undone.' },
            ],
          },
          {
            description: 'The mud-slinging makes both of you look bad.',
            probability: 0.4,
            effects: [
              { type: 'reputation_public', value: -5 },
              { type: 'log', text: 'The rumor war left everyone worse off.' },
            ],
          },
        ],
      },
    ],
    tags: ['rival', 'reputation', 'age_up'],
  },
  {
    id: 'windfall',
    title: 'Unexpected Windfall',
    emoji: '🍀',
    description: 'You find an old contract you\'d forgotten about. Someone owes you money.',
    choices: [
      {
        id: 'collect',
        label: 'Collect what\'s owed',
        outcomes: [{
          description: 'You track them down. They pay up.',
          probability: 1,
          effects: [
            { type: 'money', value: 50 },
            { type: 'log', text: 'You collected an old debt. A windfall!' },
          ],
        }],
      },
      {
        id: 'forgive',
        label: 'Forgive the debt',
        outcomes: [{
          description: 'You let it go. They\'re surprised and grateful.',
          probability: 1,
          effects: [
            { type: 'reputation_public', value: 8 },
            { type: 'log', text: 'You forgave an old debt. Your generosity was noted.' },
          ],
        }],
      },
    ],
    tags: ['luck', 'money', 'age_up'],
  },
];

export const ALL_EVENTS = [...TRAVEL_EVENTS, ...MARKET_EVENTS, ...AGE_UP_EVENTS];
