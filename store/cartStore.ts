import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

type CartStore = {
  cartItems: CartItem[]
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeFromCart: (id: string) => void
  increaseQuantity: (id: string, amount?: number) => void
  decreaseQuantity: (id: string, amount?: number) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
  prepareOrderItems: () => Array<{
    productId: string
    quantity: number
    priceAtPurchase: number
  }>
}

// Apple Pay Style Sound - Clean, Premium, Satisfying
const playApplePaySound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Apple Pay sound characteristics: Clean bell-like tones with perfect timing
    const createApplePayTone = (frequency, startTime, duration, volume = 0.15) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      
      // High-quality filter for crisp, clean sound
      filter.type = 'lowpass';
      filter.frequency.value = 3000;
      filter.Q.value = 1;
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Pure sine wave for clean, bell-like tone
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      
      // Perfect Apple Pay envelope: Quick attack, smooth sustain, gentle release
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02); // Quick attack
      gainNode.gain.exponentialRampToValueAtTime(volume * 0.7, startTime + 0.1); // Sustain
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Smooth release
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    
    const currentTime = audioContext.currentTime;
    
    // Apple Pay signature sound pattern: Two harmonious tones
    createApplePayTone(1000, currentTime, 0.4, 0.12);      // Primary tone - clear and bright
    createApplePayTone(1500, currentTime + 0.05, 0.35, 0.08); // Harmonic tone - adds richness
    
    // Optional: Add subtle lower harmonic for depth (very quiet)
    createApplePayTone(800, currentTime + 0.02, 0.25, 0.04);
    
  } catch (error) {
    console.log('Apple Pay audio not supported');
  }
};

// Mini Apple Pay sound for quantity increases
const playMiniApplePaySound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    // Same high-quality filtering
    filter.type = 'lowpass';
    filter.frequency.value = 2500;
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Single clean tone - shorter and softer than main sound
    oscillator.type = 'sine';
    oscillator.frequency.value = 1200;
    
    // Quick, subtle sound for quantity changes
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.06, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  } catch (error) {
    console.log('Mini Apple Pay audio not supported');
  }
};

// Premium success sound for checkout/purchase confirmation
const playPremiumSuccessSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Three-tone ascending sequence for major success events
    const tones = [
      { freq: 800, time: 0, duration: 0.2, volume: 0.1 },
      { freq: 1000, time: 0.1, duration: 0.25, volume: 0.12 },
      { freq: 1200, time: 0.2, duration: 0.3, volume: 0.15 }
    ];
    
    tones.forEach(tone => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      
      filter.type = 'lowpass';
      filter.frequency.value = 3000;
      filter.Q.value = 2;
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = tone.freq;
      
      const startTime = audioContext.currentTime + tone.time;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(tone.volume, startTime + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + tone.duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + tone.duration);
    });
    
  } catch (error) {
    console.log('Premium success audio not supported');
  }
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      
      // Add to cart with Apple Pay sound
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.cartItems.findIndex(item => item.id === product.id)
          
          // Play premium Apple Pay style sound
          playApplePaySound();
          
          if (existingItemIndex >= 0) {
            const updatedItems = [...state.cartItems]
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + quantity
            }
            return { cartItems: updatedItems }
          }
          
          return {
            cartItems: [...state.cartItems, { ...product, quantity }]
          }
        })
      },
      
      removeFromCart: (id) => {
        set((state) => ({
          cartItems: state.cartItems.filter(item => item.id !== id)
        }))
      },
      
      // Increase quantity with subtle Apple Pay sound
      increaseQuantity: (id, amount = 1) => {
        // Play mini Apple Pay sound for quantity increases
        playMiniApplePaySound();
        
        set((state) => ({
          cartItems: state.cartItems.map(item =>
            item.id === id 
              ? { ...item, quantity: item.quantity + amount }
              : item
          )
        }))
      },
      
      // Decrease quantity by amount (default 1), never goes below 1
      decreaseQuantity: (id, amount = 1) => {
        set((state) => ({
          cartItems: state.cartItems.map(item =>
            item.id === id 
              ? { ...item, quantity: Math.max(1, item.quantity - amount) }
              : item
          )
        }))
      },
      
      // Directly set quantity (minimum 1)
      updateQuantity: (id, quantity) => {
        set((state) => ({
          cartItems: state.cartItems.map(item =>
            item.id === id 
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          )
        }))
      },
      
      clearCart: () => {
        set({ cartItems: [] })
      },
      
      // Get total number of items in cart (sum of quantities)
      totalItems: () => {
        return get().cartItems.reduce((total, item) => total + item.quantity, 0)
      },
      
      // Calculate total price of all items in cart
      totalPrice: () => {
        return get().cartItems.reduce(
          (total, item) => total + (item.price * item.quantity), 
          0
        )
      },
      
      // Format cart items for order processing
      prepareOrderItems: () => {
        return get().cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          priceAtPurchase: item.price
        }))
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cartItems: state.cartItems }),
      onRehydrateStorage: () => (state) => {
        console.log('Cart data loaded from localStorage')
      },
    }
  )
)