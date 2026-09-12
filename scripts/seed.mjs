import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

// Load .env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const [key, ...vals] = trimmed.split('=');
  if (key && vals.length) {
    env[key.trim()] = vals.join('=').trim();
  }
});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

console.log('Connecting to Firebase project:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const adminEmail = 'admin@studio.com';
const adminPassword = 'AdminPassword123!';

async function authenticate() {
  try {
    const cred = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    console.log('Signed in as existing admin:', cred.user.email);
    return cred.user;
  } catch (err) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      console.log('Admin user not found. Creating admin user...');
      const newCred = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      console.log('Created admin user:', newCred.user.email);
      return newCred.user;
    }
    throw err;
  }
}

const initialSettings = {
  artistName: 'Rowan Vance',
  shortBio: 'Illustrator & visual storyteller exploring solitude, memory, and quiet atmospheric worlds.',
  longBio: `<p>Rowan Vance is an illustrator and visual storyteller currently based between London and the coast of Cornwall. His work revolves around narrative image-making, editorial commissions, and intimate limited edition screenprints.</p>
<p>Working primarily with gouache, monoprint textures, and digital refinement, Rowan builds imagery centered on quiet reflection, chiaroscuro lighting, and poetic human narratives.</p>`,
  aboutSections: [
    { title: 'Selected Clients', content: 'Penguin Random House, The New Yorker, The Folio Society, Faber & Faber, The Atlantic, Granta', order: 1 },
    { title: 'Exhibitions & Accolades', content: '2025 Solo Exhibition — Gallery No. 9, London\n2024 Group Show — Somerset House\n2023 World Illustration Awards Shortlist', order: 2 },
    { title: 'Studio Practice', content: 'All pieces begin as sketchbook studies in ink or oil pastels before being developed into full compositions with rich paper grain.', order: 3 },
  ],
  email: 'studio@rowanvance.com',
  instagram: 'https://instagram.com',
  threads: 'https://threads.net',
  twitter: 'https://x.com',
  discord: '',
  copyrightText: `© ${new Date().getFullYear()} Rowan Vance. All rights reserved.`,
  homepageStatement: 'Contemporary Illustration & Narrative Art',
  homepageSubtitle: 'Exploring solitude, memory, and myth through textured brushwork and quiet light',
  contactText: "Have a project or editorial commission in mind? Let's make something thoughtful together.",
  seoTitle: 'Rowan Vance — Contemporary Illustrator & Artist',
  seoDescription: 'Portfolio and studio archive of Rowan Vance, contemporary artist and visual storyteller.',
  featuredArtworkIds: ['art-1', 'art-2', 'art-3', 'art-4'],
  artistPortrait: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80',
  artSublabel: 'Selected Paintings, Drawings & Archive',
  artXrayImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1920&auto=format&fit=crop&q=85',
  meSublabel: 'Biography, Philosophy & Studio Practice',
  meXrayImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1920&auto=format&fit=crop&q=85',
  journalSublabel: 'Studio Notes, Process & Literary Essays',
  journalXrayImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1920&auto=format&fit=crop&q=85',
  shopSublabel: 'Limited Edition Archival Prints & Objects',
  shopXrayImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1920&auto=format&fit=crop&q=85',
  contactSublabel: 'Commissions, Gallery Inquiries & Press',
  contactXrayImage: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1920&auto=format&fit=crop&q=85',
};

const initialArtworks = [
  {
    id: 'art-1',
    title: 'The Silent Hour',
    slug: 'the-silent-hour',
    year: 2025,
    category: 'Editorial',
    medium: 'Gouache & Monoprint on archival paper',
    description: 'A study on dusk settling over coastal headlands, painted for a personal series on winter stillness.',
    coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80',
    ],
    processImages: [
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1000&auto=format&fit=crop&q=80',
    ],
    artistNotes: 'Created using raw umber washes and layered charcoal dust applied with Japanese hake brushes.',
    dimensions: '420 × 594 mm (A2)',
    credits: 'Private Collection',
    featured: true,
    published: true,
    sortOrder: 1,
  },
  {
    id: 'art-2',
    title: 'Nocturne for Two Solitudes',
    slug: 'nocturne-for-two-solitudes',
    year: 2025,
    category: 'Publishing',
    medium: 'Digital composite with handmade ink grain',
    description: 'Commissioned cover illustration for a literary translation exploring distance between old friends.',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549887534-1541e9326642?w=1200&auto=format&fit=crop&q=80',
    ],
    processImages: [],
    artistNotes: 'Balancing deep Prussian blues against the warm ember glow of a distant lantern.',
    dimensions: '300 × 450 mm',
    credits: 'Commissioned by Gallimard Éditions',
    featured: true,
    published: true,
    sortOrder: 2,
  },
  {
    id: 'art-3',
    title: 'The Cartographer’s Dream',
    slug: 'the-cartographers-dream',
    year: 2024,
    category: 'Series',
    medium: 'Ink, ochre pigment, and graphite',
    description: 'Part of an ongoing suite of narrative prints about forgotten sea routes and lost coordinates.',
    coverImage: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop&q=80',
    ],
    processImages: [],
    artistNotes: 'Inspired by 16th-century navigational maps and celestial charts.',
    dimensions: '500 × 700 mm',
    credits: 'Featured at Somerset House Exhibition',
    featured: true,
    published: true,
    sortOrder: 3,
  },
  {
    id: 'art-4',
    title: 'Arrival in the Cold Mist',
    slug: 'arrival-in-the-cold-mist',
    year: 2024,
    category: 'Personal',
    medium: 'Oil on linen panel',
    description: 'A solitary traveler standing at the edge of an empty platform as dusk settles.',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
    ],
    processImages: [],
    artistNotes: 'A study in limited color value — using primarily Payne’s grey and Naples yellow.',
    dimensions: '600 × 800 mm',
    credits: 'Artist Archive',
    featured: true,
    published: true,
    sortOrder: 4,
  },
];

const initialJournalPosts = [
  {
    id: 'post-1',
    title: 'On the Weight of Quiet Images',
    slug: 'on-the-weight-of-quiet-images',
    excerpt: 'Notes on using negative space, chiaroscuro, and restraint in contemporary editorial visual storytelling.',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1000&auto=format&fit=crop&q=80',
    content: `<p>There is a peculiar tension in modern image-making. So much visual media demands immediate attention with screaming color and hyperactivity. Yet the images that stay with us for decades are almost always the quiet ones.</p>
<p>When working on an editorial brief, the temptation is often to fill the frame with narrative elements until every corner is explained. But leaving shadow untouched invites the viewer to step into the scene and bring their own memories.</p>`,
    author: 'Rowan Vance',
    published: true,
    tags: ['Process', 'Philosophy', 'Illustration'],
    seoTitle: 'On the Weight of Quiet Images — Rowan Vance',
    seoDescription: 'Reflections on negative space and chiaroscuro in editorial illustration.',
  },
  {
    id: 'post-2',
    title: 'Monoprint Textures and Digital Synthesis',
    slug: 'monoprint-textures-and-digital-synthesis',
    excerpt: 'How physical printmaking informs digital brush engines and keeps organic texture alive.',
    coverImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1000&auto=format&fit=crop&q=80',
    content: `<p>Every digital artwork I produce starts on the litho press or glass inking slab. By transferring oil-based inks with rollers onto handmade washi paper, unpredictable grain patterns emerge that no digital algorithm can mimic.</p>`,
    author: 'Rowan Vance',
    published: true,
    tags: ['Technique', 'Printmaking'],
    seoTitle: 'Monoprint Textures — Rowan Vance',
    seoDescription: 'How traditional printmaking informs contemporary digital art.',
  },
];

const initialProducts = [
  {
    id: 'prod-1',
    title: 'The Silent Hour (Archival Print)',
    slug: 'the-silent-hour-print',
    description: 'Limited museum-grade Giclée print on 310gsm Hahnemühle German Etching paper. Signed and numbered by the artist.',
    images: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1000&auto=format&fit=crop&q=80',
    ],
    price: 95,
    currency: 'GBP',
    type: 'Print',
    materials: 'Hahnemühle 310gsm archival cotton rag, pigment inks',
    dimensions: '420 × 594 mm (A2)',
    edition: 'Edition of 50',
    stock: 18,
    available: true,
    featured: true,
  },
  {
    id: 'prod-2',
    title: 'Nocturne for Two Solitudes (Fine Art Edition)',
    slug: 'nocturne-for-two-solitudes-edition',
    description: 'Hand-pulled 4-color screenprint with custom metallic copper overlay on Somerset Satin paper.',
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80',
    ],
    price: 130,
    currency: 'GBP',
    type: 'Screenprint',
    materials: 'Somerset Satin 300gsm, water-based acrylic inks',
    dimensions: '500 × 700 mm',
    edition: 'Limited Edition of 35',
    stock: 7,
    available: true,
    featured: true,
  },
];

async function seed() {
  await authenticate();

  console.log('Seeding settings...');
  await setDoc(doc(db, 'settings', 'site'), {
    ...initialSettings,
    updatedAt: serverTimestamp(),
  });
  console.log('✓ Settings seeded');

  console.log('Seeding artworks...');
  for (const art of initialArtworks) {
    const { id, ...data } = art;
    await setDoc(doc(db, 'artworks', id), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log(`✓ Seeded artwork: ${art.title}`);
  }

  console.log('Seeding journal posts...');
  for (const post of initialJournalPosts) {
    const { id, ...data } = post;
    await setDoc(doc(db, 'journal', id), {
      ...data,
      publishedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log(`✓ Seeded post: ${post.title}`);
  }

  console.log('Seeding products...');
  for (const prod of initialProducts) {
    const { id, ...data } = prod;
    await setDoc(doc(db, 'products', id), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log(`✓ Seeded product: ${prod.title}`);
  }

  console.log('All data seeded successfully into Cloud Firestore!');
  process.exit(0);
}

seed().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
