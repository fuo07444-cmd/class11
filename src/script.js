"use strict";

// 配列シャッフル
Array.prototype.shuffle = function () {
  let i = this.length;
  while (i) {
    let j = Math.floor(Math.random() * i);
    let t = this[--i];
    this[i] = this[j];
    this[j] = t;
  }
  return this;
};

let timer = NaN;
let flipTimer = NaN;
let score = 0;
let prevCard = null;
let startTime = null;

window.onload = init;

function init() {
  let table = document.getElementById("table");

  // ★ 52枚のカード（1〜13 × 4スート）
  const suits = ["spade", "heart", "diamond", "club"];
  let cards = [];

  for (let s of suits) {
    for (let n = 1; n <= 13; n++) {
      cards.push({ num: n, suit: s });
    }
  }

  cards.shuffle();

  // ★ 8行×7列 = 56マス（52枚＋空白4）
  let rows = 4;
  let cols = 13;
  let index = 0;

  for (let i = 0; i < rows; i++) {
    let tr = document.createElement("tr");

    for (let j = 0; j < cols; j++) {
      let td = document.createElement("td");

      if (index < 52) {
        td.className = "card back";
        td.cardData = cards[index];
        td.onclick = flip;
      } else {
        td.className = "card"; // 空白
      }

      tr.appendChild(td);
      index++;
    }

    table.appendChild(tr);
  }

  startTime = new Date();
  timer = setInterval(tick, 1000);
}

function tick() {
  let now = new Date();
  let elapsed = Math.floor((now - startTime) / 1000);
  document.getElementById("time").textContent = elapsed;
}

function flip(e) {
  let src = e.target;

  if (flipTimer || src.textContent !== "" || !src.cardData) {
    return;
  }

  let { num, suit } = src.cardData;

  // ★ 表示（数字＋スート記号）
  let mark = suit === "spade" ? "♠"
           : suit === "heart" ? "♥"
           : suit === "diamond" ? "♦"
           : "♣";

  src.className = `card ${suit}`;
  src.textContent = `${mark}${num}`;

  // 1枚目
  if (prevCard === null) {
    prevCard = src;
    return;
  }

  // ★ 揃う条件は「数字だけ一致」
  if (prevCard.cardData.num === num) {
    if (++score === 26) {
      clearInterval(timer);
    }
    prevCard = null;
    clearTimeout(flipTimer);
  } else {
    flipTimer = setTimeout(function () {
      src.className = "card back";
      src.textContent = "";
      prevCard.className = "card back";
      prevCard.textContent = "";
      prevCard = null;
      flipTimer = NaN;
    }, 1000);
  }
}
