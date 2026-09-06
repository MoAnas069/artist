import { Timestamp } from 'firebase/firestore';

// ─── Artwork ─────────────────────────────────────────────
export interface Artwork {
  id: string;
  title: string;
  slug: string;
  year: number;
  category: string;
  medium: string;
  description: string;
  coverImage: string;
  images: string[];
  processImages: string[];
  artistNotes: string;
  dimensions: string;
  credits: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type ArtworkFormData = Omit<Artwork, 'id' | 'createdAt' | 'updatedAt'>;

// ─── Journal ─────────────────────────────────────────────
export interface JournalPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  content: string;
  author: string;
  published: boolean;
  publishedAt: Timestamp | null;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type JournalPostFormData = Omit<JournalPost, 'id' | 'createdAt' | 'updatedAt'>;

// ─── Product ─────────────────────────────────────────────
export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  images: string[];
  price: number;
  currency: string;
  type: string;
  materials: string;
  dimensions: string;
  edition: string;
  stock: number;
  available: boolean;
  featured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

// ─── Contact Message ─────────────────────────────────────
export type MessageStatus = 'unread' | 'read' | 'archived';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  projectType: string;
  budget: string;
  deadline: string;
  message: string;
  referenceFiles: string[];
  status: MessageStatus;
  createdAt: Timestamp;
  // Shop acquisition inquiry fields
  inquiryType?: 'shop' | 'commission' | 'general';
  productId?: string;
  productTitle?: string;
  productPrice?: number;
  productCurrency?: string;
  productImage?: string;
  quantity?: number;
  framing?: string;
  phone?: string;
  country?: string;
}

export type ContactMessageFormData = Omit<ContactMessage, 'id' | 'createdAt' | 'status'>;

// ─── Site Settings ───────────────────────────────────────
export interface SiteSettings {
  artistName: string;
  shortBio: string;
  longBio: string;
  aboutSections: AboutSection[];
  email: string;
  instagram: string;
  threads: string;
  twitter: string;
  discord: string;
  copyrightText: string;
  homepageStatement: string;
  homepageSubtitle: string;
  contactText: string;
  seoTitle?: string;
  seoDescription?: string;
  featuredArtworkIds: string[];
  artistPortrait: string;
  artSublabel?: string;
  artXrayImage?: string;
  meSublabel?: string;
  meXrayImage?: string;
  journalSublabel?: string;
  journalXrayImage?: string;
  shopSublabel?: string;
  shopXrayImage?: string;
  contactSublabel?: string;
  contactXrayImage?: string;
}

export interface AboutSection {
  title: string;
  content: string;
  order: number;
}

// ─── Timeline Entry ──────────────────────────────────────
export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  type: 'exhibition' | 'collaboration' | 'award' | 'residency' | 'other';
}

// ─── Navigation ──────────────────────────────────────────
export interface NavItem {
  label: string;
  path: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

// ─── Admin Dashboard ─────────────────────────────────────
export interface DashboardStats {
  totalArtworks: number;
  publishedArtworks: number;
  draftArtworks: number;
  journalPosts: number;
  products: number;
  unreadMessages: number;
}
