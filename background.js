console.log("working");
let dataQueue = [];
const MAX_BATCH_SIZE = 10;
const MAX_WAIT_TIME = 5000; // 5 seconds
function genralFetch(path, data) {
  fetch(
    `http://localhost:3000/api/trpc/${path}?input={"json":${encodeURIComponent(
      JSON.stringify(data)
    )}}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then(async (response) => {
      console.log("Data sent to server");
    })

    .catch((error) => {
      console.error("Error sending data to server:", error);
    });
}
let key;
chrome.storage.local.get(["savedKey"], function (result) {
  if (result.savedKey) {
    console.log("Retrieved key:", result.savedKey);
    key = result.savedKey;
  } else {
    console.log("No saved key found.");
  }
});

// my lasy ass can't build a new server but end up spending 2-3 hr on how to send data in trpc
// for network req
chrome.webRequest.onCompleted.addListener(
  (details) => {
    // console.log(details.type);
    if (details.type === "image") {
      dataQueue.push({
        url: details.url,
        timeStamp: details.timeStamp,
        initiator: details.initiator,
        type: details.type,
        key,
      });

      if (dataQueue.length >= MAX_BATCH_SIZE) {
        genralFetch("queue.networkReq", dataQueue);
        // Clear queue
        dataQueue = [];
      }
    }
  },
  { urls: ["<all_urls>"] }
);

// for tab time spent
let startTime;
let currentTabId;

// Listen for the tab switch event
chrome.tabs.onActivated.addListener(function (activeInfo) {
  if (startTime && currentTabId) {
    var currentTime = new Date().getTime();
    var timeSpent = currentTime - startTime;

    chrome.tabs.get(currentTabId, function (tab) {
      genralFetch("queue.timeSpend", {
        tab: tab.url,
        time: timeSpent,
        key,
      });
    });
  }

  // Set the start time for the new tab
  startTime = new Date().getTime();
  currentTabId = activeInfo.tabId;
});
