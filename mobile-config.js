app.info({
  id: 'com.ddv.benjamin.richard',
  name: 'MeteorJS',
  description: 'mercanet proof of concept over meteorjs',
  author: 'Rebolon and Peaks company',
  email: 'richard.tribes@gmail.com',
  website: 'http://peaks.fr'
});

// Set up resources such as icons and launch screens.
App.icons({
  'android_ldpi': 'icons/icon-60.gif',
});

App.launchScreens({
  'android': 'splash/Default~android.jpg',
  // ... more screen sizes and platforms ...
});

// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'default');
App.setPreference('Orientation', 'all', 'android');

// Pass preferences for a particular PhoneGap/Cordova plugin

