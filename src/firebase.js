import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, logEvent, setUserProperties } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCUqEZklvL_n9rwZ2v78vxXWVv6z_2ALUE",
  authDomain: "matri-site-cf115.firebaseapp.com",
  projectId: "matri-site-cf115",
  storageBucket: "matri-site-cf115.appspot.com",
  messagingSenderId: "231063048901",
  appId: "1:231063048901:web:968969b3f06dd22f1096ac",
  measurementId: "G-351NC8Z306",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

const logAnalyticsEvent = (eventName, eventParams = {}) => {
  logEvent(analytics, eventName, eventParams);
};

const setAnalyticsUserProperties = (properties) => {
  setUserProperties(analytics, properties);
};

const getAnalyticsData = async (metricName, options = {}) => {
  // This is a placeholder function. In a real-world scenario,
  // you would typically call a backend API here that has access
  // to your Firebase Analytics data.
  return new Promise((resolve) => {
    setTimeout(() => {
      switch (metricName) {
        case "activeUsers":
          resolve(Math.floor(Math.random() * 1000));
        case "userEngagement":
          resolve(
            Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
          );
        case "eventCounts":
          resolve(
            Array.from({ length: 6 }, () => Math.floor(Math.random() * 1000))
          );
        default:
          resolve(null);
      }
    }, 1000);
  });
};

export {
  db,
  analytics,
  logAnalyticsEvent,
  setAnalyticsUserProperties,
  getAnalyticsData,
};
