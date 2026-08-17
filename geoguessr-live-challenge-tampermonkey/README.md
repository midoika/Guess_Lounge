# GeoGuessr Live Challenge URL Copier

Chrome / Firefox 共通の **Tampermonkey用ユーザースクリプト** です。

GeoGuessr の Party Lobby ページを開くと、右上に `Copy Live Challenge URL` ボタンを表示します。

これをクリックしてURLを保存してください。

対象URL:

```text
https://www.geoguessr.com/party/lobby/*
https://www.geoguessr.com/*/party/lobby/*
```
> [!WARNING]
> ボタンは必ず試合が終了する前に押してください。最終ラップが終わるとURLが取得できなります。
> 
> **必ず試合が始まった時点でボタンを押すこと。**

失敗例
![試合終了後にボタンを押しURLが保存できなかった例](https://github.com/midoika/Guess_Lounge/blob/main/geoguessr-live-challenge-tampermonkey/missing_url.png)


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
- [公式HP](https://www.tampermonkey.net/)
  - [Google Chrome版](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=ja&pli=1)
    ![Tampermonkeyインストール方法](https://github.com/midoika/Guess_Lounge/blob/main/geoguessr-live-challenge-tampermonkey/how_to_install_Tampermonkey.png)
  - [Firefox版](https://addons.mozilla.org/ja/firefox/addon/tampermonkey/)
  - [Microsoft Edge版](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
  
2. [geoguessr-live-challenge-compact.user.js](https://github.com/midoika/Guess_Lounge/blob/main/geoguessr-live-challenge-tampermonkey/geoguessr-live-challenge-compact.user.js) に移動しコードをコピーします。
![設定ファイルのコピー方法](https://github.com/midoika/Guess_Lounge/blob/main/geoguessr-live-challenge-tampermonkey/how_to_copy_js.png)
3. Tampermonkeyアイコン → `新規スクリプトを追加` を開きます。
![Tampermonkey開き方](https://github.com/midoika/Guess_Lounge/blob/main/geoguessr-live-challenge-tampermonkey/how_to_open_Tampermonkey.png)
4. 最初から入っているコードを全部削除します。
5. 2でコピーしたコードを、Tampermonkeyのエディタへ貼り付けます。
6. `Ctrl + S` で保存します。
![Tampermonkeyに保存する方法](https://github.com/midoika/Guess_Lounge/blob/main/geoguessr-live-challenge-tampermonkey/how_to_save_code_on_Tampermonkey.png)
7. GeoGuessr の Party Lobby ページを開き直します。

一度保存すれば、Chrome / Firefox を再起動しても再設定は不要です。

## 現在のUI設定

- 文字サイズ: `10px`
- ボタン内余白: `6px 9px`
- 上端との隙間: `7px`
- 右端との隙間: `7px`
