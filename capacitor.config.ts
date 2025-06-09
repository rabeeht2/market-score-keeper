
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.c79dda6e769a49afbb0cc44079de774a',
  appName: 'P&L Tracker',
  webDir: 'dist',
  server: {
    url: 'https://c79dda6e-769a-49af-bb0c-c44079de774a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
