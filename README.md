# GAME PORTAL

遊びを通じて新しい体験を創造する - クラシックなボードゲームのコレクション

## 概要

GAME PORTALは、伝統的なボードゲームをブラウザで楽しめるWebアプリケーションです。戦略的思考と創造性を育む5種類のクラシックゲームを提供しています。

## 収録ゲーム

### 1. オセロ
- **タイプ**: 戦略ゲーム
- **プレイヤー**: 2人
- **プレイ時間**: 15-30分
- 白と黒の石を使った戦略ゲーム。相手の石を挟んでひっくり返し、盤面を支配しよう。

### 2. ルドー
- **タイプ**: ボードゲーム
- **プレイヤー**: 2-4人
- **プレイ時間**: 20-40分
- サイコロを振ってコマを進める、運と戦略のボードゲーム。

### 3. チェス
- **タイプ**: 戦略ゲーム
- **プレイヤー**: 2人
- **プレイ時間**: 30-60分
- 世界で最も有名な戦略ボードゲーム。相手のキングをチェックメイトに追い込もう。

### 4. 五目並べ
- **タイプ**: 戦略ゲーム
- **プレイヤー**: 2人
- **プレイ時間**: 10-20分
- 15×15の盤面で5つ並べることを目指す伝統的な戦略ゲーム。

### 5. 神経衰弱
- **タイプ**: 記憶ゲーム
- **プレイヤー**: 1-2人
- **プレイ時間**: 5-15分
- カードをめくってペアを見つける記憶力ゲーム。

## 多言語対応

以下の言語に対応しています:
- 🇯🇵 日本語
- 🇬🇧 英語 (English)
- 🇨🇳 中国語 (中文)
- 🇮🇳 ヒンディー語 (हिन्दी)
- 🇪🇸 スペイン語 (Español)
- 🇫🇷 フランス語 (Français)

## 使い方

### ローカルで実行

1. リポジトリをクローン:
```bash
git clone https://github.com/Ishiuchi/game_potal.git
cd game_potal
```

2. ブラウザで `index.html` を開く

### GitHub Pagesで公開

このプロジェクトはGitHub Pagesで公開されています:

**URL:** https://ishiuchi.github.io/game_potal/

設定方法（参考）:
1. GitHubリポジトリの Settings > Pages に移動
2. Source で `master` ブランチを選択
3. フォルダは `/ (root)` を選択
4. Save をクリック

## プロジェクト構造

```
game_potal/
├── index.html               # メインページ
├── styles.css               # 共通スタイル
├── i18n.js                  # 多言語対応
├── game-stats.js            # ゲーム統計・ランキング
├── game-page.css            # ゲームページ共通スタイル
├── chess.*                  # チェスゲーム
├── gomoku.*                 # 五目並べ
├── ludo.*                   # ルドー
├── memory.*                 # 神経衰弱
├── othello.*                # オセロ
├── images/                  # 画像リソース
│   ├── chess/
│   ├── gomoku/
│   ├── ludo/
│   ├── memory/
│   ├── othello/
│   └── playing_cards/
└── doc/                     # ドキュメント
    ├── Chess_requirements_document.md
    ├── gomoku_requirements_document.md
    ├── Ludo_requirements_document.md
    ├── Memory_game_requirements_document.md
    └── Othello_requirements_document.md
```

## 特徴

- **レスポンシブデザイン**: モバイルからデスクトップまで対応
- **多言語サポート**: 6言語に対応
- **統計機能**: ゲームプレイ回数のランキング表示
- **モダンUI**: 洗練されたユーザーインターフェース
- **バニラJS**: フレームワーク不要、軽量で高速

## 技術スタック

- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts (Inter, Noto Sans)

## ライセンス

© 2025 GAME PORTAL. All rights reserved.

## お問い合わせ

ご質問やご要望がございましたら、ポータルサイトのお問い合わせフォームからご連絡ください。
