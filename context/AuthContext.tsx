import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../src/firebase';
import { UserProfile, Order, Notification } from '../src/types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  allUsers: UserProfile[];
  allOrders: Order[];
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (name: string, email: string, password: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);

  // Load all users from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('alexi_users');
    let loadedUsers: UserProfile[] = [];
    if (storedUsers) {
      try {
        loadedUsers = JSON.parse(storedUsers);
      } catch (e) {
        console.error("Failed to parse stored users", e);
      }
    }

    // Pre-seed admin user in local storage if not present
    const hasAdmin = loadedUsers.some(u => u.email === 'alexi@gmail.com');
    if (!hasAdmin) {
      const adminUser: UserProfile = {
        name: 'Alexi',
        email: 'alexi@gmail.com',
        role: 'admin',
        phone: '+254 712 345 678',
        location: 'Nairobi, Kenya',
        orders: [],
        notifications: [
          {
            id: 'n-admin-1',
            title: 'Welcome Admin!',
            message: 'You have logged into the admin account.',
            date: new Date().toLocaleDateString(),
            read: false
          }
        ]
      };
      loadedUsers.push(adminUser);
      localStorage.setItem('alexi_users', JSON.stringify(loadedUsers));
    }

    setUsersList(loadedUsers);
  }, []);

  // Sync profile metadata with the local users list database
  const getLocalProfile = (email: string): UserProfile | null => {
    const stored = localStorage.getItem('alexi_users');
    if (stored) {
      try {
        const list: UserProfile[] = JSON.parse(stored);
        const match = list.find(u => u.email.toLowerCase() === email.toLowerCase());
        return match || null;
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  };

  const createLocalProfile = (firebaseUser: FirebaseUser, displayName?: string): UserProfile => {
    const email = firebaseUser.email || '';
    const name = displayName || firebaseUser.displayName || email.split('@')[0] || 'User';
    const role = email.toLowerCase() === 'alexi@gmail.com' ? 'admin' : 'user';

    const newProfile: UserProfile = {
      name,
      email,
      role,
      phone: '',
      location: '',
      orders: [],
      notifications: [
        {
          id: `n-${Date.now()}`,
          title: 'Welcome to Alexi!',
          message: 'Thank you for registering with us. We hope you enjoy shopping.',
          date: new Date().toLocaleDateString(),
          read: false
        }
      ]
    };

    // Update list state and save
    setUsersList(prev => {
      const updated = [...prev.filter(u => u.email.toLowerCase() !== email.toLowerCase()), newProfile];
      localStorage.setItem('alexi_users', JSON.stringify(updated));
      return updated;
    });

    return newProfile;
  };

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const email = firebaseUser.email || '';
        let profile = getLocalProfile(email);
        if (!profile) {
          profile = createLocalProfile(firebaseUser);
        }
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const emailVal = userCredential.user.email || email;
      let profile = getLocalProfile(emailVal);
      if (!profile) {
        profile = createLocalProfile(userCredential.user);
      }
      setUser(profile);
      return profile;
    } catch (error: any) {
      // Auto-provision admin user if they log in with the correct credentials
      if (email.toLowerCase() === 'alexi@gmail.com' && password === 'alexi123') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          if (userCredential.user) {
            await firebaseUpdateProfile(userCredential.user, { displayName: 'Alexi' });
          }
          const profile = createLocalProfile(userCredential.user, 'Alexi');
          setUser(profile);
          return profile;
        } catch (regError) {
          throw error;
        }
      }
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<UserProfile> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
      try {
        await firebaseUpdateProfile(userCredential.user, { displayName: name });
      } catch (err) {
        console.error("Failed to update displayName in firebase", err);
      }
    }
    const profile = createLocalProfile(userCredential.user, name);
    setUser(profile);
    return profile;
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);

    setUsersList(prev => {
      const updated = prev.map(u => 
        u.email.toLowerCase() === user.email.toLowerCase() ? { ...u, ...data } : u
      );
      localStorage.setItem('alexi_users', JSON.stringify(updated));
      return updated;
    });
  };

  const addOrder = (order: Order) => {
    if (!user) return;
    const updatedOrders = [order, ...(user.orders || [])];
    updateProfile({ orders: updatedOrders });
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    // Update active user if they own the order
    if (user && user.orders?.some(o => o.id === orderId)) {
      const updatedOrders = user.orders.map(o => o.id === orderId ? { ...o, status } : o);
      updateProfile({ orders: updatedOrders });
    }

    // Update the orders database for all users (e.g. for user insights)
    setUsersList(prev => {
      const updated = prev.map(u => {
        const hasOrder = u.orders?.some(o => o.id === orderId);
        if (hasOrder) {
          return {
            ...u,
            orders: u.orders.map(o => o.id === orderId ? { ...o, status } : o)
          };
        }
        return u;
      });
      localStorage.setItem('alexi_users', JSON.stringify(updated));
      return updated;
    });
  };

  // Compile all orders across all registered users (sorted latest first)
  const allOrders = usersList
    .reduce<Order[]>((acc, u) => {
      if (u.orders) {
        return [...acc, ...u.orders];
      }
      return acc;
    }, [])
    .sort((a, b) => new Date(b.date).getTime() - a.date.getTime());

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      allUsers: usersList,
      allOrders,
      login,
      register,
      logout,
      updateProfile,
      addOrder,
      updateOrderStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
}
