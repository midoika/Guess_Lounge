// ==UserScript==
// @name         GeoGuessr Game URL Copier
// @namespace    https://www.geoguessr.com/
// @version      1.2.2
// @description  GeoGuessr Party Lobby から Live Challenge / Duels / Team Duels / Bullseye のゲームURLをコピーします。SPA遷移対応。
// @match        https://www.geoguessr.com/*
// @grant        GM_setClipboard
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';

  const BUTTON_ID = "gg-game-url-copy-button";
  const MESSAGE_ID = "gg-game-url-copy-message";

  function isLobbyPage() {
    return /^\/(?:[^/]+\/)?party\/lobby\/[^/]+/.test(location.pathname);
  }

  function extractPartyInfo(html) {
    if (!html) return null;

    const lobbyMatch =
      html.match(/"lobbyId"\s*:\s*"([^"]+)"/) ||
      html.match(/&quot;lobbyId&quot;\s*:\s*&quot;([^&]+)&quot;/);

    const typeMatch =
      html.match(/"gameType"\s*:\s*"([^"]+)"/) ||
      html.match(/&quot;gameType&quot;\s*:\s*&quot;([^&]+)&quot;/);

    if (!lobbyMatch) return null;

    return {
      lobbyId: lobbyMatch[1],
      gameType: typeMatch ? typeMatch[1] : null
    };
  }

  function makeGameUrl(gameType, lobbyId) {
    switch (gameType) {
      case "LiveChallenge":
        return `https://www.geoguessr.com/live-challenge/${lobbyId}`;

      case "Duels":
      case "TeamDuels":
        return `https://www.geoguessr.com/duels/${lobbyId}/summary`;

      case "Bullseye":
        return `https://www.geoguessr.com/bullseye/${lobbyId}`;

      default:
        return null;
    }
  }

  async function getPartyInfo() {
    try {
      const response = await fetch(location.href, {
        method: "GET",
        credentials: "include",
        cache: "no-store"
      });

      if (response.ok) {
        const html = await response.text();
        const info = extractPartyInfo(html);
        if (info?.lobbyId) return info;
      }
    } catch (e) {
      console.debug("[GeoGuessr Game URL Copier] fetch failed:", e);
    }

    const domInfo = extractPartyInfo(document.documentElement.innerHTML);
    if (domInfo?.lobbyId) return domInfo;

    for (const script of document.scripts) {
      const info = extractPartyInfo(script.textContent || "");
      if (info?.lobbyId) return info;
    }

    return null;
  }

  function maskId(id) {
    if (!id) return "";

    if (id.includes("-")) {
      const firstPart = id.split("-")[0];
      return firstPart + id.slice(firstPart.length).replace(/[0-9a-zA-Z]/g, "*");
    }

    if (id.length > 8) {
      return id.slice(0, 8) + "*".repeat(id.length - 8);
    }

    return id;
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
    button.textContent = "Copy Game URL";

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
        const info = await getPartyInfo();

        if (!info?.lobbyId) {
          showMessage("lobbyId が見つかりませんでした", false);
          return;
        }

        if (!info.gameType) {
          showMessage("gameType が見つかりませんでした", false);
          return;
        }

        const gameUrl = makeGameUrl(info.gameType, info.lobbyId);

        if (!gameUrl) {
          showMessage(`未対応のモードです: ${info.gameType}`, false);
          return;
        }

        if (typeof GM_setClipboard === "function") {
          GM_setClipboard(gameUrl, "text");
        } else {
          await navigator.clipboard.writeText(gameUrl);
        }

        showMessage(
          `コピーしました (${info.gameType}): ${maskId(info.lobbyId)}`,
          true
        );

      } catch (e) {
        console.error("[GeoGuessr Game URL Copier]", e);
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
