---
title: "スプレッドシートに一括書き込み"
description: "フォルダ内のすべてのスプレッドシートに同じ内容を書き込みます"
category: "gas"
downloadUrl: "https://docs.google.com/spreadsheets/d/1AgpM6bvGCAg12es7eFecZbWc6AXYTyYK7hb78MUJv1E/template/preview"
date: "2026-02-04"
tags: ["ライブラリ"]
---

## 概要
フォルダ内のスプレッドシートの同じシート、同じセルに一括で書き込む。


## Class BulkSpreadsheetWriter

```js
/**
 * フォルダ内の全スプレッドシートに対して一括書き込みを行うクラス
 */
class BulkSpreadsheetWriter {
  /**
   * @param {string} folderId - 処理対象のフォルダID
   */
  constructor(folderId) {
    if (!folderId) throw new Error('folderId is required');
    this.folderId = folderId;
  }

  /**
   * 指定したシートとセルに値を書き込む
   * @param {string} sheetName - 対象シート名
   * @param {string} cellAddress - セルアドレス (例: "A1")
   * @param {any} value - 書き込む値
   */
  writeToAll(sheetName, cellAddress, value) {
    const spreadsheetIds = this._getSpreadsheetIds();

    spreadsheetIds.forEach(id => {
      this._writeValue(id, sheetName, cellAddress, value);
    });
  }

  /**
   * フォルダ内のスプレッドシートID一覧を取得
   * @private
   */
  _getSpreadsheetIds() {
    const folder = DriveApp.getFolderById(this.folderId);
    const files = folder.getFilesByType(MimeType.GOOGLE_SHEETS);
    const ids = [];
    
    while (files.hasNext()) {
      ids.push(files.next().getId());
    }
    return ids;
  }

  /**
   * 単一のスプレッドシートへ書き込み
   * @private
   */
  _writeValue(id, sheetName, cellAddress, value) {
    try {
      const ss = SpreadsheetApp.openById(id);
      const sheet = ss.getSheetByName(sheetName);

      if (!sheet) {
        console.warn(`Skip: "${ss.getName()}" (ID:${id}) にシート "${sheetName}" が見つかりません。`);
        return;
      }

      sheet.getRange(cellAddress).setValue(value);
      console.log(`Success: "${ss.getName()}" の ${cellAddress} を更新しました。`);
    } catch (e) {
      console.error(`Error: ID[${id}] の処理中に例外が発生しました: ${e.message}`);
    }
  }
}

```

## 呼び出し用コード
```js

/**
 * スプレッドシートの値を読み取り、一括書き込みを実行する
 */
function runBulkUpdate() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  const folderUrl = sheet.getRange('B1').getValue();
  const folderId = extractFolderId(folderUrl);
  
  if (!folderId) {
    console.error('フォルダURLが正しくありません。');
    return;
  }

  // クラスのインスタンス化と実行
  const writer = new BulkSpreadsheetWriter(folderId);
  
  writer.writeToAll(
    sheet.getRange('B2').getValue(), // sheetName
    sheet.getRange('B3').getValue(), // cellAddress
    sheet.getRange('B4').getValue()  // value
  );
  
  console.log('すべての処理が完了しました。');
}

/**
 * フォルダURLからIDを抽出するユーティリティ関数
 */
function extractFolderId(url) {
  const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

```

