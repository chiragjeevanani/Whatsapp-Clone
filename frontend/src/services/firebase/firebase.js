import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { apiClient } from "../common/apiClient";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

/**
 * Initializes FCM Push Notifications:
 * 1. Checks support
 * 2. Requests permissions
 * 3. Registers service worker
 * 4. Gets registration token and POSTs to backend users/fcm-token
 */
export const initFcmNotifications = async () => {
  if (typeof window === "undefined") return;

  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("FCM: Push notifications are not supported in this browser.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("FCM: Notification permission denied.");
      return;
    }

    const registration = await navigator.serviceWorker.register(
      `/firebase-messaging-sw.js?messagingSenderId=${encodeURIComponent(firebaseConfig.messagingSenderId || "")}`
    );
    
    // Lazy-load messaging to prevent build/SSR issues
    const messaging = getMessaging(app);

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    if (token) {
      console.log("FCM: Client Token acquired:", token);
      await apiClient.post("/users/fcm-token", { token, platform: "web" });
      console.log("FCM: Client Token registered on backend successfully.");
    } else {
      console.warn("FCM: No client registration token returned.");
    }
  } catch (err) {
    console.error("FCM: Initialization failed:", err);
  }
};
