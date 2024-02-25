// chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
//   if (request.greeting === 'popup_loaded') {
//     sendResponse({data: 'Message received from popup script'});
//     chrome.runtime.sendMessage({greeting: 'Background is working!'});
//   }
// });

chrome.tabs.query({}, (tabs) => {
  console.log(tabs);
  // const regex = 'https://swiperjs.com/';

  // console.log(tabs);

  // tabs.forEach(async (tab) => {
  //   if (tab.url && tab.url.match(regex)) {
  //     console.log(chrome);

  //     const created = await chrome.alarms.get('testAlarm');

  //     if (!created) {
  //       chrome.alarms.create('testAlarm', { delayInMinutes: 0.1, periodInMinutes: 0.1 });
  //       chrome.storage.local.set({ testAlarm: JSON.stringify(tab) });
  //     }
  //   }
  // });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  console.log(alarm);
  // if (alarm.name === 'testAlarm') {
  //   const tab = await chrome.storage.local.get('testAlarm');
  //   const parsed = JSON.parse(tab.testAlarm);
  //   chrome.tabs.remove(parsed.id);
  // }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  console.log(changes, areaName);
});


chrome.storage.local.clear();