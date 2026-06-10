# Firebase Google Auth & React-Bits Toast Notifications Plan

This plan details the addition of **Firebase Google Sign-In** and a premium, animated **Toast Notification System** (inspired by React Bits micro-interactions) to handle success messages and error alerts throughout the application.

## User Review Required

> [!IMPORTANT]
> **Google Sign-In Popups**: Google Sign-In requires your Firebase project to have Google enabled as a Sign-In Provider in the Firebase Console (under Authentication -> Sign-in method). If it is not enabled, the popup will show a configuration error.
> 
> **Premium Toast Alerts**: The notification toasts will be rendered at the top-right of the viewport with smooth, bounce-in slide transitions from the right using Framer Motion (`AnimatePresence`). They will self-dismiss after 4 seconds and support three variants: `success` (green), `error` (red), and `info` (blue).

---

## Proposed Changes

### Core Configuration & Contexts

#### [NEW] [ToastContext.tsx](file:///c:/Users/Ochieng%20Ochieng/OneDrive/Desktop/CLIENTS/alexi-ecom/context/ToastContext.tsx)
Create a global `ToastProvider` that:
- Maintains a list of active toasts.
- Exposes a `showToast(message, type)` function.
- Renders an overlay layer with animated checkmark, info, or alert icons and close buttons.

#### [NEW] [useToast.ts](file:///c:/Users/Ochieng%20Ochieng/OneDrive/Desktop/CLIENTS/alexi-ecom/hooks/useToast.ts)
Create a helper hook to trigger toasts in any component.

#### [MODIFY] [AuthContext.tsx](file:///c:/Users/Ochieng%20Ochieng/OneDrive/Desktop/CLIENTS/alexi-ecom/context/AuthContext.tsx)
- Expose a `loginWithGoogle` function in the context interface.
- Implement Google Sign-In using Firebase's `GoogleAuthProvider` and `signInWithPopup`.

---

### UI Components & Integration

#### [MODIFY] [main.tsx](file:///c:/Users/Ochieng%20Ochieng/OneDrive/Desktop/CLIENTS/alexi-ecom/src/main.tsx)
Wrap the app with both `<AuthProvider>` and `<ToastProvider>`.

#### [MODIFY] [AuthModal.tsx](file:///c:/Users/Ochieng%20Ochieng/OneDrive/Desktop/CLIENTS/alexi-ecom/src/components/AuthModal.tsx)
- Integrate a premium **"Continue with Google"** button with a custom brand SVG logo.
- Wire the button to the `loginWithGoogle` context method.
- Trigger success toasts on successful login/registration.

#### [MODIFY] [App.tsx](file:///c:/Users/Ochieng%20Ochieng/OneDrive/Desktop/CLIENTS/alexi-ecom/src/App.tsx)
- Integrate `useToast` to fire feedback popups when:
  - Adding items to the cart or wishlist.
  - Removing items or updating quantities.
  - Completing checkout (order placed).
  - Logging out.

#### [MODIFY] [AdminDashboard.tsx](file:///c:/Users/Ochieng%20Ochieng/OneDrive/Desktop/CLIENTS/alexi-ecom/src/components/AdminDashboard.tsx)
- Integrate `useToast` to notify the administrator when:
  - A product is successfully added, modified, or deleted.
  - Storefront configurations (What's new, flash sale) are updated.
  - An order status is updated.

---

## Verification Plan

### Automated Tests
- Run TypeScript compiler diagnostics:
  ```powershell
  npm run lint
  ```

### Manual Verification
1. **Google Login**: Open the login modal, click "Continue with Google", verify the Firebase popup displays and completes login, rendering a success toast "Welcome, [Name]!".
2. **Interactive Toasts**:
   - Add a product to the cart: Verify a green "Success" toast slide-in from the right: *"Added iPhone 15 to your cart."*
   - Remove an item or complete checkout: Verify success toasts.
   - Admin changes: Go to the Admin panel, add a product, and verify the toast confirms the save.
   - Try registering with invalid inputs: Verify the shake animation triggers and the field displays error alerts.
