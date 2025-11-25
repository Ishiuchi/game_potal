# ゲーム追加テンプレート

新しいゲームを追加する際の手順とテンプレートファイルです。

## 📁 テンプレートファイル

- `game-template.html` - HTMLテンプレート
- `game-template.css` - CSSテンプレート
- `game-template.js` - JavaScriptテンプレート
- `i18n-template.txt` - 多言語対応の翻訳データテンプレート

## 🚀 新しいゲームの追加手順

### 1. ファイルのコピーと名前変更

テンプレートファイルを `src/` フォルダにコピーし、ゲーム名に変更します。

例：五目並べ（gomoku）を追加する場合
```
templates/game-template.html → src/gomoku.html
templates/game-template.css → src/gomoku.css
templates/game-template.js → src/gomoku.js
```

### 2. ファイル内の置換

すべてのファイルで `GAMENAME` を実際のゲーム名に置き換えます。

#### 置換例（五目並べの場合）
- `GAMENAME` → `gomoku`
- `ゲーム名` → `五目並べ`

#### HTMLファイル (`gomoku.html`)
```html
<!-- 変更前 -->
<title data-i18n="GAMENAME.pageTitle">ゲーム名 - ゲームサイト</title>
<link rel="stylesheet" href="GAMENAME.css">

<!-- 変更後 -->
<title data-i18n="gomoku.pageTitle">五目並べ - ゲームサイト</title>
<link rel="stylesheet" href="gomoku.css">
```

#### CSSファイル (`gomoku.css`)
```css
/* 変更前 */
/* GAMENAME Game Specific Styles */

/* 変更後 */
/* Gomoku Game Specific Styles */
```

#### JavaScriptファイル (`gomoku.js`)
```javascript
// 変更前
/**
 * GAMENAME ゲーム実装
 */

// 変更後
/**
 * 五目並べ ゲーム実装
 */
```

### 3. ゲームロジックの実装

`gomoku.js` ファイルで以下の関数を実装します：

#### 必須実装項目
- `initializeBoard()` - ボードの初期化
- `isValidMove(row, col)` - 有効な手かチェック
- `checkWinner()` - 勝者判定
- `getCellContent(value)` - セルの表示内容

#### オプション実装項目
- `getGoodMove()` - CPU レベル2の戦略
- `getBestMove()` - CPU レベル3の戦略（ミニマックス等）

### 4. ボードサイズの調整

ゲームに応じてボードサイズを変更します。

#### JavaScriptで変更
```javascript
const BOARD_SIZE = 15; // 五目並べは15×15
```

#### CSSで変更
```css
#gameBoard {
    grid-template-columns: repeat(15, 40px);
    grid-template-rows: repeat(15, 40px);
}

.cell {
    width: 40px;
    height: 40px;
}
```

### 5. 多言語対応の追加

`i18n.js` ファイルに翻訳データを追加します。

#### 日本語（ja）
```javascript
gomoku: {
    pageTitle: '五目並べ - ゲームサイト',
    title: '五目並べ',
    selectMode: 'ゲームモードを選択',
    pvp: 'プレイヤー vs プレイヤー',
    pvc: 'プレイヤー vs CPU',
    selectLevel: 'CPUレベルを選択',
    level1: 'レベル1 (ランダム)',
    level2: 'レベル2 (防御重視)',
    level3: 'レベル3 (攻守両立)',
    rule1: '目的：縦・横・斜めのいずれかに5つ並べることを目指します',
    rule2: '配置：交互に石を置きます（黒が先手）',
    rule3: '勝利：先に5つ並べた方が勝ちです',
    rule4: '禁じ手：三三、四四、長連は黒のみ禁止です',
    rule5: '引き分け：盤面が埋まっても勝者がいない場合',
    player1: '黒:',
    player2: '白:',
    backToMode: 'モード選択に戻る'
}
```

#### 英語（en）、中国語（zh）、ヒンディー語（hi）、スペイン語（es）、フランス語（fr）
`i18n-template.txt` を参考に、各言語の翻訳を追加してください。

### 6. index.htmlへの追加

ホームページのゲーム一覧にカードを追加します。

```html
<div class="game-card gomoku-bg">
    <div class="game-icon">🎯</div>
    <h2 data-i18n="gomoku.title">五目並べ</h2>
    <p data-i18n="gomoku.description">5つ並べて勝利を目指そう</p>
    <a href="gomoku.html" class="play-button" data-i18n="common.playNow">今すぐプレイ</a>
</div>
```

### 7. styles.cssへの背景追加

```css
.gomoku-bg {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
```

## 📋 チェックリスト

新しいゲームを追加する際の確認項目：

- [ ] HTMLファイルを作成（`GAMENAME`を置換）
- [ ] CSSファイルを作成（ボードサイズを調整）
- [ ] JavaScriptファイルを作成（ゲームロジックを実装）
- [ ] ゲームロジックの実装
  - [ ] `initializeBoard()` - 初期配置
  - [ ] `isValidMove()` - 有効手判定
  - [ ] `checkWinner()` - 勝者判定
  - [ ] `makeMove()` - 手の実行
  - [ ] CPU戦略（レベル2, 3）
- [ ] i18n.jsに6言語の翻訳を追加
  - [ ] 日本語（ja）
  - [ ] 英語（en）
  - [ ] 中国語（zh）
  - [ ] ヒンディー語（hi）
  - [ ] スペイン語（es）
  - [ ] フランス語（fr）
- [ ] index.htmlにゲームカードを追加
- [ ] styles.cssに背景スタイルを追加
- [ ] ブラウザでテスト
  - [ ] PvPモード動作確認
  - [ ] CPU対戦動作確認（全レベル）
  - [ ] モーダル表示確認
  - [ ] 多言語切り替え確認
  - [ ] レスポンシブ対応確認

## 🎮 実装例

`templates/` フォルダには基本的なゲーム構造のテンプレートがあります。
既存のゲーム（オセロ、ルドー、チェス）も参考にしてください。

### 参考ファイル
- `src/othello.*` - シンプルなボードゲーム
- `src/chess.*` - 複雑なルールのゲーム
- `src/ludo.*` - 多人数対応ゲーム

## 💡 ヒント

### ボードの種類
- **グリッドボード**: チェス、オセロ、五目並べ → `display: grid`
- **経路ボード**: ルドー → SVGまたは絶対配置
- **カスタム形状**: 将棋、囲碁 → カスタムCSS

### CPU実装のレベル
1. **レベル1（易しい）**: ランダムな有効手を選択
2. **レベル2（普通）**: 簡単な評価関数（駒の価値、位置評価）
3. **レベル3（難しい）**: ミニマックス、アルファベータ法、評価関数

### デバッグ
- ブラウザの開発者ツール（F12）でコンソールエラーを確認
- `console.log()` でゲーム状態をデバッグ
- 小さい盤面でテストしてから本番サイズに拡大

## 🔧 カスタマイズ

テンプレートは基本構造です。ゲームに応じて自由にカスタマイズしてください：

- アニメーション効果の追加
- 音声効果の追加
- スコアシステムの変更
- 特殊ルールの実装
- タイマーの追加
- リプレイ機能

Happy Coding! 🎉
