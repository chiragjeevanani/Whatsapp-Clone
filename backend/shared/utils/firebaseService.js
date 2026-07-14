const admin = require("firebase-admin");

let initialized = false;

function initFirebase() {
  if (initialized) return;
  try {
    const base64Credentials = process.env.FCM_CREDENTIALS;
    if (!base64Credentials) {
      throw new Error("Missing FCM_CREDENTIALS environment variable.");
    }
    
    const decodedJson = Buffer.from(base64Credentials, "base64").toString("utf8");
    const serviceAccount = JSON.parse(decodedJson);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    initialized = true;
    console.log("Firebase Admin SDK initialized successfully via base64 decoding.");
  } catch (err) {
    console.error("Failed to initialize Firebase Admin SDK:", err.message);
  }
}

/**
 * Sends a push notification multicast to specified device FCM tokens.
 * @param {string[]} fcmTokens - Array of recipient device FCM tokens
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} [data] - Optional metadata payload
 */
async function sendPushNotification(fcmTokens, title, body, data = {}) {
  initFirebase();
  if (!initialized || !fcmTokens || !Array.isArray(fcmTokens) || fcmTokens.length === 0) return;
  
  // Convert any non-string keys in data to strings (FCM data parameters must be string-only)
  const stringifiedData = {};
  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined && val !== null) {
      stringifiedData[key] = String(val);
    }
  }

  const payload = {
    notification: {
      title,
      body
    },
    data: stringifiedData,
    tokens: fcmTokens
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(payload);
    console.log(`[FCM] Sent: ${response.successCount} succeeded, ${response.failureCount} failed.`);
    
    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.error(`[FCM] Error for token ${fcmTokens[idx]}:`, resp.error);
        }
      });
    }
  } catch (err) {
    console.error("[FCM] Multicast exception:", err);
  }
}

module.exports = { sendPushNotification };
