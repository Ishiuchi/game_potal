# ルドーゲーム 詳細設計書

## ドキュメント管理

### バージョン情報
- **バージョン**: v1.0
- **最終更新日**: 2026年1月14日
- **作成者**: Development Team

### 変更履歴
| バージョン | 日付 | 変更内容 |
|:---:|:---|:---|
| v1.0 | 2026/01/14 | 初版作成 - データ構造定義を追加 |

### 文書の目的
本ドキュメントは、ルドーゲーム（ludo.js）の実装における詳細設計を定義します。変数名、データ構造、処理ロジック、アルゴリズムを明確化し、コードの保守性と拡張性を確保することを目的とします。

---

## 1. データ構造定義

### 1.1 グローバル定数

#### 1.1.1 色関連定数

```javascript
// ゲームで使用する色の配列
const COLORS = ['red', 'blue', 'yellow', 'green'];
```
- **型**: `Array<string>`
- **値**: `['red', 'blue', 'yellow', 'green']`
- **用途**: プレイヤーの色を識別する標準配列。配列インデックスがプレイヤー番号に対応
- **使用箇所**: プレイヤー初期化、トークン管理、UI描画

```javascript
// 色名の日本語表示マッピング
const COLOR_NAMES = { red: '赤', blue: '青', yellow: '黄', green: '緑' };
```
- **型**: `Object<string, string>`
- **値**: `{ red: '赤', blue: '青', yellow: '黄', green: '緑' }`
- **用途**: UIでの色名表示（ログ、ステータス表示）
- **使用箇所**: ログ出力、ターン表示、勝利モーダル

#### 1.1.2 ゲーム盤面定数

```javascript
// 各プレイヤーが持つトークン数
const TOKENS_PER_PLAYER = 4;
```
- **型**: `number`
- **値**: `4`
- **用途**: トークンの初期化、勝利判定
- **不変性**: ゲーム中は変更不可

```javascript
// ボードのサイズ（行列数）
const BOARD_SIZE = 11;
```
- **型**: `number`
- **値**: `11`
- **用途**: ボード描画、座標計算
- **説明**: 11×11マスの正方形ボード

```javascript
// メインパスの長さ（円形通路）
const PATH_LENGTH = 40;
```
- **型**: `number`
- **値**: `40`
- **用途**: トークン位置の正規化（`position % PATH_LENGTH`）
- **説明**: 全プレイヤーが共有する円形通路の総マス数

```javascript
// ホームパスの長さ（ゴールへの最終通路）
const HOME_PATH_LENGTH = 4;
```
- **型**: `number`
- **値**: `4`
- **用途**: ホームパス座標計算、ゴール判定
- **説明**: 各色専用のゴールまでの直線通路

```javascript
// セーフマスの配列
const SAFE_POSITIONS = [];
```
- **型**: `Array<number>`
- **値**: `[]`（空配列）
- **用途**: 捕獲判定での除外処理
- **説明**: この実装ではセーフマスは存在しない（全マスで捕獲可能）

#### 1.1.3 スタート位置定数

```javascript
const START_POSITIONS = {
    red: 0,      // パス配列位置0（ボード座標: row=4, col=0）
    blue: 10,    // パス配列位置10（ボード座標: row=0, col=6）
    yellow: 20,  // パス配列位置20（ボード座標: row=6, col=10）
    green: 30    // パス配列位置30（ボード座標: row=10, col=4）
};
```
- **型**: `Object<string, number>`
- **キー**: 色名（'red', 'blue', 'yellow', 'green'）
- **値**: パス配列上の位置（0-39）
- **用途**: ベースからトークンを出す際の初期配置位置、捕獲後の戻り先
- **関係性**: 各色のスタート位置は10マスずつずれている（360度÷4色＝90度）

---

### 1.2 ゲーム状態オブジェクト（gameState）

```javascript
let gameState = {
    playerCount: 4,              
    playerCountSelected: false,  
    players: [],                 
    currentPlayerIndex: 0,       
    diceValue: null,             
    tokens: {},                  
    settings: {
        requireSixToStart: true,
        extraTurnOnSix: true,
        exactRollToFinish: true,
        cpuThinkingTime: true
    },
    isRolled: false,             
    movableTokens: [],           
    gameStarted: false,          
    winners: [],                 
    turnCount: 0                 
};
```

#### 1.2.1 プレイヤー関連プロパティ

##### `playerCount`
- **型**: `number`
- **初期値**: `4`
- **範囲**: `2`, `3`, `4`
- **用途**: 参加プレイヤー数
- **変更タイミング**: ゲーム開始前の設定画面で変更
- **使用箇所**: プレイヤー初期化、UI生成

##### `playerCountSelected`
- **型**: `boolean`
- **初期値**: `false`
- **用途**: プレイヤー人数選択済みフラグ
- **変更タイミング**: 人数ボタンクリック時に`true`に変更
- **使用箇所**: UI表示制御

##### `players`
- **型**: `Array<PlayerObject>`
- **初期値**: `[]`
- **構造**: 以下のPlayerObjectの配列
```javascript
{
    color: 'red' | 'blue' | 'yellow' | 'green',  // プレイヤーの色
    type: 'human' | 'ai1' | 'ai2' | 'ai3'         // プレイヤータイプ
}
```
- **用途**: 各プレイヤーの基本情報を保持
- **要素数**: `playerCount`と一致
- **変更タイミング**: ゲーム開始時に初期化

##### `currentPlayerIndex`
- **型**: `number`
- **初期値**: `0`
- **範囲**: `0` ～ `playerCount - 1`
- **用途**: 現在のターンのプレイヤーを特定
- **変更タイミング**: `nextTurn()`関数で循環的にインクリメント
- **計算式**: `(currentPlayerIndex + 1) % playerCount`

#### 1.2.2 サイコロ関連プロパティ

##### `diceValue`
- **型**: `number | null`
- **初期値**: `null`
- **範囲**: `1` ～ `6` または `null`
- **用途**: 現在のサイコロの目を保持
- **変更タイミング**: `performDiceRoll()`実行時に1-6のランダム値を設定
- **null条件**: サイコロを振る前、または次のターンに移行時

##### `isRolled`
- **型**: `boolean`
- **初期値**: `false`
- **用途**: 現在のターンでサイコロを振ったかのフラグ
- **用途詳細**: 二重クリック防止、CPU自動実行制御
- **変更タイミング**: 
  - `true`: サイコロ実行時
  - `false`: ターン終了時

##### `movableTokens`
- **型**: `Array<TokenIdentifier>`
- **初期値**: `[]`
- **構造**:
```javascript
{
    color: 'red' | 'blue' | 'yellow' | 'green',  // トークンの色
    id: 0 | 1 | 2 | 3                             // トークン番号
}
```
- **用途**: 現在のサイコロの目で動かせるトークンのリスト
- **計算タイミング**: `calculateMovableTokens()`関数で生成
- **使用箇所**: トークンクリック時の移動可能判定、AI思考、UI強調表示

#### 1.2.3 トークン状態プロパティ

##### `tokens`
- **型**: `Object<string, Array<TokenObject>>`
- **初期値**: `{}`
- **構造**:
```javascript
{
    red: [TokenObject, TokenObject, TokenObject, TokenObject],
    blue: [TokenObject, TokenObject, TokenObject, TokenObject],
    yellow: [TokenObject, TokenObject, TokenObject, TokenObject],
    green: [TokenObject, TokenObject, TokenObject, TokenObject]
}
```
- **用途**: 全プレイヤーの全トークンの状態を管理
- **キー**: 色名（COLORS配列の要素）
- **値**: 4個のTokenObjectの配列

**TokenObjectの詳細構造**:
```javascript
{
    position: number,    // トークンの現在位置
    isFinished: boolean  // ゴール済みフラグ
}
```

**position値の意味**:
| 値の範囲 | 意味 | 説明 |
|---------|------|------|
| `-1` | ベース（出発前） | トークンが初期位置にいる状態 |
| `0-39` | メインパス | 円形通路上の位置（PATH_LENGTH基準） |
| `1000-1003` | ホームパス | ゴール手前の専用通路（1000=入口、1003=ゴール） |

**isFinished値**:
- `false`: 通常状態（ベースまたは盤面上）
- `true`: ゴール済み（これ以上移動不可）

#### 1.2.4 設定プロパティ

##### `settings`
- **型**: `Object`
- **用途**: ゲームルールの設定を保持

**settingsオブジェクトの詳細**:

```javascript
{
    requireSixToStart: boolean,    // ベースからの出発に6が必要か
    extraTurnOnSix: boolean,       // 6が出たら追加ターンか
    exactRollToFinish: boolean,    // ゴールに正確な目が必要か
    cpuThinkingTime: boolean       // CPUの思考時間を表示するか
}
```

| プロパティ | 型 | 初期値 | 説明 |
|-----------|-----|-------|------|
| `requireSixToStart` | `boolean` | `true` | `true`: 6の目でのみベースから出られる<br>`false`: 任意の目で出られる |
| `extraTurnOnSix` | `boolean` | `true` | `true`: 6が出たら再度サイコロを振れる<br>`false`: 6でも通常ターン終了 |
| `exactRollToFinish` | `boolean` | `true` | `true`: ゴールにぴったりの目が必要<br>`false`: 超過してもゴール可能 |
| `cpuThinkingTime` | `boolean` | `true` | `true`: CPU思考時にアニメーション表示<br>`false`: 即座に実行 |

#### 1.2.5 ゲーム進行プロパティ

##### `gameStarted`
- **型**: `boolean`
- **初期値**: `false`
- **用途**: ゲーム開始済みフラグ
- **変更タイミング**: `startGame()`関数で`true`に変更
- **使用箇所**: 画面切り替え制御

##### `winners`
- **型**: `Array<WinnerObject>`
- **初期値**: `[]`
- **構造**:
```javascript
{
    color: string,   // プレイヤーの色
    rank: number,    // 順位（1位、2位、3位、4位）
    type: string     // プレイヤータイプ（'human', 'ai1', 'ai2', 'ai3'）
}
```
- **用途**: ゴール順の記録
- **追加タイミング**: プレイヤーの全トークンがゴールした時
- **要素数**: 最大`playerCount`個

##### `turnCount`
- **型**: `number`
- **初期値**: `0`
- **範囲**: `0` ～ 無限（実質的には数百～数千）
- **用途**: ゲーム開始からの総ターン数
- **変更タイミング**: `nextTurn()`関数でインクリメント
- **使用箇所**: デバッグログ、統計情報

---

### 1.3 座標系定義

#### 1.3.1 ボード座標系

- **型**: `{row: number, col: number}`
- **範囲**: `row: 0-10`, `col: 0-10`
- **説明**: 11×11グリッドの行列座標
- **原点**: 左上が`{row: 0, col: 0}`
- **用途**: ボード描画、CSS配置

#### 1.3.2 パス座標系

- **型**: `number`
- **範囲**: `0-39`（メインパス）、`1000-1003`（ホームパス）
- **説明**: トークンの論理的位置
- **原点**: 赤のスタート位置が0
- **循環性**: `position % PATH_LENGTH`で正規化

#### 1.3.3 座標変換マッピング

パス座標からボード座標への変換は`getPathPosition(position)`関数で実行：

```javascript
// 例：パス位置0（赤スタート）→ ボード座標{row: 4, col: 0}
getPathPosition(0)  // => {row: 4, col: 0}
getPathPosition(10) // => {row: 0, col: 6}  // 青スタート
getPathPosition(20) // => {row: 6, col: 10} // 黄スタート
getPathPosition(30) // => {row: 10, col: 4} // 緑スタート
```

---

## 2. 関数仕様

### 2.1 初期化関数

#### 2.1.1 `document.addEventListener('DOMContentLoaded', callback)`

**目的**: ページロード時の初期化処理

**実行タイミング**: HTMLドキュメントの読み込み完了時

**処理フロー**:
```
1. デフォルトで4人プレイボタンを選択状態に設定
2. gameState.playerCountSelected = true
3. renderPlayerSetup()を呼び出してUI生成
4. コンソールに起動メッセージ出力
```

**副作用**:
- DOM操作: `.setup-button:nth-child(4)`に`active`クラス追加
- 状態変更: `gameState.playerCountSelected`を`true`に設定
- UI生成: プレイヤー設定UIを表示

---

#### 2.1.2 `setPlayerCount(count)`

**目的**: プレイヤー人数を設定

**パラメータ**:
| 名前 | 型 | 必須 | 説明 |
|-----|-----|-----|-----|
| count | number | ✓ | プレイヤー人数（2, 3, 4のいずれか） |

**戻り値**: なし（`void`）

**処理ロジック**:
```
1. gameState.playerCount = count
2. gameState.playerCountSelected = true
3. 全ての人数ボタンから'active'クラスを削除
4. クリックされたボタンに'active'クラスを追加
5. renderPlayerSetup()でUI再生成
```

**副作用**:
- 状態変更: `gameState.playerCount`, `gameState.playerCountSelected`
- DOM操作: ボタンの`active`クラス制御
- UI更新: プレイヤー設定欄の再描画

**使用箇所**: プレイヤー人数選択ボタンのonclickイベント

---

#### 2.1.3 `renderPlayerSetup()`

**目的**: プレイヤー設定UIを動的生成

**パラメータ**: なし

**戻り値**: なし（`void`）

**処理ロジック**:
```
1. コンテナ要素(#playerSetup)を取得
2. 既存のHTML内容をクリア
3. gameState.playerCount回ループ:
   a. 各プレイヤーの色をCOLORS配列から取得
   b. プレイヤー設定用div要素を生成
   c. 色インジケーター、ラベル、セレクトボックスを追加
   d. セレクトボックスのオプション:
      - 'human': プレイヤー
      - 'ai1': CPU レベル1
      - 'ai2': CPU レベル2
      - 'ai3': CPU レベル3
   e. コンテナに追加
```

**生成されるHTML構造**:
```html
<div class="player-config">
    <div class="player-color-indicator" style="background-color: #色"></div>
    <label>色名</label>
    <select id="player-N-type">
        <option value="human">プレイヤー</option>
        <option value="ai1">CPU レベル1</option>
        <option value="ai2">CPU レベル2</option>
        <option value="ai3">CPU レベル3</option>
    </select>
</div>
```

**副作用**:
- DOM操作: `#playerSetup`の内容を完全に書き換え

**呼び出し元**: 
- DOMContentLoadedイベント
- `setPlayerCount()`関数

---

#### 2.1.4 `startGame()`

**目的**: ゲームを開始

**パラメータ**: なし

**戻り値**: なし（`void`）

**処理ロジック**:
```
1. プレイヤー情報を収集:
   - gameState.players配列を初期化
   - 各プレイヤーのセレクトボックスから色とタイプを取得
   - players配列に{color, type}オブジェクトを追加

2. トークン初期化:
   - initTokens()を呼び出し

3. 画面切り替え:
   - #gameSetupを非表示
   - #gameContainerを表示

4. ゲーム状態設定:
   - gameState.gameStarted = true
   - currentPlayerIndex = 0（最初のプレイヤー）

5. ボード描画とUI更新:
   - renderBoard()
   - updateStatus()
   - ログに「ゲーム開始」メッセージ

6. CPUターン開始処理:
   - 最初のプレイヤーがCPUの場合、aiStartTurn()を呼び出し
```

**副作用**:
- 状態変更: `gameState.players`, `gameState.tokens`, `gameState.gameStarted`
- DOM操作: 設定画面とゲーム画面の表示切り替え
- 画面描画: ボードとトークンの初期描画

**条件分岐**:
- 最初のプレイヤーのtypeが'human'以外の場合 → CPU自動ターン開始

---

#### 2.1.5 `initTokens()`

**目的**: 全プレイヤーのトークンを初期化

**パラメータ**: なし

**戻り値**: なし（`void`）

**処理ロジック**:
```
1. デバッグモード判定:
   - #debugModeチェックボックスの状態を確認

2. gameState.tokensオブジェクトを空に初期化

3. 各プレイヤーごとにループ:
   a. 色を取得: COLORS[i]
   b. gameState.tokens[color]を空配列で初期化
   
   c. デバッグモード時のみ:
      - players[i].finishedTokens = 3を設定
   
   d. 4つのトークンを生成:
      - デバッグモード かつ j < 3の場合:
        * position: 1003（ゴール位置）
        * isFinished: true
        * コンソールログ出力
      
      - 通常モードまたはj === 3の場合:
        * position: -1（ベース）
        * isInHomePath: false
        * homePathPosition: -1
        * isFinished: false
```

**TokenObject生成ルール**:

**通常モード**:
```javascript
{
    id: j,                  // 0-3
    position: -1,           // ベース
    isInHomePath: false,
    homePathPosition: -1,
    isFinished: false
}
```

**デバッグモード（トークン0-2）**:
```javascript
{
    id: j,
    position: 1003,         // ゴール
    isInHomePath: true,
    homePathPosition: 3,
    isFinished: true
}
```

**デバッグモード（トークン3）**:
```javascript
{
    id: 3,
    position: -1,           // ベース
    isInHomePath: false,
    homePathPosition: -1,
    isFinished: false
}
```

**副作用**:
- 状態変更: `gameState.tokens`を完全に再構築
- コンソール出力: デバッグモード時のログ

**使用箇所**: 
- `startGame()`関数
- `resetGame()`関数

---

### 2.2 描画関数

#### 2.2.1 `renderBoard()`

**目的**: ゲームボードのDOM要素を生成

**パラメータ**: なし

**戻り値**: なし（`void`）

**処理ロジック**:
```
1. #ludoBoardコンテナ要素を取得
2. 既存のHTML内容をクリア
3. 11×11グリッドを生成:
   for row in 0..10:
     for col in 0..10:
       a. div要素を生成
       b. クラス名: 'board-cell'
       c. データ属性: data-row, data-col
       d. setCellType(cell, row, col)で種別設定
       e. ボードに追加
4. renderTokens()でトークン配置
```

**生成されるセル数**: 121個（11×11）

**副作用**:
- DOM操作: `#ludoBoard`の内容を完全に書き換え
- 呼び出し: `setCellType()`, `renderTokens()`

**使用箇所**:
- `startGame()`
- `resetGame()`

---

#### 2.2.2 `setCellType(cell, row, col)`

**目的**: ボードセルの種別とスタイルを設定

**パラメータ**:
| 名前 | 型 | 必須 | 説明 |
|-----|-----|-----|-----|
| cell | HTMLElement | ✓ | 設定対象のdiv要素 |
| row | number | ✓ | 行番号（0-10） |
| col | number | ✓ | 列番号（0-10） |

**戻り値**: なし（`void`）

**処理ロジック（座標判定）**:

**1. ベースエリア判定**:
```javascript
// 赤ベース（左上）: row=0-3, col=0-3
if (row === 0 && col === 0) {
    // 4×4エリアの統合セル
    gridRow: '1 / 5', gridColumn: '1 / 5'
    クラス: 'base-area red base-container'
    内部HTML: 4つのスロット円
} else if (row < 4 && col < 4) {
    display: 'none'  // 他のセルは非表示
}

// 青ベース（右上）: row=0-3, col=7-10
// 黄ベース（右下）: row=7-10, col=7-10
// 緑ベース（左下）: row=7-10, col=0-3
// ※同様のロジック
```

**2. スタートマス判定**:
```javascript
if (row === 4 && col === 0) {
    クラス: 'path start red'
    内容: '➡️'  // 赤スタート
} else if (row === 0 && col === 6) {
    クラス: 'path start blue'
    内容: '⬇️'  // 青スタート
} else if (row === 6 && col === 10) {
    クラス: 'path start yellow'
    内容: '⬅️'  // 黄スタート
} else if (row === 10 && col === 4) {
    クラス: 'path start green'
    内容: '⬆️'  // 緑スタート
}
```

**3. ホームパス判定**:
```javascript
// 赤ホームパス: row=5, col=1-4
if (row === 5 && col >= 1 && col <= 4) {
    クラス: 'home-path red'
}
// 青ホームパス: row=1-4, col=5
else if (col === 5 && row >= 1 && row <= 4) {
    クラス: 'home-path blue'
}
// 黄ホームパス: row=5, col=6-9
else if (row === 5 && col >= 6 && col <= 9) {
    クラス: 'home-path yellow'
}
// 緑ホームパス: row=6-9, col=5
else if (col === 5 && row >= 6 && row <= 9) {
    クラス: 'home-path green'
}
```

**4. 通常パス**:
```javascript
else {
    クラス: 'path'
}
```

**副作用**:
- DOM操作: セル要素のクラス、スタイル、内容を設定

**座標マッピング表**:
| エリア | row範囲 | col範囲 | 統合セル座標 |
|-------|--------|---------|------------|
| 赤ベース | 0-3 | 0-3 | (0,0) |
| 青ベース | 0-3 | 7-10 | (0,7) |
| 黄ベース | 7-10 | 7-10 | (7,7) |
| 緑ベース | 7-10 | 0-3 | (7,0) |

---

#### 2.2.3 `renderTokens()`

**目的**: 全トークンをボード上に描画

**パラメータ**: なし

**戻り値**: なし（`void`）

**処理ロジック**:
```
1. 既存のトークン要素を全削除:
   - document.querySelectorAll('.token').forEach(t => t.remove())

2. gameState.tokensオブジェクトをループ:
   for each color:
     for each token (index 0-3):
       a. トークン要素を生成:
          - div要素
          - クラス: 'token' + color
          - 表示テキスト: index + 1（1-4）
          - データ属性: data-color, data-id
       
       b. ゴール済み判定:
          if token.isFinished:
            - クラス追加: 'finished'
            - ゴール座標に配置
            - return（次のトークンへ）
       
       c. 移動可能判定:
          if gameState.movableTokensに含まれる:
            - クラス追加: 'movable'
            - onclick: moveToken(color, index)
       
       d. 位置計算:
          - pos = getTokenDOMPosition(color, token)
          - 該当セルを取得
          - セル内にトークンを追加
```

**ゴール位置マッピング**:
```javascript
const goalPositions = {
    red: [{ row: 5, col: 4 }],
    blue: [{ row: 4, col: 5 }],
    yellow: [{ row: 5, col: 6 }],
    green: [{ row: 6, col: 5 }]
};
```

**副作用**:
- DOM操作: 全トークン要素を削除して再生成
- イベント登録: 移動可能トークンにonclickイベント設定

**使用箇所**:
- `renderBoard()`
- `performDiceRoll()`（movableTokens更新後）
- ターン更新時

---

### 2.3 サイコロ関連関数

#### 2.3.1 `rollDice()`

**目的**: 人間プレイヤーがサイコロボタンをクリックした時の処理

**パラメータ**: なし

**戻り値**: なし（`void`）

**処理ロジック**:
```
1. ゲーム終了チェック:
   - 全プレイヤーの全トークンがゴール済みか確認
   - ゴール済みなら何もせずreturn

2. 二重クリック防止:
   - gameState.isRolled === true なら return

3. CPUターン判定:
   - getCurrentPlayer().type !== 'human' なら return

4. サイコロ実行:
   - performDiceRoll()を呼び出し
```

**ガード条件**:
- ゲーム終了済み
- 既にサイコロ済み
- CPUのターン

**副作用**: なし（条件を満たす場合のみ`performDiceRoll()`を呼び出し）

**使用箇所**: サイコロボタンのonclickイベント

---

#### 2.3.2 `performDiceRoll()`

**目的**: サイコロの実際の処理（人間・CPU共通）

**パラメータ**: なし

**戻り値**: なし（`void`）

**処理ロジック**:
```
1. 現在のプレイヤーとトークンを取得

2. ゲーム終了チェック（二重確認）

3. 全トークンゴール済みチェック:
   - 該当プレイヤーの全トークンがゴール済みなら:
     * ログ出力
     * nextTurn()
     * return

4. ベース・ボード状況確認:
   - tokensInBase: ベースにいるトークン数
   - tokensOnBoard: ボード上のトークン数
   
5. 自動パス判定:
   - ボード上にトークンなし かつ ベースにトークンあり
   - かつ requireSixToStart === true
   - かつ スタート位置に自分のトークンあり
   → 動かせるトークンがないため自動パス

6. サイコロアニメーション:
   - #diceDisplayに'rolling'クラス追加
   - 500ms待機

7. サイコロ値決定（500ms後）:
   - value = Math.floor(Math.random() * 6) + 1
   - gameState.diceValue = value
   - gameState.isRolled = true
   - 画面に表示
   - 'rolling'クラス削除
   - ログ出力

8. 移動可能トークン計算:
   - calculateMovableTokens()

9. 移動可能判定:
   - movableTokens.length === 0の場合:
     * ログ: 動かせるトークンなし
     * 1.5秒後にnextTurn()
   
   - movableTokens.length > 0の場合:
     * renderTokens()でトークン再描画
     * CPUの場合: 1秒後にaiMove()
```

**タイミング制御**:
- アニメーション: 500ms
- 移動不可時の次ターン: 1500ms
- CPUの思考開始: 1000ms

**副作用**:
- 状態変更: `diceValue`, `isRolled`, `movableTokens`
- DOM操作: サイコロ表示、アニメーション
- ログ出力

---

#### 2.3.3 `calculateMovableTokens()`

**目的**: 現在のサイコロの目で動かせるトークンを計算

**パラメータ**: なし

**戻り値**: なし（`void`）

**処理ロジック**:
```
1. movableTokens配列を初期化

2. 現在のプレイヤーとトークンを取得

3. 全トークンゴール済みチェック:
   - 全トークンがisFinished === trueなら return

4. 各トークンをループ:
   for each token:
     a. ゴール済みならスキップ
     
     b. ケース1: ベースにいる（position === -1）
        - 条件: diceValue === 6 または !requireSixToStart
        - スタート位置チェック:
          * 自分の他のトークンがスタート位置にいないか確認
          * いなければmovableTokensに追加
     
     c. ケース2: ホームパスにいる（position 1000-1003）
        - 新位置計算: position + diceValue
        - 条件分岐:
          * exactRollToFinish === true:
            - 新位置 === 1004（ぴったり）ならmovableTokensに追加
          * exactRollToFinish === false:
            - 新位置 >= 1004 ならmovableTokensに追加
     
     d. ケース3: メインパスにいる（position 0-39）
        - 新位置計算: position + diceValue
        - ホームパス入口判定:
          * 自分の色のホームパス入口マスを通過するか確認
          * 通過する場合:
            - ホームパス内の新位置を計算
            - exactRollToFinishルールに基づいて判定
          * 通過しない場合:
            - 新位置 = (position + diceValue) % PATH_LENGTH
            - movableTokensに追加
```

**ホームパス入口マス**:
```javascript
const homePathEntry = {
    red: 39,    // パス位置39の次がホームパス入口
    blue: 9,
    yellow: 19,
    green: 29
};
```

**移動可能判定フロー**:
```
トークン位置 → 条件チェック → movableTokensに追加

ベース(-1):
  └→ (6 または !requireSixToStart) かつ スタート位置が空
     └→ 追加

ホームパス(1000-1003):
  └→ exactRollToFinish
     ├→ true: 新位置 === 1004
     └→ false: 新位置 >= 1004
        └→ 追加

メインパス(0-39):
  ├→ ホームパス入口通過
  │  └→ ホームパス内位置判定
  └→ 通常移動
     └→ 追加
```

**副作用**:
- 状態変更: `gameState.movableTokens`

**使用箇所**: `performDiceRoll()`

---

## 3. アルゴリズム・処理フロー

### 3.1 ゲームループ

```mermaid
graph TD
    A[ゲーム開始] --> B[プレイヤー初期化]
    B --> C[トークン初期化]
    C --> D[ボード描画]
    D --> E{現在プレイヤーの<br/>タイプ}
    E -->|human| F[サイコロボタン待機]
    E -->|ai1/ai2/ai3| G[CPU自動ターン]
    F --> H[サイコロを振る]
    G --> H
    H --> I[移動可能トークン計算]
    I --> J{移動可能<br/>トークンあり?}
    J -->|No| K[1.5秒待機]
    K --> L[次ターンへ]
    J -->|Yes| M{プレイヤー<br/>タイプ}
    M -->|human| N[トークンクリック待機]
    M -->|ai| O[CPU思考]
    N --> P[トークン移動]
    O --> P
    P --> Q[捕獲チェック]
    Q --> R[勝利チェック]
    R --> S{全員<br/>ゴール?}
    S -->|Yes| T[ゲーム終了]
    S -->|No| U{サイコロの目<br/>== 6?}
    U -->|Yes かつ<br/>extraTurnOnSix| V[追加ターン]
    U -->|No| L
    V --> E
    L --> E
    T --> W[勝利モーダル表示]
```

---

### 3.2 ターン処理シーケンス

#### 3.2.1 ターン開始フロー

```
開始
  ↓
┌─────────────────────┐
│ ターン開始          │
│ - currentPlayerIndex│
│ - turnCount++       │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ プレイヤータイプ判定│
└──────────┬──────────┘
           ↓
     ┌─────┴─────┐
     ↓           ↓
 [Human]     [CPU ai1/ai2/ai3]
     ↓           ↓
 ボタン待機  CPU思考時間表示
     ↓           ↓
 クリック    performDiceRoll()
     ↓           ↓
     └─────┬─────┘
           ↓
   performDiceRoll()
```

#### 3.2.2 サイコロ処理フロー

```
performDiceRoll()
  ↓
┌─────────────────────┐
│ 前提条件チェック    │
│ - ゲーム終了済み?  │
│ - 全トークンゴール?│
└──────────┬──────────┘
           ↓ OK
┌─────────────────────┐
│ 自動パス判定        │
│ - ボード上0個      │
│ - ベース1個以上    │
│ - requireSixToStart│
│ - スタート位置占有 │
└──────────┬──────────┘
           ↓ パスでない
┌─────────────────────┐
│ アニメーション開始  │
│ - 'rolling'追加    │
└──────────┬──────────┘
           ↓ 500ms待機
┌─────────────────────┐
│ サイコロ値決定      │
│ value = rand(1-6)  │
│ diceValue = value  │
│ isRolled = true    │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ 移動可能計算        │
│ calculateMovableTokens()│
└──────────┬──────────┘
           ↓
     ┌─────┴─────┐
     ↓           ↓
[トークン0個]  [トークン1個以上]
     ↓           ↓
 1.5秒待機   renderTokens()
     ↓           ↓
 nextTurn()      ↓
             ┌───┴───┐
             ↓       ↓
          [Human]  [CPU]
             ↓       ↓
          待機   aiMove()
```

---

### 3.3 移動可能判定アルゴリズム

#### 3.3.1 `calculateMovableTokens()` 処理フロー

```
開始
  ↓
movableTokens = []
  ↓
全トークンループ
  ↓
┌──────────────────────┐
│ トークン状態判定     │
└────────┬─────────────┘
         ↓
   ┌─────┴─────┐
   ↓           ↓
[ゴール済み] [未ゴール]
   ↓           ↓
 スキップ    位置判定
               ↓
         ┌─────┴─────┐
         ↓     ↓     ↓
      [ベース][ホームパス][メインパス]
      position position   position
      == -1   1000-1003   0-39
         ↓     ↓           ↓
      [判定A][判定B]    [判定C]
```

**[判定A] ベースからの出発判定**:
```
条件1: diceValue == 6 OR !requireSixToStart
  ↓ True
条件2: START_POSITIONS[color]に自分の他トークンなし
  ↓ True
movableTokensに追加
```

**[判定B] ホームパス内移動判定**:
```
現在位置: homePos = position - 1000  (0-3)
新位置: newHomePos = homePos + diceValue
  ↓
┌─────────────────────┐
│ exactRollToFinish? │
└──────────┬──────────┘
     ┌─────┴─────┐
     ↓           ↓
  [True]      [False]
     ↓           ↓
newHomePos    newHomePos
== 4?         >= 4?
     ↓           ↓
   [Yes]       [Yes]
     ↓           ↓
newHomePos < HOME_PATH_LENGTH (4)?
     ↓ True
移動先に自分のトークンなし?
     ↓ True
movableTokensに追加
```

**[判定C] メインパス移動判定**:
```
相対位置計算:
startPos = START_POSITIONS[color]
relativePos = (position - startPos + PATH_LENGTH) % PATH_LENGTH
newRelativePos = relativePos + diceValue
  ↓
┌───────────────────┐
│newRelativePos     │
│>= PATH_LENGTH?   │
└────────┬──────────┘
    ┌────┴────┐
    ↓         ↓
  [Yes]     [No]
    ↓         ↓
ホームパス  通常移動
進入判定
    ↓
excessSteps = newRelativePos - PATH_LENGTH
    ↓
excessSteps < HOME_PATH_LENGTH?
    ↓ True
targetHomePos = 1000 + excessSteps
    ↓
移動先に自分のトークンなし?
    ↓ True
movableTokensに追加
```

---

### 3.4 トークン移動処理

#### 3.4.1 `moveToken(color, tokenId)` フロー

```
開始
  ↓
トークン取得
  ↓
┌────────────────────┐
│ 現在位置判定       │
└────────┬───────────┘
         ↓
   ┌─────┴─────┐
   ↓           ↓
[position    [position
 == -1]       != -1]
   ↓           ↓
[出発処理]  [移動処理]
```

**[出発処理]**:
```
1. position = START_POSITIONS[color]
2. renderTokens()
3. 300ms待機
4. ログ出力: "スタートしました"
5. checkCapture(color, position)
6. → ターン終了処理へ
```

**[移動処理]**:
```
相対位置計算
  ↓
┌────────────────────┐
│ 現在位置タイプ     │
└────────┬───────────┘
         ↓
   ┌─────┴─────┐
   ↓           ↓
[ホームパス]  [メインパス]
position     position
1000-1003    0-39
   ↓           ↓
[処理D]     [処理E]
```

**[処理D] ホームパス内移動**:
```
For i = 1 to diceValue:
  ↓
  homePos = position - 1000
  newHomePos = homePos + i
  ↓
  newHomePos < HOME_PATH_LENGTH?
  ↓ True
  position = 1000 + homePos + i
  renderTokens()
  300ms待機
  ↓
  最終ステップ?
  ↓ Yes
  position == 1003?
  ↓ Yes
  isFinished = true
  ログ: "ゴールしました！"
```

**[処理E] メインパス移動（1マスずつアニメーション）**:
```
For i = 1 to diceValue:
  ↓
  relativePos++
  ↓
  ┌────────────────────┐
  │relativePos         │
  │>= PATH_LENGTH?    │
  └────────┬───────────┘
      ┌────┴────┐
      ↓         ↓
    [Yes]     [No]
      ↓         ↓
  ホームパス  通常移動
  進入
      ↓
  excessSteps = relativePos - PATH_LENGTH
      ↓
  position = 1000 + excessSteps
  renderTokens()
  300ms待機
      ↓
  最終ステップ かつ position == 1003?
      ↓ Yes
  isFinished = true
  ログ: "ゴールしました！"
  
  [通常移動]
      ↓
  newPos = (startPos + relativePos) % PATH_LENGTH
  position = newPos
  renderTokens()
  300ms待機
      ↓
  最終ステップ?
      ↓ Yes
  ログ: "移動しました"
  checkCapture(color, position)
```

---

### 3.5 捕獲処理ロジック

#### 3.5.1 `checkCapture(color, position)` フロー

```
開始
  ↓
┌────────────────────┐
│ セーフマス判定     │
│ SAFE_POSITIONSに  │
│ 含まれる?         │
└────────┬───────────┘
         ↓ No（セーフでない）
全プレイヤーループ
  ↓
自分の色は除外
  ↓
各プレイヤーのトークンループ
  ↓
┌────────────────────┐
│ 位置一致判定       │
│ token.position    │
│ == position?      │
└────────┬───────────┘
         ↓ Yes
┌────────────────────┐
│ 捕獲実行           │
│ position = -1     │
│ (ベースに戻す)    │
└────────┬───────────┘
         ↓
ログ出力: "捕獲しました"
renderTokens()
```

**条件**:
- 移動先のpositionが同じ
- 異なる色のトークン
- セーフマスでない（SAFE_POSITIONS配列は空なので常に捕獲可能）

**効果**:
- 捕獲されたトークンは`position = -1`（ベース）に戻る
- 再度スタートするには6が必要（requireSixToStartの場合）

---

### 3.6 勝利判定アルゴリズム

#### 3.6.1 `checkWin()` フロー

```
開始
  ↓
全プレイヤーループ
  ↓
各プレイヤーのトークン確認
  ↓
finishedCount = トークンのisFinished == trueの数
  ↓
┌────────────────────┐
│ ゴール完了判定     │
│ finishedCount     │
│ == TOKENS_PER_PLAYER?│
└────────┬───────────┘
         ↓ Yes
┌────────────────────┐
│ 既に順位リストに   │
│ 存在する?         │
└────────┬───────────┘
         ↓ No
┌────────────────────┐
│ 順位確定           │
│ rank = winners.length + 1│
└────────┬───────────┘
         ↓
┌────────────────────┐
│ winnersに追加      │
│ {color, rank, type}│
└────────┬───────────┘
         ↓
ログ: "🎉 N位でゴール！"
  ↓
全プレイヤーゴール判定
  ↓
allPlayersFinished?
  ↓ Yes
ログ: "ゲーム終了"
800ms待機
showWinModal()
```

**WinnerObject構造**:
```javascript
{
    color: string,    // プレイヤー色
    rank: number,     // 順位（1, 2, 3, 4）
    type: string      // 'human', 'ai1', 'ai2', 'ai3'
}
```

**順位決定ロジック**:
- 最初にゴールしたプレイヤー: `rank = 1`
- 2番目にゴール: `rank = 2`
- 順次追加される

---

### 3.7 次ターン処理

#### 3.7.1 `nextTurn()` フロー

```
開始
  ↓
┌────────────────────┐
│ ゲーム終了判定     │
│ 全プレイヤーの     │
│ 全トークンゴール? │
└────────┬───────────┘
         ↓ Yes
      return（終了）
         ↓ No
┌────────────────────┐
│ 現プレイヤーの     │
│ 全トークンゴール判定│
└────────┬───────────┘
    ┌────┴────┐
    ↓         ↓
  [Yes]     [No]
    ↓         ↓
次へ進む   ループ開始
    ↓
┌────────────────────┐
│ プレイヤーインデックス│
│ 循環的にインクリメント│
│ (i + 1) % playerCount│
└────────┬───────────┘
         ↓
┌────────────────────┐
│ 次プレイヤーの     │
│ 全トークンゴール? │
└────────┬───────────┘
    ┌────┴────┐
    ↓         ↓
  [Yes]     [No]
    ↓         ↓
  次へ    ループ終了
    ↓
currentPlayerIndex更新
turnCount++
  ↓
isRolled = false
movableTokens = []
diceValue = null
  ↓
updateStatus()
renderTokens()
  ↓
┌────────────────────┐
│ プレイヤータイプ判定│
└────────┬───────────┘
    ┌────┴────┐
    ↓         ↓
 [Human]    [CPU]
    ↓         ↓
  待機    aiStartTurn()
```

**スキップロジック**:
- 全トークンがゴール済みのプレイヤーは自動的にスキップ
- 次の未ゴールプレイヤーを探す
- 全員ゴールしていたらゲーム終了

---

### 3.8 AI思考アルゴリズム

#### 3.8.1 AI全体フロー

```
aiStartTurn()
  ↓
cpuThinkingTime設定?
  ↓ Yes
思考時間表示（0.6-1.8秒）
  ↓
aiTurn()
  ↓
performDiceRoll()
  ↓
movableTokens計算
  ↓ 1個以上
aiMove()
  ↓
cpuThinkingTime設定?
  ↓ Yes
思考時間表示（0.5-1.5秒）
  ↓
getAIMove(level)
  ↓
┌────────────────────┐
│ AIレベル分岐       │
└────────┬───────────┘
    ┌────┴────┬────┐
    ↓         ↓    ↓
 [Level1]  [Level2][Level3]
    ↓         ↓      ↓
  ランダム  貪欲法  評価関数
    ↓         ↓      ↓
    └────┬────┴────┘
         ↓
   選択したmove
         ↓
   moveToken(color, id)
```

#### 3.8.2 Level 1: ランダム選択

```
アルゴリズム:
  movableTokensからランダムに1つ選択
  
実装:
  index = Math.floor(Math.random() * movableTokens.length)
  return movableTokens[index]
```

**特徴**:
- 最も単純
- 戦略性なし
- 初心者向け

#### 3.8.3 Level 2: 貪欲法（捕獲優先）

```
アルゴリズム:
1. 各movableTokensについてループ
2. 移動先位置を計算
3. 敵トークンがいるかチェック
4. 敵トークンがいれば即座にそのmoveを返す
5. 捕獲可能なmoveがなければ最初のmoveを返す

実装:
for each move in movableTokens:
    token = gameState.tokens[move.color][move.id]
    
    // 新位置計算
    if token.position == -1:
        newPos = START_POSITIONS[move.color]
    else:
        newPos = (token.position + diceValue) % PATH_LENGTH
    
    // 捕獲判定
    for each color (自分以外):
        if gameState.tokens[color]に newPosのトークンあり:
            return move（即座に選択）
    
// 捕獲不可なら最初のmove
return movableTokens[0]
```

**特徴**:
- 捕獲を最優先
- 短期的な利益重視
- 中級者向け

#### 3.8.4 Level 3: 評価関数

```
アルゴリズム:
1. 各movableTokensについてスコア計算
2. 最高スコアのmoveを選択

スコア計算式:
score = 0

// ベースからの出発ボーナス
if token.position == -1:
    score += 10

// 進行距離ボーナス
else:
    score += diceValue * 2
    
    // 捕獲ボーナス
    newPos = (token.position + diceValue) % PATH_LENGTH
    for each color (自分以外):
        if gameState.tokens[color]に newPosのトークンあり:
            score += 50

// 最高スコアのmoveを選択
bestMove = movableTokens[0]
bestScore = -Infinity

for each move in movableTokens:
    score = calculateScore(move)
    if score > bestScore:
        bestScore = score
        bestMove = move

return bestMove
```

**スコア配分**:
| 要素 | スコア | 理由 |
|-----|-------|------|
| ベースから出発 | +10 | トークンを動かすことが重要 |
| 進行距離 | +diceValue×2 | ゴールに近づく |
| 捕獲可能 | +50 | 敵を妨害する最大の利益 |

**特徴**:
- 複数要素を評価
- バランスの取れた戦略
- 上級者向け

---

## 4. 状態遷移図

### 4.1 ゲーム全体の状態遷移

```mermaid
stateDiagram-v2
    [*] --> 設定画面
    設定画面 --> ゲーム中: startGame()
    ゲーム中 --> ゲーム終了: 全員ゴール
    ゲーム終了 --> 設定画面: resetGame()
    ゲーム中 --> 設定画面: backToSetup()
    ゲーム終了 --> [*]
    
    state 設定画面 {
        [*] --> 人数未選択
        人数未選択 --> 人数選択済: setPlayerCount()
        人数選択済 --> タイプ選択中
        タイプ選択中 --> 開始可能: 全プレイヤー設定完了
    }
    
    state ゲーム中 {
        [*] --> ターン開始
        ターン開始 --> サイコロ待機
        サイコロ待機 --> サイコロ振る: rollDice() / aiTurn()
        サイコロ振る --> 移動可能計算
        移動可能計算 --> 移動不可: movableTokens.length == 0
        移動可能計算 --> トークン選択: movableTokens.length > 0
        移動不可 --> 次ターン: 1.5秒後
        トークン選択 --> 移動実行: moveToken()
        移動実行 --> 捕獲チェック
        捕獲チェック --> 勝利判定
        勝利判定 --> 次ターン: 6以外
        勝利判定 --> 追加ターン: 6でextraTurnOnSix
        追加ターン --> サイコロ待機
        次ターン --> ターン開始
    }
```

---

### 4.2 ターン状態の詳細遷移

```mermaid
stateDiagram-v2
    [*] --> 待機中
    
    state 待機中 {
        [*] --> プレイヤー判定
        プレイヤー判定 --> 人間待機: type == 'human'
        プレイヤー判定 --> CPU思考: type == 'ai1/ai2/ai3'
        
        state 人間待機 {
            [*] --> ボタン表示
            ボタン表示 --> クリック待ち
        }
        
        state CPU思考 {
            [*] --> 思考時間表示
            思考時間表示 --> 自動実行
        }
    }
    
    待機中 --> サイコロ実行: performDiceRoll()
    
    state サイコロ実行 {
        [*] --> アニメーション
        アニメーション --> 値決定: 500ms後
        値決定 --> 移動計算
        移動計算 --> [*]
    }
    
    サイコロ実行 --> 移動判定
    
    state 移動判定 {
        [*] --> トークン数チェック
        トークン数チェック --> 移動不可状態: 0個
        トークン数チェック --> 移動可能状態: 1個以上
        
        state 移動不可状態 {
            [*] --> ログ出力
            ログ出力 --> 待機
            待機 --> [*]: 1.5秒
        }
        
        state 移動可能状態 {
            [*] --> UI更新
            UI更新 --> 選択待機: human
            UI更新 --> AI選択: ai
            選択待機 --> [*]: click
            AI選択 --> [*]: 1秒後
        }
    }
    
    移動判定 --> トークン移動: moveToken()
    
    state トークン移動 {
        [*] --> 位置判定
        位置判定 --> 出発処理: position == -1
        位置判定 --> 移動処理: position != -1
        
        state 出発処理 {
            [*] --> スタート配置
            スタート配置 --> アニメ300ms
            アニメ300ms --> 捕獲判定
        }
        
        state 移動処理 {
            [*] --> ループ開始
            ループ開始 --> 1マス移動
            1マス移動 --> アニメ300ms
            アニメ300ms --> 次マス: 未完了
            アニメ300ms --> 完了: 最終マス
            次マス --> 1マス移動
            完了 --> ゴール判定
            ゴール判定 --> 捕獲判定: 非ゴール
            ゴール判定 --> フラグ設定: position==1003
        }
    }
    
    トークン移動 --> ターン後処理
    
    state ターン後処理 {
        [*] --> フラグリセット
        フラグリセット --> 勝利チェック
        勝利チェック --> 追加ターン判定
        
        state 追加ターン判定 {
            [*] --> 目の確認
            目の確認 --> 追加: diceValue==6 && extraTurnOnSix
            目の確認 --> 終了: それ以外
        }
    }
    
    ターン後処理 --> 待機中: 追加ターン
    ターン後処理 --> 次プレイヤー: 通常終了
    次プレイヤー --> [*]
```

---

### 4.3 トークン状態遷移

```mermaid
stateDiagram-v2
    [*] --> ベース: 初期化
    
    state ベース {
        position: -1
        isFinished: false
    }
    
    ベース --> スタート: 6(またはany) && スタート空き
    
    state スタート {
        position: START_POSITIONS[color]
        isFinished: false
    }
    
    スタート --> メインパス: 移動
    
    state メインパス {
        position: 0-39
        isFinished: false
        
        [*] --> 通常マス
        通常マス --> 捕獲される: 敵トークン来訪
    }
    
    メインパス --> ホームパス入口: 1周完了
    メインパス --> ベース: 捕獲される
    
    state ホームパス入口 {
        position: 1000
        isFinished: false
    }
    
    ホームパス入口 --> ホームパス中: 移動
    
    state ホームパス中 {
        position: 1001-1002
        isFinished: false
    }
    
    ホームパス中 --> ゴール: position==1003
    
    state ゴール {
        position: 1003
        isFinished: true
    }
    
    ゴール --> [*]
```

**状態プロパティ詳細**:

| 状態 | position | isFinished | 説明 |
|------|----------|-----------|------|
| ベース | -1 | false | 初期位置、捕獲後の戻り先 |
| スタート | 0, 10, 20, 30 | false | 各色のスタートマス |
| メインパス | 0-39 | false | 円形通路上 |
| ホームパス入口 | 1000 | false | ゴール手前の専用通路入口 |
| ホームパス中 | 1001-1002 | false | ゴール手前の専用通路 |
| ゴール | 1003 | true | 最終到達地点 |

**遷移条件**:

```
ベース → スタート:
  - diceValue == 6 (requireSixToStartがtrue)
  - または任意の目 (requireSixToStartがfalse)
  - かつ START_POSITIONSに自分の他トークンなし

スタート/メインパス → ベース:
  - 敵トークンが同じpositionに移動（捕獲）

メインパス → ホームパス:
  - 相対位置 >= PATH_LENGTH
  - かつ excessSteps < HOME_PATH_LENGTH

ホームパス → ゴール:
  - position == 1003に到達
  - isFinished = trueに変更
```

---

### 4.4 UI状態遷移

```mermaid
stateDiagram-v2
    [*] --> 設定UI表示
    
    state 設定UI表示 {
        #gameSetup: display block
        #gameContainer: display none
        
        [*] --> 人数ボタン群
        人数ボタン群 --> プレイヤー設定欄
        プレイヤー設定欄 --> ルール設定
        ルール設定 --> スタートボタン
    }
    
    設定UI表示 --> ゲームUI表示: startGame()
    
    state ゲームUI表示 {
        #gameSetup: display none
        #gameContainer: display block
        
        [*] --> ボード描画
        ボード描画 --> トークン配置
        トークン配置 --> ステータス表示
        ステータス表示 --> サイコロ表示
        サイコロ表示 --> ログ表示
    }
    
    state ゲームUI表示 {
        state "サイコロボタン" as dice_btn
        state "トークン要素" as tokens
        state "ステータス" as status
        
        dice_btn --> アニメーション: click / auto
        アニメーション --> 値表示: 500ms
        値表示 --> 待機
        
        tokens --> ハイライト: movable
        ハイライト --> 通常: moved
        
        status --> 更新: nextTurn()
    }
    
    ゲームUI表示 --> モーダル表示: checkWin() && 全員ゴール
    
    state モーダル表示 {
        #winModal: show
        
        [*] --> 順位表示
        順位表示 --> ボタン表示
    }
    
    モーダル表示 --> 設定UI表示: resetGame()
    モーダル表示 --> [*]: closeWinModal()
```

---

### 4.5 プレイヤータイプ別フロー状態

```mermaid
stateDiagram-v2
    [*] --> ターン開始
    
    ターン開始 --> タイプ判定
    
    state タイプ判定 <<choice>>
    タイプ判定 --> Humanフロー: type == 'human'
    タイプ判定 --> AI1フロー: type == 'ai1'
    タイプ判定 --> AI2フロー: type == 'ai2'
    タイプ判定 --> AI3フロー: type == 'ai3'
    
    state Humanフロー {
        [*] --> ボタン活性化
        ボタン活性化 --> ユーザー操作待機
        ユーザー操作待機 --> サイコロクリック
        サイコロクリック --> 移動可能判定
        移動可能判定 --> トークンクリック待機: 1個以上
        移動可能判定 --> 自動次ターン: 0個
        トークンクリック待機 --> トークン選択
        トークン選択 --> [*]
    }
    
    state AI1フロー {
        [*] --> 思考時間表示
        思考時間表示 --> 自動サイコロ
        自動サイコロ --> 移動可能判定
        移動可能判定 --> ランダム選択: 1個以上
        移動可能判定 --> 自動次ターン: 0個
        ランダム選択 --> [*]
    }
    
    state AI2フロー {
        [*] --> 思考時間表示
        思考時間表示 --> 自動サイコロ
        自動サイコロ --> 移動可能判定
        移動可能判定 --> 貪欲選択: 1個以上
        移動可能判定 --> 自動次ターン: 0個
        貪欲選択 --> 捕獲優先判定
        捕獲優先判定 --> [*]
    }
    
    state AI3フロー {
        [*] --> 思考時間表示
        思考時間表示 --> 自動サイコロ
        自動サイコロ --> 移動可能判定
        移動可能判定 --> 評価関数計算: 1個以上
        移動可能判定 --> 自動次ターン: 0個
        評価関数計算 --> スコア比較
        スコア比較 --> 最適選択
        最適選択 --> [*]
    }
    
    Humanフロー --> トークン移動
    AI1フロー --> トークン移動
    AI2フロー --> トークン移動
    AI3フロー --> トークン移動
    
    トークン移動 --> [*]
```

---

### 4.6 エラー状態と回復フロー

```mermaid
stateDiagram-v2
    [*] --> 正常動作
    
    state 正常動作 {
        [*] --> 処理実行
        処理実行 --> 検証
        検証 --> [*]: OK
    }
    
    正常動作 --> エラー検出: 異常検出
    
    state エラー検出 {
        [*] --> エラータイプ判定
        
        state エラータイプ判定 <<choice>>
        エラータイプ判定 --> 無効クリック: 移動不可トークン
        エラータイプ判定 --> 二重サイコロ: isRolled==true
        エラータイプ判定 --> CPUターン割込: type!=human
        エラータイプ判定 --> ゲーム終了済: allFinished
        
        state 無効クリック {
            [*] --> 無視
            無視 --> [*]
        }
        
        state 二重サイコロ {
            [*] --> 早期リターン
            早期リターン --> [*]
        }
        
        state CPUターン割込 {
            [*] --> 早期リターン
            早期リターン --> [*]
        }
        
        state ゲーム終了済 {
            [*] --> 処理中断
            処理中断 --> [*]
        }
    }
    
    エラー検出 --> 正常動作: 状態維持
```

**エラー防止メカニズム**:

| エラータイプ | 検出場所 | 対策 | 回復方法 |
|------------|---------|------|---------|
| 二重サイコロ | `rollDice()` | `isRolled`フラグチェック | 早期return |
| CPUターン割込 | `rollDice()` | プレイヤータイプチェック | 早期return |
| 移動不可トークン | `moveToken()` | `movableTokens`配列照合 | イベント非設定 |
| ゲーム終了後操作 | 各関数冒頭 | 全員ゴール判定 | 早期return |
| 無効座標 | `getPathPosition()` | 範囲チェック | デフォルト座標返却 |

---

## 5. UI/UX設計

### 5.1 画面レイアウト構成

```
┌──────────────────────────────────────────┐
│            ゲームタイトル                 │
│             LUDO GAME                    │
├──────────────────────────────────────────┤
│  設定画面 (#gameSetup)                   │
│  ┌────────────────────────────────┐     │
│  │ プレイヤー人数選択              │     │
│  │ [2人] [3人] [4人*]             │     │
│  ├────────────────────────────────┤     │
│  │ プレイヤー設定                  │     │
│  │ 🔴赤  [プレイヤー▼]           │     │
│  │ 🔵青  [CPU Lv1▼]              │     │
│  │ 🟡黄  [CPU Lv2▼]              │     │
│  │ 🟢緑  [CPU Lv3▼]              │     │
│  ├────────────────────────────────┤     │
│  │ ルール設定                      │     │
│  │ ☑ 6で出発                     │     │
│  │ ☑ 6で追加ターン                │     │
│  │ ☑ ゴールに正確な目が必要        │     │
│  │ ☑ CPU思考時間表示              │     │
│  │ ☐ デバッグモード                │     │
│  ├────────────────────────────────┤     │
│  │        [ゲーム開始]             │     │
│  └────────────────────────────────┘     │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  ゲーム画面 (#gameContainer)             │
│  ┌────────┬──────────┬────────┐         │
│  │ステータス│ ボード   │ ログ   │         │
│  │        │          │        │         │
│  │現在:赤  │ 11x11    │移動履歴│         │
│  │        │ グリッド  │        │         │
│  │サイコロ │          │        │         │
│  │  [?]   │  🔴🔵   │        │         │
│  │        │  🟡🟢   │        │         │
│  │スコア   │          │        │         │
│  │赤: 0/4 │          │        │         │
│  │青: 0/4 │          │        │         │
│  │黄: 0/4 │          │        │         │
│  │緑: 0/4 │          │        │         │
│  │        │          │        │         │
│  │[戻る]  │          │[クリア]│         │
│  └────────┴──────────┴────────┘         │
└──────────────────────────────────────────┘
```

---

### 5.2 DOM構造

#### 5.2.1 設定画面構造

```html
<div id="gameSetup">
  <h2>プレイヤー人数を選択</h2>
  <div class="player-count-buttons">
    <button class="setup-button" onclick="setPlayerCount(2)">2人</button>
    <button class="setup-button" onclick="setPlayerCount(3)">3人</button>
    <button class="setup-button active" onclick="setPlayerCount(4)">4人</button>
  </div>
  
  <h3>プレイヤー設定</h3>
  <div id="playerSetup">
    <!-- 動的生成 -->
    <div class="player-config">
      <div class="player-color-indicator" style="background-color: #色"></div>
      <label>赤</label>
      <select id="player-0-type">
        <option value="human">プレイヤー</option>
        <option value="ai1">CPU レベル1</option>
        <option value="ai2">CPU レベル2</option>
        <option value="ai3">CPU レベル3</option>
      </select>
    </div>
    <!-- 以下同様に生成 -->
  </div>
  
  <h3>ルール設定</h3>
  <div class="settings-group">
    <label>
      <input type="checkbox" id="requireSixToStart" checked>
      ベースからコマを出すのに6が必要
    </label>
    <label>
      <input type="checkbox" id="extraTurnOnSix" checked>
      6が出たら追加ターン
    </label>
    <label>
      <input type="checkbox" id="exactRollToFinish" checked>
      ゴールにぴったりの目が必要
    </label>
    <label>
      <input type="checkbox" id="cpuThinkingTime" checked>
      CPUの思考時間を表示
    </label>
    <label>
      <input type="checkbox" id="debugMode">
      デバッグモード（3コマゴール済み）
    </label>
  </div>
  
  <button class="start-button" onclick="startGame()">ゲーム開始</button>
</div>
```

#### 5.2.2 ゲーム画面構造

```html
<div id="gameContainer" style="display: none;">
  <div class="game-layout">
    <!-- 左パネル: ステータス -->
    <div class="left-panel">
      <div class="status-section">
        <h3>現在のターン</h3>
        <div id="currentPlayerText" style="color: #色">赤のターン</div>
      </div>
      
      <div class="dice-section">
        <h3>サイコロ</h3>
        <div id="diceDisplay" class="dice">?</div>
        <button id="rollButton" onclick="rollDice()">振る</button>
      </div>
      
      <div class="score-section">
        <h3>スコア</h3>
        <div id="playerScores">
          <div class="player-score" style="background-color: #色">
            赤: 0/4
          </div>
          <!-- 以下同様 -->
        </div>
      </div>
      
      <button class="back-button" onclick="backToSetup()">設定に戻る</button>
    </div>
    
    <!-- 中央パネル: ボード -->
    <div class="center-panel">
      <div id="ludoBoard" class="ludo-board">
        <!-- 動的生成: 11x11グリッド -->
        <div class="board-cell" data-row="0" data-col="0">
          <!-- ベースエリアまたはパスセル -->
        </div>
        <!-- ...121個のセル -->
        
        <!-- トークンは各セル内に動的追加 -->
        <div class="token red" data-color="red" data-id="0">1</div>
      </div>
    </div>
    
    <!-- 右パネル: ログ -->
    <div class="right-panel">
      <h3>ゲームログ</h3>
      <button onclick="document.getElementById('logContent').innerHTML=''">
        クリア
      </button>
      <div id="logContent" class="log-container">
        <div class="log-entry">ゲーム開始</div>
        <!-- 新しいログが上に追加される -->
      </div>
    </div>
  </div>
</div>
```

#### 5.2.3 モーダル構造

```html
<div id="winModal" class="modal">
  <div class="modal-content">
    <div id="winnerInfo">
      <h3>🏆 最終順位 🏆</h3>
      <div>
        <p>🥇 1位: 赤 (プレイヤー)</p>
        <p>🥈 2位: 青 (CPU Lv2)</p>
        <p>🥉 3位: 黄 (CPU Lv1)</p>
        <p>🏅 4位: 緑 (CPU Lv3)</p>
      </div>
    </div>
    <div class="modal-buttons">
      <button onclick="resetGame()">もう一度</button>
      <button onclick="closeWinModal()">閉じる</button>
    </div>
  </div>
</div>
```

---

### 5.3 CSSクラス定義

#### 5.3.1 ボードセルクラス

| クラス名 | 用途 | スタイル概要 |
|---------|------|------------|
| `.board-cell` | 基本セル | グリッドアイテム、境界線 |
| `.base-area` | ベースエリア | 大きな正方形、色付き背景 |
| `.base-container` | ベースコンテナ | Grid統合セル（4×4） |
| `.base-slots` | スロット親要素 | 2×2グリッドレイアウト |
| `.slot-circle` | トークンスロット | 円形、枠線 |
| `.path` | 通常パス | 白背景、境界線 |
| `.start` | スタートマス | 色付き背景、絵文字表示 |
| `.home-path` | ホームパス | 半透明色背景 |
| `.red`, `.blue`, `.yellow`, `.green` | 色修飾子 | 各色に対応した背景色 |

#### 5.3.2 トークンクラス

| クラス名 | 用途 | スタイル概要 |
|---------|------|------------|
| `.token` | 基本トークン | 円形、影付き、数字表示 |
| `.token.red` | 赤トークン | 赤背景 |
| `.token.blue` | 青トークン | 青背景 |
| `.token.yellow` | 黄トークン | 黄背景 |
| `.token.green` | 緑トークン | 緑背景 |
| `.token.movable` | 移動可能 | カーソル:pointer、拡大アニメ |
| `.token.finished` | ゴール済み | 透明度50%、王冠アイコン |

#### 5.3.3 サイコロクラス

| クラス名 | 用途 | スタイル概要 |
|---------|------|------------|
| `.dice` | サイコロ表示 | 大きなフォント、境界線 |
| `.dice.rolling` | アニメーション中 | 回転アニメーション(0.5秒) |

#### 5.3.4 モーダルクラス

| クラス名 | 用途 | スタイル概要 |
|---------|------|------------|
| `.modal` | モーダル背景 | 全画面オーバーレイ、非表示 |
| `.modal.show` | 表示状態 | display: flex |
| `.modal-content` | モーダル本体 | 中央配置、白背景、角丸 |

---

### 5.4 イベントハンドラ割り当て

#### 5.4.1 静的イベント（HTML属性）

| 要素 | イベント | ハンドラ | 説明 |
|-----|---------|---------|------|
| 人数ボタン | onclick | `setPlayerCount(n)` | プレイヤー人数選択 |
| ゲーム開始ボタン | onclick | `startGame()` | ゲーム開始 |
| サイコロボタン | onclick | `rollDice()` | サイコロを振る（人間のみ） |
| 戻るボタン | onclick | `backToSetup()` | 設定画面に戻る |
| ログクリアボタン | onclick | `logContent.innerHTML=''` | ログクリア |
| もう一度ボタン | onclick | `resetGame()` | ゲームリセット |
| 閉じるボタン | onclick | `closeWinModal()` | モーダルを閉じる |

#### 5.4.2 動的イベント（JavaScript生成）

| 要素 | イベント | ハンドラ | 生成タイミング | 条件 |
|-----|---------|---------|--------------|-----|
| トークン要素 | onclick | `moveToken(color, id)` | `renderTokens()` | `movable`クラス付与時 |

**トークンイベント設定ロジック**:
```javascript
if (gameState.movableTokens.some(t => t.color === color && t.id === index)) {
    tokenEl.classList.add('movable');
    tokenEl.onclick = async () => await moveToken(color, index);
}
```

---

### 5.5 アニメーション仕様

#### 5.5.1 サイコロアニメーション

```css
@keyframes diceRoll {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(90deg); }
    50% { transform: rotate(180deg); }
    75% { transform: rotate(270deg); }
}

.dice.rolling {
    animation: diceRoll 0.5s linear;
}
```

**タイミング**:
1. `rolling`クラス追加（0ms）
2. アニメーション実行（500ms）
3. `rolling`クラス削除、結果表示（500ms）

#### 5.5.2 トークン移動アニメーション

**実装方法**: 段階的レンダリング
```javascript
for (let i = 1; i <= diceValue; i++) {
    token.position = 新位置;
    renderTokens();      // 再描画
    await delay(300);    // 300ms待機
}
```

**視覚効果**:
- 1マスごとに300ms間隔で移動
- 滑らかな視覚的フィードバック
- サイコロの目が6の場合、1.8秒（6×300ms）

#### 5.5.3 UI遷移アニメーション

| 遷移 | タイミング | エフェクト |
|-----|----------|-----------|
| 設定→ゲーム | `startGame()` | フェードイン |
| 思考中表示 | CPU思考時 | opacity 0.6、テキスト点滅 |
| 移動可能強調 | サイコロ後 | トークン拡大(scale 1.1)、影強調 |
| モーダル表示 | ゲーム終了 | 背景フェードイン、コンテンツスライドイン |

---

### 5.6 レスポンシブ対応

#### 5.6.1 ブレークポイント

| デバイス | 画面幅 | レイアウト変更 |
|---------|-------|--------------|
| PC | > 1024px | 3カラムレイアウト（ステータス-ボード-ログ） |
| タブレット | 768px - 1024px | 2カラムレイアウト（ボード上、ステータス+ログ下） |
| スマートフォン | < 768px | 1カラムレイアウト（縦積み） |

#### 5.6.2 タッチデバイス対応

```javascript
// タッチイベント対応
tokenEl.onclick = async () => await moveToken(color, index);
// モバイルでもclickイベントで動作

// ホバー効果の代替
.token.movable {
    transform: scale(1.1);  // 常時拡大表示
}
```

---

## 6. 座標・位置計算

### 6.1 座標系定義

#### 6.1.1 ボード座標系（Grid座標）

```
     col: 0  1  2  3  4  5  6  7  8  9 10
row:0  [赤ベース---------] □ [青ベース---------]
    1  [                ] ⬇ [                ]
    2  [                ] ⬇ [                ]
    3  [                ] ⬇ [                ]
    4  ➡ □ □ □ ← ← ⬅ ← □ □ □
    5  □ ← ← ← ← 🏠 → → → → □
    6  □ □ □ □ ⬇ ⬇ ⬇ □ □ □ ⬅
    7  [緑ベース---------] ⬇ [黄ベース---------]
    8  [                ] ⬇ [                ]
    9  [                ] ⬇ [                ]
   10  □ □ □ ⬆ ⬆ ➡ ⬆ □ □ □ □
```

- **原点**: 左上 `(row=0, col=0)`
- **範囲**: `row: 0-10`, `col: 0-10`
- **使用目的**: DOM要素の配置、CSS Grid

#### 6.1.2 パス座標系（論理座標）

```
パス位置 0-39: メインパス（円形通路）
  - 位置 0: 赤スタート (row=4, col=0)
  - 位置10: 青スタート (row=0, col=6)
  - 位置20: 黄スタート (row=6, col=10)
  - 位置30: 緑スタート (row=10, col=4)

パス位置1000-1003: ホームパス（各色専用）
  - 1000: ホームパス入口
  - 1001: ホームパス中間1
  - 1002: ホームパス中間2
  - 1003: ゴール

パス位置 -1: ベース（出発前）
```

---

### 6.2 座標変換関数

#### 6.2.1 `getPathPosition(position)` - パス→ボード変換

**入力**: パス座標（0-39）  
**出力**: ボード座標 `{row: number, col: number}`

**変換テーブル**:
```javascript
const path = [
    // 位置0-9: 赤スタート
    { row: 4, col: 0 },   // 0: 赤スタート ➡
    { row: 4, col: 1 },   // 1
    { row: 4, col: 2 },   // 2
    { row: 4, col: 3 },   // 3
    { row: 4, col: 4 },   // 4
    { row: 3, col: 4 },   // 5: ↑
    { row: 2, col: 4 },   // 6: ↑
    { row: 1, col: 4 },   // 7: ↑
    { row: 0, col: 4 },   // 8: ↑
    { row: 0, col: 5 },   // 9: →
    
    // 位置10-19: 青スタート
    { row: 0, col: 6 },   // 10: 青スタート ⬇
    { row: 1, col: 6 },   // 11: ↓
    // ... 続く
    
    // 位置20-29: 黄スタート
    { row: 6, col: 10 },  // 20: 黄スタート ⬅
    // ... 続く
    
    // 位置30-39: 緑スタート
    { row: 10, col: 4 },  // 30: 緑スタート ⬆
    // ... 続く
];

return path[position] || { row: 5, col: 5 };  // デフォルトは中央
```

#### 6.2.2 `getHomePathPosition(color, homePathIndex)` - ホームパス座標

**入力**: 
- `color`: 'red', 'blue', 'yellow', 'green'
- `homePathIndex`: 0-3

**出力**: ボード座標 `{row: number, col: number}`

**変換ロジック**:
```javascript
const homePathCoords = {
    red: [
        { row: 5, col: 1 },  // 0: 入口
        { row: 5, col: 2 },  // 1
        { row: 5, col: 3 },  // 2
        { row: 5, col: 4 }   // 3: ゴール
    ],
    blue: [
        { row: 1, col: 5 },  // 0: 入口
        { row: 2, col: 5 },  // 1
        { row: 3, col: 5 },  // 2
        { row: 4, col: 5 }   // 3: ゴール
    ],
    yellow: [
        { row: 5, col: 9 },  // 0: 入口
        { row: 5, col: 8 },  // 1
        { row: 5, col: 7 },  // 2
        { row: 5, col: 6 }   // 3: ゴール
    ],
    green: [
        { row: 9, col: 5 },  // 0: 入口
        { row: 8, col: 5 },  // 1
        { row: 7, col: 5 },  // 2
        { row: 6, col: 5 }   // 3: ゴール
    ]
};

return homePathCoords[color][homePathIndex];
```

#### 6.2.3 `getTokenDOMPosition(color, token)` - トークン位置計算

**入力**:
- `color`: プレイヤー色
- `token`: TokenObjectフ

**処理フロー**:
```javascript
if (token.position === -1) {
    // ベースエリア内のスロットに配置
    return null;  // ベースエリアはCSS Gridで管理
}
else if (token.position >= 1000 && token.position <= 1003) {
    // ホームパス
    const homeIndex = token.position - 1000;
    return getHomePathPosition(color, homeIndex);
}
else if (token.position >= 0 && token.position < PATH_LENGTH) {
    // メインパス
    return getPathPosition(token.position);
}
else {
    // 無効な位置
    console.error('Invalid position:', token.position);
    return { row: 5, col: 5 };  // デフォルト
}
```

---

### 6.3 位置計算アルゴリズム

#### 6.3.1 相対位置から絶対位置への変換

**目的**: 各プレイヤーの視点で0から始まる位置を、パス配列の絶対位置に変換

**計算式**:
```javascript
const startPos = START_POSITIONS[color];
const relativePos = (position - startPos + PATH_LENGTH) % PATH_LENGTH;
```

**例（赤プレイヤー）**:
```
startPos = 0
position = 5 → relativePos = (5 - 0 + 40) % 40 = 5
position = 38 → relativePos = (38 - 0 + 40) % 40 = 38
```

**例（青プレイヤー）**:
```
startPos = 10
position = 15 → relativePos = (15 - 10 + 40) % 40 = 5
position = 5 → relativePos = (5 - 10 + 40) % 40 = 35
```

#### 6.3.2 移動後の新位置計算

**通常移動**:
```javascript
const newRelativePos = relativePos + diceValue;
const newAbsolutePos = (startPos + newRelativePos) % PATH_LENGTH;
```

**ホームパス進入判定**:
```javascript
if (newRelativePos >= PATH_LENGTH) {
    const excessSteps = newRelativePos - PATH_LENGTH;
    if (excessSteps < HOME_PATH_LENGTH) {
        // ホームパスへ
        const newPosition = 1000 + excessSteps;
    }
}
```

**例（赤、相対位置38、サイコロ4）**:
```
newRelativePos = 38 + 4 = 42
excessSteps = 42 - 40 = 2
newPosition = 1000 + 2 = 1002（ホームパス中間2）
```

---

## 7. ルールエンジン

### 7.1 移動可能判定条件

#### 7.1.1 ベースからの出発条件

```javascript
// 条件1: サイコロの目
const canLeaveBase = (diceValue === 6) || (!settings.requireSixToStart);

// 条件2: スタート位置の空き確認
const startPos = START_POSITIONS[color];
const isStartOccupied = tokens.some((t, idx) => 
    idx !== tokenId && t.position === startPos && !t.isFinished
);

// 総合判定
const canMove = canLeaveBase && !isStartOccupied;
```

**判定表**:
| requireSixToStart | diceValue | スタート占有 | 結果 |
|------------------|-----------|------------|------|
| true | 6 | No | ✓ 移動可能 |
| true | 6 | Yes | ✗ 移動不可 |
| true | 1-5 | - | ✗ 移動不可 |
| false | 1-6 | No | ✓ 移動可能 |
| false | 1-6 | Yes | ✗ 移動不可 |

#### 7.1.2 ホームパス内移動条件

```javascript
const homePos = token.position - 1000;  // 0-3
const newHomePos = homePos + diceValue;

// exactRollToFinishルール
if (settings.exactRollToFinish) {
    // ぴったりゴールできるか
    canMove = (newHomePos === HOME_PATH_LENGTH);  // === 4
} else {
    // 超過してもOK
    canMove = (newHomePos >= HOME_PATH_LENGTH);  // >= 4
}

// 移動先の占有確認（ゴールでない場合）
if (canMove && newHomePos < HOME_PATH_LENGTH) {
    const targetHomePos = 1000 + newHomePos;
    const isOccupied = tokens.some((t, idx) => 
        idx !== tokenId && t.position === targetHomePos
    );
    canMove = !isOccupied;
}
```

**判定表（exactRollToFinish = true）**:
| 現在位置 | diceValue | 新位置 | 結果 |
|---------|-----------|-------|------|
| 1000 | 4 | 1004 | ✓ ゴール |
| 1001 | 3 | 1004 | ✓ ゴール |
| 1002 | 2 | 1004 | ✓ ゴール |
| 1003 | 1 | 1004 | ✓ ゴール |
| 1000 | 3 | 1003 | ✓ 移動可能 |
| 1000 | 5 | 1005 | ✗ オーバー |

#### 7.1.3 メインパス移動条件

```javascript
// 相対位置計算
const startPos = START_POSITIONS[color];
const relativePos = (token.position - startPos + PATH_LENGTH) % PATH_LENGTH;
const newRelativePos = relativePos + diceValue;

if (newRelativePos >= PATH_LENGTH) {
    // ホームパス進入の場合
    const excessSteps = newRelativePos - PATH_LENGTH;
    canMove = (excessSteps < HOME_PATH_LENGTH);
    
    if (canMove && settings.exactRollToFinish && excessSteps === HOME_PATH_LENGTH - 1) {
        // ゴール直前の場合、ぴったり判定
        canMove = (diceValue === (PATH_LENGTH - relativePos + HOME_PATH_LENGTH));
    }
} else {
    // 通常移動
    const targetPos = (startPos + newRelativePos) % PATH_LENGTH;
    const isOccupied = tokens.some((t, idx) => 
        idx !== tokenId && t.position === targetPos && !t.isFinished
    );
    canMove = !isOccupied;
}
```

---

### 7.2 追加ターン処理

#### 7.2.1 6の目の追加ターン

```javascript
if (gameState.diceValue === 6 && gameState.settings.extraTurnOnSix) {
    addLog(`${COLOR_NAMES[color]}は6を出したので追加ターン！`);
    gameState.isRolled = false;  // 再度サイコロを振れるようにする
    updateStatus();
    
    if (getCurrentPlayer().type !== 'human') {
        setTimeout(aiTurn, 1000);  // CPUは1秒後に自動実行
    }
    // 人間の場合はボタン待機
} else {
    nextTurn();  // 通常の次ターンへ
}
```

**フロー**:
```
サイコロ: 6
  ↓
extraTurnOnSix?
  ↓ true
isRolled = false
  ↓
updateStatus()
  ↓
┌────────────┐
│プレイヤー? │
└────┬───────┘
  ┌──┴──┐
  ↓     ↓
Human  CPU
  ↓     ↓
待機  1秒後aiTurn()
```

---

### 7.3 パス処理

#### 7.3.1 自動パス条件

```javascript
// 全トークンがベースにいる
const tokensInBase = tokens.filter(t => t.position === -1 && !t.isFinished);
const tokensOnBoard = tokens.filter(t => t.position !== -1 && !t.isFinished);

if (tokensOnBoard.length === 0 && tokensInBase.length > 0) {
    if (settings.requireSixToStart) {
        // スタート位置が自分のトークンで埋まっている
        const startPos = START_POSITIONS[color];
        const hasOwnTokenAtStart = tokens.some(t => 
            t.position === startPos && !t.isFinished
        );
        
        if (hasOwnTokenAtStart) {
            addLog(`${COLOR_NAMES[color]}は動かせるトークンがないため自動パス`);
            nextTurn();
            return;
        }
    }
}
```

**自動パス条件**:
1. ボード上にトークンが0個
2. ベースにトークンが1個以上
3. `requireSixToStart === true`
4. スタート位置に自分の他のトークンがいる

**理由**: この状態では、6を出してもトークンを出せないため

---

## 8. エラーハンドリング

### 8.1 エラー検出機構

| エラー種別 | 検出箇所 | 検出方法 | 処理 |
|-----------|---------|---------|------|
| 二重サイコロ | `rollDice()` | `isRolled`フラグ | 早期return |
| CPUターン割込 | `rollDice()` | プレイヤータイプチェック | 早期return |
| 無効トークンクリック | `moveToken()` | `movableTokens`照合 | イベント未登録 |
| ゲーム終了後操作 | 各関数 | 全員ゴール判定 | 早期return |
| 無効座標 | `getPathPosition()` | 範囲チェック | デフォルト座標 |
| ホームパスオーバー | `moveToken()` | excessSteps判定 | ログ出力、ターン終了 |

---

### 8.2 デバッグ機能

#### 8.2.1 デバッグモード

**有効化**: 設定画面の「デバッグモード」チェックボックス

**効果**:
```javascript
if (debugMode) {
    // 各プレイヤーの最初の3トークンをゴール済みに
    for (j = 0; j < 3; j++) {
        tokens[j] = {
            id: j,
            position: 1003,      // ゴール位置
            isFinished: true
        };
    }
    
    // 4番目のトークンはベース
    tokens[3] = {
        id: 3,
        position: -1,
        isFinished: false
    };
    
    console.log('🔧 デバッグモード: 各プレイヤーの3コマがゴール済みでスタート');
}
```

**用途**:
- ゴール処理のテスト
- 順位決定ロジックの検証
- 勝利モーダルの動作確認

#### 8.2.2 コンソールログ

**重要ログポイント**:
```javascript
// ゲーム開始
console.log('ゲーム開始', gameState);

// トークン移動
console.log(`${COLOR_NAMES[color]}のトークン${tokenId + 1}: ステップ${i}/${steps}, 相対位置=${relativePos}`);

// ホームパス進入
console.log(`ホームパス進入: excessSteps=${excessSteps}`);

// 捕獲
console.log(`${COLOR_NAMES[capturedColor]}のトークン${capturedToken.id + 1}を捕獲！`);

// ゴール
console.log(`${COLOR_NAMES[color]}のトークン${tokenId + 1}がゴール！`);
```

---

## 9. パフォーマンス・制約事項

### 9.1 描画最適化

#### 9.1.1 再描画戦略

**全体再描画が必要な場合**:
- `renderBoard()`: ゲーム開始時のみ
- `renderTokens()`: トークン状態変更時

**部分更新**:
- サイコロ表示: `diceDisplay.textContent = value`
- ステータス: `updateStatus()`で必要部分のみ

**最適化手法**:
```javascript
// ❌ 非効率: トークンごとに個別描画
tokens.forEach(token => {
    renderSingleToken(token);
});

// ✓ 効率的: 一括クリア→一括描画
document.querySelectorAll('.token').forEach(t => t.remove());
// 全トークンを一度に生成
```

---

### 9.2 タイムアウト設定

| 処理 | タイムアウト | 理由 |
|-----|------------|------|
| サイコロアニメーション | 500ms | 視覚的フィードバック |
| トークン移動（1マス） | 300ms | 移動の視認性 |
| 移動不可時の次ターン | 1500ms | ユーザーへの通知時間 |
| CPU思考表示 | 600-1800ms | リアルな思考演出 |
| CPU移動決定 | 500-1500ms | 自然な間 |
| CPUターン開始 | 1000ms | 前の処理完了待ち |
| 勝利モーダル表示 | 800ms | 最終アニメーション待ち |

---

### 9.3 ブラウザ互換性

#### 9.3.1 対応ブラウザ

| ブラウザ | 最小バージョン | 主要機能 |
|---------|--------------|---------|
| Chrome | 90+ | CSS Grid, async/await, ES6 |
| Firefox | 88+ | CSS Grid, async/await, ES6 |
| Safari | 14+ | CSS Grid, async/await, ES6 |
| Edge | 90+ | CSS Grid, async/await, ES6 |

#### 9.3.2 必要機能

- **CSS Grid**: ボードレイアウト
- **async/await**: トークン移動アニメーション
- **ES6 Arrow Functions**: イベントハンドラ
- **Template Literals**: HTML生成
- **Array Methods**: `forEach`, `filter`, `some`, `every`
- **Promise**: `delay()`関数

---

## 10. 多言語対応

### 10.1 i18n連携

**実装方法**: `i18n.js`との統合

**翻訳キー**:
```javascript
// HTMLでのデータ属性使用
<h2 data-i18n="games.ludo.title">ルドー</h2>
<button data-i18n="games.ludo.startGame">ゲーム開始</button>
```

**動的テキスト**: `COLOR_NAMES`オブジェクトで管理
```javascript
const COLOR_NAMES = { 
    red: '赤',    // ja: '赤', en: 'Red'
    blue: '青',   // ja: '青', en: 'Blue'
    yellow: '黄', // ja: '黄', en: 'Yellow'
    green: '緑'   // ja: '緑', en: 'Green'
};
```

---

## 11. 将来拡張可能性

### 11.1 オンライン対戦

**必要な変更**:
1. WebSocket通信層の追加
2. サーバーサイド状態管理
3. ターン同期メカニズム
4. 切断時の再接続処理

### 11.2 リプレイ機能

**実装方針**:
```javascript
// ターンごとに行動を記録
const gameHistory = [];

function recordAction(action) {
    gameHistory.push({
        turn: gameState.turnCount,
        player: gameState.currentPlayerIndex,
        action: action,  // 'roll', 'move'
        data: { diceValue, tokenId, ... }
    });
}
```

### 11.3 統計情報

**追跡データ**:
- 総プレイ回数
- 勝率（色別、タイプ別）
- 平均ターン数
- 捕獲数

---

## まとめ

本詳細設計書は、ルドーゲーム（ludo.js）の実装における全ての変数、データ構造、処理ロジック、アルゴリズムを網羅的に定義しました。

**主要ポイント**:
1. **データ構造**: 13プロパティを持つ`gameState`オブジェクトが全状態を管理
2. **座標系**: パス座標（論理）とボード座標（物理）の2系統
3. **AI**: レベル1-3の異なる戦略アルゴリズム
4. **状態管理**: 明確な状態遷移と条件分岐
5. **UI/UX**: レスポンシブ対応と段階的アニメーション

この仕様書により、コードの保守性、拡張性、および新規開発者のオンボーディングが大幅に向上します。
