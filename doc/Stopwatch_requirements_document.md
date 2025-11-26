# ストップウォッチゲーム 実装仕様書

## ドキュメント管理

### 変更履歴
| バージョン | 日付 | 変更内容 |
|:---:|:---|:---|
| v1.0 | 2025/11/26 | 初版作成 |
| v2.0 | 2025/11/26 | 誤差ランク判定機能を追加 |
| v3.0 | 2025/11/26 | 仕様の体系化・詳細化 |

### 文書の目的
本仕様書は、Webポータル「GAME PORTAL」に追加する「ストップウォッチゲーム」の実装要件を定義する。GitHub Copilotによる自動生成を前提とし、必要な機能・UI・ロジックを明確化する。


## 1. プロジェクト概要

### 1.1 ゲームコンセプト
- **ジャンル**: タイミングチャレンジゲーム（バカゲー枠）
- **目的**: 指定された目標時間ぴったりでストップウォッチを止め、誤差の少なさを競う
- **特徴**: 
  - 3ターン制（3秒・5秒・10秒）
  - 高精度計測（ミリ秒単位）
  - 誤差ランク判定による達成感演出
  - 短時間プレイ可能（1ゲーム約30秒）

### 1.2 技術要件
- **使用言語**: HTML5, CSS3, JavaScript (ES6+)
- **フレームワーク**: なし（Vanilla JS）
- **ブラウザ要件**: モダンブラウザ（Chrome, Firefox, Safari, Edge 最新版）
- **レスポンシブ対応**: PC・タブレット・スマートフォン
- **外部依存**: なし（スタンドアロン動作）

### 1.3 多言語対応
- 既存ポータルの多言語システム（i18n.js）に統合
- 対応言語: 日本語、英語、中国語、ヒンディー語、スペイン語、フランス語


## 2. ゲーム仕様

### 2.1 基本ルール
1. ゲームは3ターンで構成される
2. 各ターンで異なる目標時間が提示される
   - ターン1: 3.000秒
   - ターン2: 5.000秒
   - ターン3: 10.000秒
3. プレイヤーは「スタート」ボタンでストップウォッチを開始
4. 目標時間に達したと思ったら「ストップ」ボタンを押す
5. 実際の経過時間と目標時間の誤差が計算される
6. 3ターン終了後、合計誤差で総合評価を行う

### 2.2 プレイモード
- **ソロプレイ**: 1人で記録に挑戦
- **ローカル対戦**: 同一端末で交代プレイ（将来拡張）
- **オンライン対戦**: リアルタイム同時プレイ（将来拡張）

### 2.3 勝利条件
- **目標**: 3ターン合計誤差が最小のプレイヤーが勝利
- **最高記録**: 合計誤差0.000秒（理論上の完全プレイ）


## 3. UI/UX設計

### 3.1 画面構成

#### 3.1.1 ゲーム開始画面
- ゲームタイトル
- ルール説明（折りたたみ可能）
- 「ゲーム開始」ボタン
- 言語選択ドロップダウン

#### 3.1.2 メインゲーム画面
**上部エリア**
- ターン進行表示: `ターン 1/3`
- 目標時間表示: `目標: 3.000秒` （大きく強調）

**中央エリア**
- 経過時間表示: `0.000秒` （リアルタイム更新、ストップ時は確定値）
- 状態インジケータ: 待機中 / 計測中 / 停止

**操作エリア**
- 「スタート」ボタン（計測開始）
- 「ストップ」ボタン（計測停止・スタート後に有効化）
- 「リセット」ボタン（全ターンリセット）

**結果表示エリア（各ターン終了後）**
- 記録時間: `3.142秒`
- 誤差: `+0.142秒`
- ランク判定: `B` （色付きバッジ）
- 「次のターンへ」ボタン

#### 3.1.3 最終結果画面
- 総合成績サマリー
  - 各ターンの記録と誤差
  - 合計誤差: `0.324秒`
  - 総合ランク: `A`
- ランク別演出（アニメーション・効果音）
- 「もう一度プレイ」ボタン
- 「ホームに戻る」ボタン

### 3.2 デザイン要件
- **カラーテーマ**: 既存ポータルサイトと統一
- **フォント**: 
  - タイマー表示: モノスペースフォント（Courier New, Consolas）
  - UI: Inter, Noto Sans JP
- **アニメーション**: 
  - ボタンホバーエフェクト
  - ターン切り替えフェード
  - ランク表示時のパーティクルエフェクト（SSS, S）
- **レスポンシブブレークポイント**: 
  - モバイル: ~768px
  - タブレット: 769px~1024px
  - デスクトップ: 1025px~


## 4. ロジック仕様

### 4.1 ゲームフロー

```
開始画面 
  → ゲーム開始
  → ターン1開始（目標3秒）
    → スタート押下（計測開始）
    → ストップ押下（計測停止・誤差計算）
    → 結果表示（ランク判定）
  → ターン2開始（目標5秒）
    → （同上）
  → ターン3開始（目標10秒）
    → （同上）
  → 最終結果表示
  → リプレイ or ホームへ
```

### 4.2 計時処理

#### 4.2.1 タイマー実装
```javascript
let startTime = 0;
let endTime = 0;
let timerInterval = null;

function startTimer() {
  startTime = performance.now();
  timerInterval = setInterval(updateDisplay, 10); // 10ms更新
}

function stopTimer() {
  endTime = performance.now();
  clearInterval(timerInterval);
  calculateError();
}

function updateDisplay() {
  const elapsed = (performance.now() - startTime) / 1000;
  document.getElementById('timer').textContent = elapsed.toFixed(3);
}
```

#### 4.2.2 誤差計算
```javascript
function calculateError() {
  const elapsed = (endTime - startTime) / 1000;
  const target = targetSeconds[currentTurn - 1];
  const error = elapsed - target; // 符号付き誤差
  const absError = Math.abs(error); // 絶対値
  
  return {
    elapsed: elapsed.toFixed(3),
    error: error.toFixed(3),
    absError: absError.toFixed(3),
    rank: getRank(absError)
  };
}


### 4.3 ランク判定システム

#### 4.3.1 ランク定義
| ランク | 誤差範囲 | カラー | 評価 |
|:---:|:---|:---|:---|
| SSS | 0.000 ~ 0.010秒 | ゴールド (#FFD700) | 神業 |
| SS | 0.011 ~ 0.030秒 | シルバー (#C0C0C0) | 超人 |
| S | 0.031 ~ 0.050秒 | ブロンズ (#CD7F32) | 達人 |
| A | 0.051 ~ 0.100秒 | ブルー (#2563EB) | 優秀 |
| B | 0.101 ~ 0.200秒 | グリーン (#10B981) | 良好 |
| C | 0.201 ~ 0.500秒 | イエロー (#F59E0B) | 普通 |
| D | 0.501 ~ 1.000秒 | オレンジ (#F97316) | 要練習 |
| E | 1.001秒以上 | レッド (#EF4444) | ネタ |

#### 4.3.2 ランク判定関数
```javascript
function getRank(absError) {
  if (absError <= 0.010) return 'SSS';
  if (absError <= 0.030) return 'SS';
  if (absError <= 0.050) return 'S';
  if (absError <= 0.100) return 'A';
  if (absError <= 0.200) return 'B';
  if (absError <= 0.500) return 'C';
  if (absError <= 1.000) return 'D';
  return 'E';
}


#### 4.3.3 総合ランク計算
```javascript
function calculateFinalRank(totalAbsError) {
  const avgError = totalAbsError / 3;
  return getRank(avgError);
}
```

### 4.4 データ管理

#### 4.4.1 ゲーム状態
```javascript
const gameState = {
  currentTurn: 1,
  targetSeconds: [3, 5, 10],
  results: [
    { elapsed: 0, error: 0, absError: 0, rank: '' },
    { elapsed: 0, error: 0, absError: 0, rank: '' },
    { elapsed: 0, error: 0, absError: 0, rank: '' }
  ],
  totalAbsError: 0,
  finalRank: ''
};
```

#### 4.4.2 LocalStorage保存
```javascript
// 最高記録の保存
function saveBestRecord(totalAbsError, finalRank) {
  const bestRecord = localStorage.getItem('stopwatch_best');
  if (!bestRecord || totalAbsError < JSON.parse(bestRecord).totalAbsError) {
    localStorage.setItem('stopwatch_best', JSON.stringify({
      totalAbsError,
      finalRank,
      date: new Date().toISOString()
    }));
  }
}
```

## 5. アニメーション・演出

### 5.1 視覚効果

#### 5.1.1 ランク表示演出
- **SSS**: 
  - 背景に金色のパーティクル
  - キラキラアニメーション
  - 虹色グラデーション
- **SS, S**: 
  - メタリック光沢
  - フェードインアニメーション
- **A~C**: 
  - 通常バッジ表示
  - スライドインアニメーション
- **D, E**: 
  - シェイクアニメーション
  - ユーモラスなメッセージ

#### 5.1.2 ボタンフィードバック
- ホバー時: 拡大・影強調
- クリック時: 押し込みエフェクト
- 無効時: グレーアウト・カーソル変更

### 5.2 サウンド効果（オプション）
- スタート音: ピッ（高音）
- ストップ音: ピー（長音）
- ランク表示音: ランクに応じた効果音
  - SSS: ファンファーレ
  - E: ブザー音・笑い声
- BGM: なし（集中を妨げないため）


## 6. 多言語対応

### 6.1 翻訳キー定義
```javascript
const translations = {
  stopwatch: {
    title: 'ストップウォッチチャレンジ',
    subtitle: '目標時間ぴったりで止めろ！',
    rule1: '3ターン制（3秒・5秒・10秒）',
    rule2: 'スタートボタンで計測開始',
    rule3: '目標時間で停止ボタンを押す',
    rule4: '誤差が少ないほど高ランク',
    rule5: '合計誤差で総合評価',
    startGame: 'ゲーム開始',
    turn: 'ターン',
    target: '目標',
    elapsed: '経過時間',
    start: 'スタート',
    stop: 'ストップ',
    reset: 'リセット',
    nextTurn: '次のターンへ',
    result: '結果',
    error: '誤差',
    rank: 'ランク',
    totalError: '合計誤差',
    finalRank: '総合ランク',
    playAgain: 'もう一度プレイ',
    backHome: 'ホームに戻る',
    rankSSS: '神業！',
    rankSS: '超人的！',
    rankS: '達人級！',
    rankA: '優秀！',
    rankB: '良好！',
    rankC: '普通',
    rankD: '要練習',
    rankE: 'ネタレベル'
  }
};
```

### 6.2 各言語の翻訳
- 日本語（ja）: 上記参照
- 英語（en）: Stopwatch Challenge / Hit the exact target time!
- 中国語（zh）: 秒表挑战 / 精准停在目标时间！
- ヒンディー語（hi）: स्टॉपवॉच चुनौती
- スペイン語（es）: Desafío de Cronómetro
- フランス語（fr）: Défi Chronomètre


## 7. パフォーマンス要件

### 7.1 計測精度
- **時刻取得**: `performance.now()` 使用（1ms未満の精度）
- **表示更新**: 10ms間隔（100fps相当）
- **誤差計算**: ミリ秒3桁まで正確に表示

### 7.2 レスポンス要件
- ボタン押下から処理開始まで: 10ms以内
- 画面遷移アニメーション: 300ms以内
- データ保存処理: 50ms以内

### 7.3 ブラウザ互換性
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+


## 8. テスト要件

### 8.1 機能テスト
- [ ] ゲーム開始から終了まで正常に動作
- [ ] 各ターンで正確な時間計測
- [ ] ランク判定が正しく機能
- [ ] 多言語切り替えが正常動作
- [ ] LocalStorage保存・読込が正常

### 8.2 UI/UXテスト
- [ ] 全ボタンが適切に動作
- [ ] レスポンシブデザインが各画面サイズで正常表示
- [ ] アニメーションが滑らか
- [ ] エラーメッセージが適切に表示

### 8.3 パフォーマンステスト
- [ ] タイマー精度が±1ms以内
- [ ] メモリリークなし
- [ ] 連続プレイでパフォーマンス低下なし


## 9. ファイル構成

```
game_potal/
├── stopwatch.html          # メインHTML
├── assets/
│   ├── css/
│   │   └── stopwatch.css   # ゲーム専用CSS
│   ├── js/
│   │   └── stopwatch.js    # ゲームロジック
│   └── images/
│       └── stopwatch/      # ゲーム用画像
├── doc/
│   └── Stopwatch_requirements_document.md
└── index.html              # ポータルトップ（ゲームリンク追加）
```


## 10. 実装優先度

### Phase 1（必須機能）
1. 基本UI構築（HTML/CSS）
2. タイマー計測機能
3. 3ターン制フロー
4. 誤差計算・ランク判定
5. 多言語対応

### Phase 2（拡張機能）
1. アニメーション演出
2. サウンド効果
3. LocalStorage記録保存
4. 最高記録表示

### Phase 3（将来拡張）
1. ローカル対戦モード
2. オンライン対戦
3. カスタムターン設定
4. ランキングシステム


## 11. 補足事項

### 11.1 既存ポータルとの連携
- `index.html` にゲームカードを追加
- `i18n.js` に翻訳キーを統合
- `game-stats.js` でプレイ回数を記録

### 11.2 アクセシビリティ
- キーボード操作対応（Enter=スタート, Space=ストップ）
- スクリーンリーダー対応（aria-label）
- 高コントラストモード対応

### 11.3 セキュリティ
- XSS対策（入力値サニタイズ）
- localStorage容量制限対応


## 付録

### A. 参考UI例
（実装時にワイヤーフレーム添付）

### B. 技術参考資料
- MDN Web Docs: performance.now()
- CSS Animation Guide
- LocalStorage Best Practices


**文書承認**
- 作成者: GitHub Copilot with User
- 承認者: Project Lead
- 最終更新: 2025/11/26
