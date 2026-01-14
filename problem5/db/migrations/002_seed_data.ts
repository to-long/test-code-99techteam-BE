import type { Database } from 'sql.js';

export const name = '002_seed_data';

export function up(db: Database): void {
  const stacks = [
    {
      name: 'Work Tasks',
      cover_type: 'gradient',
      cover_value: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      created_at: '2024-01-15T10:00:00Z',
    },
    {
      name: 'Personal Notes',
      cover_type: 'color',
      cover_value: '#22c55e',
      created_at: '2024-01-16T14:30:00Z',
    },
    {
      name: 'Ideas & Inspiration',
      cover_type: 'image',
      cover_value: 'https://static.ybox.vn/2023/2/6/1677290719435-ybox.png',
      created_at: '2024-01-17T09:15:00Z',
    },
    {
      name: 'Learning Resources',
      cover_type: 'gradient',
      cover_value: 'linear-gradient(135deg, #f59e0b, #ef4444)',
      created_at: '2024-01-18T08:00:00Z',
    },
    {
      name: 'Travel Plans',
      cover_type: 'image',
      cover_value: 'https://static.ybox.vn/2025/6/0/1748788222767-2.jpg',
      created_at: '2024-01-19T16:45:00Z',
    },
    {
      name: 'Recipes',
      cover_type: 'color',
      cover_value: '#ec4899',
      created_at: '2024-01-20T11:30:00Z',
    },
    {
      name: 'Fitness Goals',
      cover_type: 'gradient',
      cover_value: 'linear-gradient(135deg, #10b981, #06b6d4)',
      created_at: '2024-01-21T07:00:00Z',
    },
    {
      name: 'Book Club',
      cover_type: 'image',
      cover_value:
        'https://static.ybox.vn/2021/10/3/1634091862062-Thi%E1%BA%BFt%20k%E1%BA%BF%20kh%C3%B4ng%20t%C3%AAn%20(23).png',
      created_at: '2024-01-22T19:00:00Z',
    },
  ];

  for (const stack of stacks) {
    db.run('INSERT INTO stacks (name, cover_type, cover_value, created_at) VALUES (?, ?, ?, ?)', [
      stack.name,
      stack.cover_type,
      stack.cover_value,
      stack.created_at,
    ]);
  }

  const cards = [
    // Work Tasks (stack_id: 1)
    {
      stack_id: 1,
      name: 'Review Authentication PR #423',
      cover: 'https://static.ybox.vn/2025/12/3/1765967612414-anhchupmanhinh20251217173259.png',
      description:
        'Review the new OAuth2 implementation for Google and GitHub login. Pay attention to token refresh logic and security best practices. Check error handling edge cases.',
      created_at: '2024-01-15T11:00:00Z',
    },
    {
      stack_id: 1,
      name: 'Weekly Team Standup',
      cover: 'https://static.ybox.vn/2025/12/3/1765967181492-anhchupmanhinh20251217172542.png',
      description:
        'Every Monday at 10am. Agenda: Sprint progress, blockers, upcoming deadlines. Prepare demo for the new dashboard feature.',
      created_at: '2024-01-15T12:00:00Z',
    },
    {
      stack_id: 1,
      name: 'Database Migration Planning',
      cover: 'https://static.ybox.vn/2024/2/1/1708916831897-1684922879275-1684903803228-1.png',
      description:
        'Plan migration from PostgreSQL 14 to 16. Document breaking changes, test rollback procedures, schedule maintenance window for Saturday 2am-4am.',
      created_at: '2024-01-15T14:30:00Z',
    },
    {
      stack_id: 1,
      name: 'Q1 Performance Review',
      cover: 'https://static.ybox.vn/2025/11/5/1763704494484-Corsairlogo.png',
      description:
        'Prepare self-assessment for Q1. Highlight key achievements: reduced API latency by 40%, mentored 2 junior devs, shipped 3 major features.',
      created_at: '2024-01-15T16:00:00Z',
    },

    // Personal Notes (stack_id: 2)
    {
      stack_id: 2,
      name: 'Weekly Grocery Shopping',
      cover: 'https://static.ybox.vn/2022/9/3/1664351758809-Logo%20700X400.jpg',
      description:
        'Organic milk, free-range eggs, sourdough bread, avocados, spinach, chicken breast, olive oil, garlic, lemons, Greek yogurt, almonds.',
      created_at: '2024-01-16T15:00:00Z',
    },
    {
      stack_id: 2,
      name: 'Home Improvement Projects',
      cover:
        'https://static.ybox.vn/2025/11/3/1762280579666-2880481683478234675354328291037224458393237n.jpg',
      description:
        '1. Fix leaky kitchen faucet 2. Repaint guest bedroom (Benjamin Moore - Cloud White) 3. Install smart thermostat 4. Organize garage storage',
      created_at: '2024-01-16T17:30:00Z',
    },
    {
      stack_id: 2,
      name: 'Birthday Gift Ideas - Mom',
      cover: 'https://static.ybox.vn/2024/10/1/1728273479716-scxcdc.png',
      description:
        'Birthday: March 15th. Ideas: Spa day voucher, cashmere scarf, cooking class subscription, photo album with family pictures, weekend getaway.',
      created_at: '2024-01-16T19:00:00Z',
    },

    // Ideas & Inspiration (stack_id: 3)
    {
      stack_id: 3,
      name: 'AI-Powered Habit Tracker App',
      cover:
        'https://static.ybox.vn/2021/7/3/1626830177954--%20Talent%20Acquisition%20-%202021-07-21T081434.028.png',
      description:
        'Mobile app that uses ML to predict habit completion likelihood, suggests optimal times for habits based on calendar, integrates with Apple Health and Google Fit. Monetization: Freemium with premium insights.',
      created_at: '2024-01-17T10:00:00Z',
    },
    {
      stack_id: 3,
      name: 'TypeScript Best Practices Blog Series',
      cover: 'https://static.ybox.vn/2025/12/1/1765806439069-taixuong.png',
      description:
        'Part 1: Advanced generics and conditional types. Part 2: Type-safe API clients with Zod. Part 3: Testing strategies for TypeScript. Part 4: Migrating large codebases from JavaScript.',
      created_at: '2024-01-17T11:00:00Z',
    },
    {
      stack_id: 3,
      name: 'Smart Garden Monitoring System',
      cover: 'https://static.ybox.vn/2023/4/2/1680589774930-1.png',
      description:
        'Raspberry Pi project with soil moisture, temperature, and light sensors. Auto-watering system. Mobile app dashboard. Weather API integration for smart scheduling.',
      created_at: '2024-01-17T14:00:00Z',
    },

    // Learning Resources (stack_id: 4)
    {
      stack_id: 4,
      name: 'Rust Programming Fundamentals',
      cover: 'https://static.ybox.vn/2025/12/4/1764812103475-fvfvfg.png',
      description:
        'Complete "The Rust Programming Language" book. Focus on ownership, borrowing, lifetimes. Build a CLI tool as practice project. Target: 2 hours daily for 4 weeks.',
      created_at: '2024-01-18T09:00:00Z',
    },
    {
      stack_id: 4,
      name: 'System Design Interview Prep',
      cover:
        'https://static.ybox.vn/2025/10/2/1761632921256-Dethuchienviecmuahangtrenwebsitehttpsnpplinhanh2kiotvietwebvnbancanthuchiencacbuocsaudayBuoc1TruycapvaowebsitebangcachnhapdiachiURLhttpsnpplinhanh2kiotvietwebvnl5.png',
      description:
        'Study: Load balancing, caching strategies, database sharding, message queues. Resources: "Designing Data-Intensive Applications", ByteByteGo YouTube channel.',
      created_at: '2024-01-18T11:00:00Z',
    },
    {
      stack_id: 4,
      name: 'AWS Solutions Architect Certification',
      cover: 'https://static.ybox.vn/2024/2/4/1707325920105-1679677440141-z-(2).png',
      description:
        'Exam scheduled for March 20th. Complete A Cloud Guru course, do 3 practice exams, hands-on labs for VPC, Lambda, S3, DynamoDB, CloudFormation.',
      created_at: '2024-01-18T14:00:00Z',
    },

    // Travel Plans (stack_id: 5)
    {
      stack_id: 5,
      name: 'Japan Cherry Blossom Trip',
      cover: 'https://static.ybox.vn/2020/6/2/1592881441807-1.png',
      description:
        'March 28 - April 10. Tokyo (4 nights) → Kyoto (3 nights) → Osaka (2 nights) → Hiroshima day trip. Book JR Pass, reserve ryokan in Kyoto, Shibuya crossing, teamLab museum.',
      created_at: '2024-01-19T17:00:00Z',
    },
    {
      stack_id: 5,
      name: 'Weekend Hiking Trip - Yosemite',
      cover: 'https://static.ybox.vn/2020/10/5/1604022874118-1575021304920-Untitled%20design.png',
      description:
        'February 15-17. Trails: Mist Trail to Vernal Falls, Valley View, Mirror Lake. Camping at Camp 4. Pack: layers, hiking boots, bear canister, camera gear.',
      created_at: '2024-01-19T19:30:00Z',
    },

    // Recipes (stack_id: 6)
    {
      stack_id: 6,
      name: 'Homemade Pasta Carbonara',
      cover: 'https://static.ybox.vn/2025/12/6/1765630361471-rsz2152031247.jpg',
      description:
        'Ingredients: 400g spaghetti, 200g guanciale, 4 egg yolks, 100g Pecorino Romano, black pepper. Key: Temper eggs slowly, reserve pasta water, no cream ever!',
      created_at: '2024-01-20T12:00:00Z',
    },
    {
      stack_id: 6,
      name: 'Thai Green Curry from Scratch',
      cover:
        'https://static.ybox.vn/2025/10/5/1761928581259-1722143151091AnhchupManhinh20240728luc120532.png',
      description:
        'Green curry paste: Thai chilies, lemongrass, galangal, shallots, garlic, cilantro roots, cumin, coriander. Simmer with coconut milk, chicken, Thai eggplant, basil. Serve with jasmine rice.',
      created_at: '2024-01-20T14:30:00Z',
    },
    {
      stack_id: 6,
      name: 'Sourdough Bread Recipe',
      cover:
        'https://static.ybox.vn/2025/12/1/1765178048231-dethuchienviecmuahangtrenwebsitehttpsnpplinhanh2kiotvietwebvnbancanthuchiencacbuocsaudaybuoc1truycapvaowebsitebangcachnhapdiachiurlhttpsnpplinhanh2kiotvietwebvnl15.png',
      description:
        '500g bread flour, 350g water, 100g active starter, 10g salt. Autolyse 1hr, 4 stretch-and-folds, bulk ferment 4-6hrs, shape, cold proof overnight, bake at 500°F in Dutch oven.',
      created_at: '2024-01-20T16:00:00Z',
    },

    // Fitness Goals (stack_id: 7)
    {
      stack_id: 7,
      name: 'Marathon Training Plan',
      cover: 'https://static.ybox.vn/2025/12/5/1764929789949-pegasilogo.jpg',
      description:
        '16-week plan for LA Marathon (March 17). Current: 25 miles/week. Target: 50 miles/week peak. Long runs on Sundays, tempo Tuesdays, easy recovery days. Goal time: sub 4 hours.',
      created_at: '2024-01-21T07:30:00Z',
    },
    {
      stack_id: 7,
      name: 'Strength Training - Push/Pull/Legs',
      cover: 'https://static.ybox.vn/2025/12/3/1765944665826-t2.png',
      description:
        'Push: Bench 185lb, OHP 115lb, dips. Pull: Deadlift 275lb, rows, pull-ups. Legs: Squat 225lb, RDL, lunges. 6 days/week, progressive overload, deload every 4th week.',
      created_at: '2024-01-21T09:00:00Z',
    },
    {
      stack_id: 7,
      name: 'Yoga & Flexibility Routine',
      cover: 'https://static.ybox.vn/2025/11/5/1764348263425-obestock1229220261.jpeg',
      description:
        'Morning: 20min sun salutation flow. Evening: 15min hip openers and hamstring stretches. Weekly: Saturday 75min vinyasa class at CorePower. Goal: Touch toes, full splits by June.',
      created_at: '2024-01-21T10:30:00Z',
    },

    // Book Club (stack_id: 8)
    {
      stack_id: 8,
      name: 'Currently Reading: Project Hail Mary',
      cover: 'https://static.ybox.vn/2025/12/3/1765967612414-anhchupmanhinh20251217173259.png',
      description:
        'By Andy Weir. Page 245/496. Discussion points: Ryland Grace character development, the science of Astrophage, themes of isolation and friendship. Club meeting: Feb 5th.',
      created_at: '2024-01-22T19:30:00Z',
    },
    {
      stack_id: 8,
      name: 'Up Next: The Midnight Library',
      cover: 'https://static.ybox.vn/2025/12/3/1765967181492-anhchupmanhinh20251217172542.png',
      description:
        'By Matt Haig. Explores parallel lives and choices. Themes align with our Q1 focus on philosophical fiction. Reserve at local library or buy Kindle version.',
      created_at: '2024-01-22T20:00:00Z',
    },
    {
      stack_id: 8,
      name: '2024 Reading Challenge Progress',
      cover: 'https://static.ybox.vn/2024/2/1/1708916831897-1684922879275-1684903803228-1.png',
      description:
        'Goal: 24 books this year. Completed: 2/24. Categories to hit: 4 non-fiction, 4 sci-fi, 4 classics, 4 contemporary fiction, 4 self-improvement, 4 member picks.',
      created_at: '2024-01-22T20:30:00Z',
    },
  ];

  for (const card of cards) {
    db.run(
      'INSERT INTO cards (stack_id, name, cover, description, created_at) VALUES (?, ?, ?, ?, ?)',
      [card.stack_id, card.name, card.cover, card.description, card.created_at],
    );
  }
}
