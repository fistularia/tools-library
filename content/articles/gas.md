---
title: "gas"
description: "テストgas"
category: "gas"
downloadUrl:
thumbnail: "/images/test.png"
date: "2026-01-23"
tags: ["勤怠", "管理", "時間計算"]
---

## 概要

テストファイルです


```js
function getFileList() {
  // 1. フォルダIDを指定（フォルダのURL末尾にある英数文字列）
  const folderId = 'YOUR_FOLDER_ID_HERE'; 
  const folder = DriveApp.getFolderById(folderId);
  
  // 2. フォルダ内のファイルを取得（イテレータ）
  const files = folder.getFiles();
  
  // 3. ループで1つずつ取り出す
  while (files.hasNext()) {
    const file = files.next();
    const name = file.getName();
    const url = file.getUrl();
    
    console.log('ファイル名: ' + name + ' / URL: ' + url);
  }
}
```


![GASの使用イメージ](../img/gas.gif)