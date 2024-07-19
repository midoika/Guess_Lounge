# Guess_Lounge
# :flag_jp: 

# 1. 登録・退会など

## 登録 (@マルチ募集、@Guess Lounge Player 、モデレーター)
###  #⑥-✅参加登録 で登録して下さい。ただし名前は`_`と`.`が消えます。
- 登録後、 @Guess Lounge Player  が自動付与されます。
## 退会（管理者のみ）
- 戦績データごと消えます・・・
- @Guess Lounge Player が無くなります。
```
$delete hoge
```
## 登録名変更（ご本人、モデレーター）
- 前が今までの名前、後が新しい名前
```
$rename hoge hage
```
# 2. 表示系
## 名前確認
```
$tell
$tell "User ID"
$tell @midoika
```
## スコア確認
```
$mmr
$mmr hoge
```
## ステータス確認
- `-en`は英語化
- `-l`は詳細化
```
$stats -enl
$stats hoge
```
## ランキング(@Guess Lounge Player、モデレーター)
- ここに移行→ https://discord.com/channels/956620253603967006/1241363597116833792

# 3. 試合登録 (@Guess Lounge Player 、モデレーター)
## 1 on 1 Duels
- 勝ったほうが大きいとして不等号`>`, `<` を使い表現
- 不等号の大きい方が勝ち
- `nm` なら No Move
- `move` なら Moving
- `nmpz` なら NMPZ
- 最後に証拠urlを貼って、提出できる。(空白区切りで3つまで)（必須）
- ミスがあれば、`$nogame`コマンドをお使いください。メッセージ削除はデータに反映されません！
- `$duel`コマンドを使う前に、両者の GeoGuessr Profile URLが必要です。 @yohe#6047 に `$profileurl`で登録して下さい
```
$profileurl https://www.geoguessr.com/user/~
$duel midoika > hoge move
```
```
$duel hoge < midoika nm https://www.geoguessr.com/results/OTBuTnHfJoR1qSOD
```

## ノーゲームにする（@Guess Lounge Player 、モデレーター）
- 間違って結果を登録した際に無効にするコマンド
- **無効試合後にしたい試合がある場合、無効にするまで、双方ともが次の試合をしてはいけない**
  - ※無効にしたい試合と違うルールのは行える(無効がMoving なら、No Moveは引き続きできる)
```
$nogame midoika hoge move
```
