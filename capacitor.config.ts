import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId:    'com.volunteerhub.app',
  appName:  'VolunteerHub',
  webDir:   'out',    // Next.js static export directory
  bundledWebRuntime: false,

  server: {
    // For development only — point to Next.js dev server
    // url: 'http://192.168.1.X:3000',
    // cleartext: true,
  },

  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    LocalNotifications: {
      smallIcon:   'ic_stat_icon_config_sample',
      iconColor:   '#2563EB',
      sound:       'beep.wav',
    },
    SplashScreen: {
      launchShowDuration:     2000,
      launchAutoHide:         true,
      backgroundColor:        '#0F172A',
      androidSplashResourceName: 'splash',
      androidScaleType:       'CENTER_CROP',
      showSpinner:            false,
      splashFullScreen:       true,
      splashImmersive:        true,
    },
    StatusBar: {
      style:           'dark',
      backgroundColor: '#0F172A',
    },
  },

  android: {
    buildOptions: {
      keystorePath:    '~/keystores/volunteerhub.jks',
      keystoreAlias:   'volunteerhub',
    },
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },

  ios: {
    contentInset:      'automatic',
    limitsNavigationsToAppBoundDomains: true,
  },
}

export default config
