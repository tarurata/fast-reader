document.getElementById('initialize').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: "initialize"});
  });
});

const wpmSlider = document.getElementById('wpm-slider');
const wpmValue = document.getElementById('wpm-value');

function wpmToDelay(wpm) {
  return Math.round(60000 / wpm);
}

wpmSlider.addEventListener('input', () => {
  const wpm = wpmSlider.value;
  wpmValue.textContent = `${wpm} WPM`;
  
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: "updateDelay", delay: wpmToDelay(wpm)});
  });
});

document.getElementById('start').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: "start", delay: wpmToDelay(wpmSlider.value)});
  });
});

document.getElementById('stop').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: "stop"});
  });
});