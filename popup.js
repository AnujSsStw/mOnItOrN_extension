document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("myForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var keyInput = document.getElementById("keyInput");
    var key = keyInput.value.trim();

    if (key !== "") {
      chrome.storage.local.set({ savedKey: key }, function () {
        console.log("Key saved:", key);
      });
    }
  });
});
