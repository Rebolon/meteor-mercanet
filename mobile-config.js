App.info({
  id: 'com.ddv.benjamin.richard',
  name: 'MeteorJS',
  description: 'mercanet proof of concept over meteorjs',
  author: 'Rebolon and Peaks company',
  email: 'richard.tribes@gmail.com',
  website: 'http://peaks.fr'
});

App.accessRule('*');

// Set up resources such as icons and launch screens.
App.icons({
  'android_ldpi': 'public/icons/icon-60.png',
});

App.launchScreens({
  'android_ldpi_portrait': 'public/splash/Default~android.png',
  // ... more screen sizes and platforms ...
});

// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'default');

// Pass preferences for a particular PhoneGap/Cordova plugin

