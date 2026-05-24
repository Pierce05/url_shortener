const shortenForm = document.getElementById("shorten-form");
const messageBox = document.getElementById("message");
const resultBox = document.getElementById("result");
const resultLink = document.getElementById("result-link");
const resultQrImage = document.getElementById("result-qr-image");
const resultQrDownload = document.getElementById("result-qr-download");
const copyButton = document.getElementById("copy-button");
const refreshButton = document.getElementById("refresh-button");
const urlList = document.getElementById("url-list");
const template = document.getElementById("url-item-template");

let latestShortUrl = "";
let latestQrCode = "";
let latestQrFilename = "";

function setMessage(text, tone = "") {
  messageBox.textContent = text;
  messageBox.className = `message ${tone}`.trim();
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Never";
  }

  return new Date(dateValue).toLocaleString();
}

async function copyText(value) {
  await navigator.clipboard.writeText(value);
}

async function loadUrls() {
  urlList.innerHTML = "<p class=\"empty-state\">Loading links...</p>";

  try {
    const response = await fetch("/api/urls");
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message || "Could not load URLs.");
    }

    if (payload.count === 0) {
      urlList.innerHTML = "<p class=\"empty-state\">No links yet. Create your first short URL on the left.</p>";
      return;
    }

    urlList.innerHTML = "";

    payload.data.forEach((urlEntry) => {
      const fragment = template.content.cloneNode(true);
      const item = fragment.querySelector(".url-item");

      fragment.querySelector(".short-code").textContent = `/${urlEntry.shortCode}`;
      const shortLinkNode = fragment.querySelector(".short-link");
      shortLinkNode.href = urlEntry.shortUrl;
      shortLinkNode.textContent = urlEntry.shortUrl;
      fragment.querySelector(".original-link").textContent = urlEntry.originalUrl;
      const qrThumb = fragment.querySelector(".qr-thumb");
      qrThumb.src = urlEntry.qrCodeDataUrl;
      const qrDownloadLink = fragment.querySelector(".qr-download-link");
      qrDownloadLink.href = urlEntry.qrCodeDataUrl;
      qrDownloadLink.download = urlEntry.qrCodeFilename;
      fragment.querySelector(".clicks").textContent = String(urlEntry.clicks);
      fragment.querySelector(".created-at").textContent = formatDate(urlEntry.createdAt);
      fragment.querySelector(".last-visited").textContent = formatDate(urlEntry.lastVisitedAt);

      fragment.querySelector(".copy-action").addEventListener("click", async () => {
        await copyText(urlEntry.shortUrl);
        setMessage("Short URL copied to your clipboard.", "success");
      });

      fragment.querySelector(".edit-action").addEventListener("click", async () => {
        const nextUrl = window.prompt("Enter the new destination URL:", urlEntry.originalUrl);

        if (!nextUrl || nextUrl === urlEntry.originalUrl) {
          return;
        }

        try {
          const response = await fetch(`/api/urls/${urlEntry.shortCode}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ originalUrl: nextUrl }),
          });

          const payload = await response.json();

          if (!response.ok) {
            throw new Error(payload.message || "Could not update URL.");
          }

          setMessage("Destination URL updated successfully.", "success");
          await loadUrls();
        } catch (error) {
          setMessage(error.message, "error");
        }
      });

      fragment.querySelector(".delete-action").addEventListener("click", async () => {
        const confirmed = window.confirm(`Delete /${urlEntry.shortCode}?`);
        if (!confirmed) {
          return;
        }

        try {
          const response = await fetch(`/api/urls/${urlEntry.shortCode}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            const payload = await response.json();
            throw new Error(payload.message || "Could not delete URL.");
          }

          setMessage("Short URL deleted.", "success");
          await loadUrls();
        } catch (error) {
          setMessage(error.message, "error");
        }
      });

      urlList.appendChild(item);
    });
  } catch (error) {
    urlList.innerHTML = "<p class=\"empty-state\">Could not load links right now.</p>";
    setMessage(error.message, "error");
  }
}

shortenForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage("Creating short URL...");

  const formData = new FormData(shortenForm);
  const body = {
    originalUrl: formData.get("originalUrl"),
    customCode: formData.get("customCode"),
  };

  try {
    const response = await fetch("/api/urls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const payload = await response.json();

    if (!response.ok) {
      const issue = payload.issues?.[0]?.message;
      throw new Error(issue || payload.message || "Could not create short URL.");
    }

    latestShortUrl = payload.data.shortUrl;
    latestQrCode = payload.data.qrCodeDataUrl;
    latestQrFilename = payload.data.qrCodeFilename;
    resultLink.href = latestShortUrl;
    resultLink.textContent = latestShortUrl;
    resultQrImage.src = latestQrCode;
    resultQrDownload.href = latestQrCode;
    resultQrDownload.download = latestQrFilename;
    resultBox.classList.remove("hidden");
    shortenForm.reset();
    setMessage(payload.message, "success");
    await loadUrls();
  } catch (error) {
    resultBox.classList.add("hidden");
    setMessage(error.message, "error");
  }
});

copyButton.addEventListener("click", async () => {
  if (!latestShortUrl) {
    return;
  }

  try {
    await copyText(latestShortUrl);
    setMessage("Short URL copied to your clipboard.", "success");
  } catch (error) {
    setMessage("Copy failed. You can still copy it manually.", "error");
  }
});

refreshButton.addEventListener("click", loadUrls);

loadUrls();
