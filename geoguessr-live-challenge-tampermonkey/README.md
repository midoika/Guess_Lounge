# GeoGuessr Live Challenge URL Copier

Chrome / Firefox 共通の **Tampermonkey用ユーザースクリプト** です。

GeoGuessr の Party Lobby ページを開くと、右上に `Copy Live Challenge URL` ボタンを表示します。

対象URL:

```text
https://www.geoguessr.com/party/lobby/*
https://www.geoguessr.com/*/party/lobby/*
```

## 動作

ボタンを押すと、ページ内の `lobbyId` を取得して次の形式でコピーします。

```text
https://www.geoguessr.com/live-challenge/8774df8b-07c9-4490-ae7b-c076e2a4b7b6
```

画面表示は次のようにマスクされます。

```text
コピーしました: 8774df8b-****-****-****-************
```

コピーされるURL自体はフルのままです。

## Chrome / Firefox 共通の設定方法

1. ブラウザに **Tampermonkey** をインストールします。
2. このZIPを展開します。
3. Tampermonkeyアイコン → `新規スクリプトを追加` を開きます。
4. 最初から入っているコードを全部削除します。
5. `geoguessr-live-challenge-compact.user.js` をテキストエディタで開きます。
6. 中身をすべてコピーして、Tampermonkeyのエディタへ貼り付けます。
7. `Ctrl + S` で保存します。
8. GeoGuessr の Party Lobby ページを開き直します。

一度保存すれば、Chrome / Firefox を再起動しても再設定は不要です。

## 現在のUI設定

- 文字サイズ: `10px`
- ボタン内余白: `6px 9px`
- 上端との隙間: `7px`
- 右端との隙間: `7px`
