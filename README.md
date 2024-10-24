# Guess_Lounge
- シーズン0のリザルト[https://midoika.github.io/Guess_Lounge/archive/season_0/docs/html/index.html](https://midoika.github.io/Guess_Lounge/archive/season_0/docs/html/index.html)
- プロフィールURLの登録方法 [https://midoika.github.io/Guess_Lounge/how_to_register_your_profile_url/how_to_register_your_profile_url](https://midoika.github.io/Guess_Lounge/how_to_register_your_profile_url/how_to_register_your_profile_url)

# 🇯🇵
## 登録 (@マルチ募集、@Guess Lounge Player 、モデレーター)
###  #⑥-✅参加登録 で登録して下さい。ただし名前は`_`と`.`が消えます。
- 登録後、 @Guess Lounge Player  が自動付与されます。
- DMでプロフィールURLの登録案内が届けばokです。
## 退会（管理者のみ）
- @midoika に連絡下さい。
- 戦績データごと消えます・・・
- @Guess Lounge Player が無くなります。
## 登録名変更（ご本人、モデレーター）
- @midoika に連絡下さい。
# 2. 表示系
## `/tell`(名前確認)
```
/tell
/tell "User ID"
/tell @midoika
```
## `/mmr`(スコア確認)
```
/mmr
/mmr hoge
```
## `/stats`(ステータス確認)
- `en`は英語化
- `l`は詳細化
```
/stats enl
/stats hoge
```

# 3. 試合登録 (@Guess Lounge Player 、モデレーター)
## `/duelurl` (1 on 1 Duels)
- 試合結果のurlを貼り付けると自動に勝敗判定してくれます。
  - アプリの方はPC勢の方に、かわりに入力してもらって下さい。
- ミスがあれば、`/nogame`コマンドをお使いください。メッセージ削除はデータに反映されません！
- **`/duelurl`コマンドを使う前に、両者の GeoGuessr Profile URLが必要** です。 @yohe#6047 に `$profileurl`で登録して下さい。
https://midoika.github.io/Guess_Lounge/how_to_register_your_profile_url
```
$profileurl https://www.geoguessr.com/user/~
/duelurl https://www.geoguessr.com/results/OTBuTnHfJoR1qSOD
```

## `/nogame`(ノーゲームにする)
- 間違って結果を登録した際に無効にするコマンド
- **無効試合後にしたい試合がある場合、無効にするまで、双方ともが次の試合をしてはいけません。**
  - ※無効にしたい試合と違うルールのは行えます。(無効がMoving なら、No Moveは引き続きできる)
- **types**に `move`,`nm`,`nmpz`のどれかを入れて下さい。
```
/nogame midoika hoge move
```

# 🇬🇧
# 1. Registration and Withdrawal
## Registration ( @マルチ募集, @Guess Lounge Player , moderator)
### You can register it by   #⑥-✅参加登録  But your name will be removed `_` or `.` 
- And you get @Guess Lounge Player role
- Name is half-width alphanumeric characters only.

## Withdrawal (admin only)
- Send DM to @midoika 
- Your match records are also erased...
- You loss @Guess Lounge Player role
## Name Change (Self-request, moderator)
- Send DM to @midoika 

# 2. Display
## `/tell`Name Check
```
/tell
/tell "User ID"
/tell @midoika
```
## `/mmr`Score Check
```
/mmr
/mmr hoge
```
## `/stats`Status Check
- `en` is English version
- `l` is longer version
```
/stats enl
/stats hoge
```
# 3. Match Registration ( @Guess Lounge Player, moderator)
## `/duelurl` 
- Input game breakdown URLs and judge win & loss automatically.
- Both of GeoGuessr profile URL are required.
https://midoika.github.io/Guess_Lounge/how_to_register_your_profile_url

```
$profileurl https://www.geoguessr.com/user/~
/duelurl https://www.geoguessr.com/results/aaa
```

## `/nogame`Make the last game a no-game. 
- Use this command to invalidate a result when registered incorrectly.
- **After declaring a match invalid, neither side may proceed to the next match until it's resolved.**
  - *However, matches under different rules can proceed (e.g., if you want to make a Moving match no-game, you can still play No Move match).*
- **types**is `move`,`nm`,or `nmpz`.
```
/nogame midoika hoge move
```
