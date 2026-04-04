import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  orderBy,
  Timestamp
} from '../firebase';

// Types
export interface Creation {
  id: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  image: string;
  url: string;
  icon: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ContactConfig {
  title: string;
  description: string;
  email: string;
  xiaohongshu: string;
  qrCode?: string;
  updatedAt: string;
}

export interface Settings {
  contact: ContactConfig;
}

// Admin password stored in Firestore
const ADMIN_COLLECTION = 'admin';
const CREATIONS_COLLECTION = 'creations';
const SETTINGS_COLLECTION = 'settings';

// Check admin password
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const adminDoc = await getDoc(doc(db, ADMIN_COLLECTION, 'config'));
  if (!adminDoc.exists()) {
    // First time setup - use default password
    return password === 'admin123';
  }
  const adminData = adminDoc.data();
  return password === adminData?.password;
}

// Set admin password
export async function setAdminPassword(password: string): Promise<void> {
  await setDoc(doc(db, ADMIN_COLLECTION, 'config'), { password }, { merge: true });
}

// Get all creations
export async function getCreations(): Promise<Creation[]> {
  const q = query(collection(db, CREATIONS_COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Creation[];
}

// Create a new creation
export async function createCreation(data: Omit<Creation, 'id' | 'createdAt'>): Promise<Creation> {
  const now = Timestamp.now().toMillis().toString();
  const newCreation: Creation = {
    ...data,
    id: Date.now().toString(),
    createdAt: now
  };
  await addDoc(collection(db, CREATIONS_COLLECTION), newCreation);
  return newCreation;
}

// Update a creation
export async function updateCreation(id: string, data: Partial<Creation>): Promise<void> {
  const now = Timestamp.now().toMillis().toString();
  await updateDoc(doc(db, CREATIONS_COLLECTION, id), {
    ...data,
    updatedAt: now
  });
}

// Delete a creation
export async function deleteCreation(id: string): Promise<void> {
  await deleteDoc(doc(db, CREATIONS_COLLECTION, id));
}

// Get settings
export async function getSettings(): Promise<ContactConfig> {
  const settingsDoc = await getDoc(doc(db, SETTINGS_COLLECTION, 'contact'));
  if (!settingsDoc.exists()) {
    // Return default settings
    return {
      title: '联系造物者',
      description: '扫描二维码关注造物测官方小红书，获取更多关于设计美学与造物灵感的深度资讯。',
      email: 'hello@zaowuce.design',
      xiaohongshu: 'zaowu_official',
      updatedAt: new Date().toISOString()
    };
  }
  return settingsDoc.data() as ContactConfig;
}

// Save settings
export async function saveSettings(data: ContactConfig): Promise<ContactConfig> {
  const now = Timestamp.now().toMillis().toString();
  const settings: ContactConfig = {
    ...data,
    updatedAt: now
  };
  await setDoc(doc(db, SETTINGS_COLLECTION, 'contact'), settings, { merge: true });
  return settings;
}