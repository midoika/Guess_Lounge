// ==UserScript==
// @name         GeoGuessr Live Challenge URL Copier Compact
// @namespace    https://www.geoguessr.com/
// @version      1.1.0
// @description  GeoGuessr Party Lobby から live-challenge URL をコピーします。SPA遷移対応。
// @match        https://www.geoguessr.com/*
// @grant        GM_setClipboard
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';

  const BUTTON_ID = "gg-live-challenge-copy-button";
  const MESSAGE_ID = "gg-live-challenge-copy-message";

  function isLobbyPage() {
    return /^\/(?:[^/]+\/)?party\/lobby\/[^/]+/.test(location.pathname);
  }

  function extractLobbyId(html) {
    if (!html) return null;

    let match = html.match(/"lobbyId"\s*:\s*"([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})"/);
    if (match) return match[1];

    match = html.match(/&quot;lobbyId&quot;\s*:\s*&quot;([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})&quot;/);
    if (match) return match[1];

    return null;
  }

  async function getLobbyId() {
    try {
      const response = await fetch(location.href, {
        method: "GET",
        credentials: "include",
        cache: "no-store"
      });

      if (response.ok) {
        const html = await response.text();
        const id = extractLobbyId(html);
        if (id) return id;
      }
    } catch (e) {
      console.debug("[GeoGuessr Live Challenge URL Copier] fetch failed:", e);
    }

    const domId = extractLobbyId(document.documentElement.innerHTML);
    if (domId) return domId;

    for (const script of document.scripts) {
      const id = extractLobbyId(script.textContent || "");
      if (id) return id;
    }

    return null;
  }

  function showMessage(text, ok = true) {
    let msg = document.getElementById(MESSAGE_ID);

    if (!msg) {
      msg = document.createElement("div");
      msg.id = MESSAGE_ID;

      Object.assign(msg.style, {
        position: "fixed",
        top: "40px",
        right: "7px",
        zIndex: "2147483647",
        padding: "6px 9px",
        borderRadius: "6px",
        fontSize: "10px",
        lineHeight: "1.2",
        fontFamily: "Arial, sans-serif",
        boxShadow: "0 2px 8px rgba(0,0,0,.3)",
        maxWidth: "420px",
        wordBreak: "break-all"
      });

      document.documentElement.appendChild(msg);
    }

    msg.textContent = text;
    msg.style.background = ok ? "#1f7a3f" : "#9b2c2c";
    msg.style.color = "#fff";
    msg.style.display = "block";

    clearTimeout(showMessage.timer);
    showMessage.timer = setTimeout(() => {
      msg.style.display = "none";
    }, 3500);
  }

  function createButton() {
    if (!isLobbyPage()) return;
    if (document.getElementById(BUTTON_ID)) return;

    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.type = "button";
    button.textContent = "Copy Live Challenge URL";

    Object.assign(button.style, {
      position: "fixed",
      top: "7px",
      right: "7px",
      zIndex: "2147483647",
      padding: "6px 9px",
      border: "0",
      borderRadius: "6px",
      background: "#ffffff",
      color: "#111111",
      fontSize: "10px",
      lineHeight: "1.2",
      fontWeight: "700",
      fontFamily: "Arial, sans-serif",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,.35)"
    });

    button.addEventListener("click", async () => {
      const originalText = button.textContent;
      button.disabled = true;
      button.textContent = "Searching...";

      try {
        const lobbyId = await getLobbyId();

        if (!lobbyId) {
          showMessage("lobbyId が見つかりませんでした", false);
          return;
        }

        const liveChallengeUrl =
          `https://www.geoguessr.com/live-challenge/${lobbyId}`;

        if (typeof GM_setClipboard === "function") {
          GM_setClipboard(liveChallengeUrl, "text");
        } else {
          await navigator.clipboard.writeText(liveChallengeUrl);
        }

        const firstPart = lobbyId.split("-")[0];
        const masked =
          firstPart + lobbyId.slice(firstPart.length).replace(/[0-9a-fA-F]/g, "*");

        showMessage(`コピーしました: ${masked}`, true);

      } catch (e) {
        console.error("[GeoGuessr Live Challenge URL Copier]", e);
        showMessage("URL の取得中にエラーが発生しました", false);
      } finally {
        button.disabled = false;
        button.textContent = originalText;
      }
    });

    document.documentElement.appendChild(button);
  }

  function removeButton() {
    document.getElementById(BUTTON_ID)?.remove();
    document.getElementById(MESSAGE_ID)?.remove();
  }

  function syncWithCurrentUrl() {
    if (isLobbyPage()) {
      createButton();
    } else {
      removeButton();
    }
  }

  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    const result = originalPushState.apply(this, args);
    window.dispatchEvent(new Event("gg-locationchange"));
    return result;
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function (...args) {
    const result = originalReplaceState.apply(this, args);
    window.dispatchEvent(new Event("gg-locationchange"));
    return result;
  };

  window.addEventListener("popstate", () => {
    window.dispatchEvent(new Event("gg-locationchange"));
  });

  window.addEventListener("gg-locationchange", () => {
    setTimeout(syncWithCurrentUrl, 0);
  });

  const observer = new MutationObserver(syncWithCurrentUrl);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  syncWithCurrentUrl();
})();
