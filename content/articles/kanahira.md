---
title: "ひらがなカタカナ変換"
description: "ひらがなとカタカナを相互に変換します。"
category: "gas"
downloadUrl: "https://docs.google.com/spreadsheets/d/1AgpM6bvGCAg12es7eFecZbWc6AXYTyYK7hb78MUJv1E/template/preview"
date: "2026-02-03"
tags: ["ライブラリ"]
rank: 40000
status: public
---

## 概要

名簿などのリストについて、「ひらがなからカタカナへ」「カタカナからひらがなへ」の変換を一括で行うためのロジックです。

例えば氏名の読みがなのリストについて、ひらがなとカタカナが混在しているときに、どちらかにそろえたいときに利用します。

## Class KanaConverter

```js
class KanaConverter {
  constructor() {
    // 辞書データを Map に変換して保持（検索速度を O(1) に向上）
    this.hiraToKanaMap = new Map([
      ["あ", "ア"],
      ["い", "イ"],
      ["う", "ウ"],
      ["え", "エ"],
      ["お", "オ"],
      ["か", "カ"],
      ["き", "キ"],
      ["く", "ク"],
      ["け", "ケ"],
      ["こ", "コ"],
      ["さ", "サ"],
      ["し", "シ"],
      ["す", "ス"],
      ["せ", "セ"],
      ["そ", "ソ"],
      ["た", "タ"],
      ["ち", "チ"],
      ["つ", "ツ"],
      ["て", "テ"],
      ["と", "ト"],
      ["な", "ナ"],
      ["に", "ニ"],
      ["ぬ", "ヌ"],
      ["ね", "ネ"],
      ["の", "ノ"],
      ["は", "ハ"],
      ["ひ", "ヒ"],
      ["ふ", "フ"],
      ["へ", "ヘ"],
      ["ほ", "ホ"],
      ["ま", "マ"],
      ["み", "ミ"],
      ["む", "ム"],
      ["め", "メ"],
      ["も", "モ"],
      ["や", "ヤ"],
      ["ゆ", "ユ"],
      ["よ", "ヨ"],
      ["ら", "ラ"],
      ["り", "リ"],
      ["る", "ル"],
      ["れ", "レ"],
      ["ろ", "ロ"],
      ["わ", "ワ"],
      ["ゐ", "ヰ"],
      ["ゑ", "ヱ"],
      ["を", "ヲ"],
      ["ん", "ン"],
      ["が", "ガ"],
      ["ぎ", "ギ"],
      ["ぐ", "グ"],
      ["げ", "ゲ"],
      ["ご", "ゴ"],
      ["ざ", "ザ"],
      ["じ", "ジ"],
      ["ず", "ズ"],
      ["ぜ", "ゼ"],
      ["ぞ", "ゾ"],
      ["だ", "ダ"],
      ["ぢ", "ヂ"],
      ["づ", "ヅ"],
      ["で", "デ"],
      ["ど", "ド"],
      ["ば", "バ"],
      ["び", "ビ"],
      ["ぶ", "ブ"],
      ["べ", "ベ"],
      ["ぼ", "ボ"],
      ["ゔ", "ゔ"],
      ["ぱ", "パ"],
      ["ぴ", "ピ"],
      ["ぷ", "プ"],
      ["ぺ", "ペ"],
      ["ぽ", "ポ"],
      ["ぁ", "ァ"],
      ["ぃ", "ィ"],
      ["ぅ", "ゥ"],
      ["ぇ", "ェ"],
      ["ぉ", "ォ"],
      ["っ", "ッ"],
      ["ゃ", "ャ"],
      ["ゅ", "ュ"],
      ["ょ", "ョ"],
      ["ゎ", "ヮ"],
    ]);

    // カタカナからひらがなへのMapを自動生成
    this.kanaToHiraMap = new Map(
      Array.from(this.hiraToKanaMap, ([h, k]) => [k, h]),
    );
  }

  /**
   * ひらがな文字列をカタカナに変換
   * @param {string} words
   */
  toKatakana(words) {
    const result = words
      .split("")
      .map((char) => this.hiraToKanaMap.get(char) || char)
      .join("");

    console.log(`🌾 Converted "${words}" to "${result}".`);
    return result;
  }

  /**
   * カタカナ文字列をひらがなに変換
   * @param {string} words
   */
  toHiragana(words) {
    const result = words
      .split("")
      .map((char) => this.kanaToHiraMap.get(char) || char)
      .join("");

    console.log(`🌾 Converted "${words}" to "${result}".`);
    return result;
  }
}
```

## 使用方法

1. 上のClass KanaConverterのコードをプロジェクトに追加する。
1. 以下のように呼び出す。

```js
// --- 使い方 ---
const converter = new KanaConverter();

const hiraText = "あいうえお、がぎぐげご";
const kanaText = converter.toKatakana(hiraText); // アイウエオ、ガギグゲゴ

const backToHira = converter.toHiragana(kanaText); // あいうえお、がぎぐげご
```
