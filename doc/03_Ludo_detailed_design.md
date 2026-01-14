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

## 次回更新予定

次回は「2. 関数仕様」を追加します。
