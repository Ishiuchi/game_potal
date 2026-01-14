# ゲームポータルサイト 公開・収益化ガイド

## 📋 目次
1. [ドメイン取得](#1-ドメイン取得)
2. [ホスティングサービスの選択](#2-ホスティングサービスの選択)
3. [サイトのデプロイ](#3-サイトのデプロイ)
4. [広告の設置](#4-広告の設置)
5. [SEO対策](#5-seo対策)
6. [アクセス解析](#6-アクセス解析)
7. [収益化のヒント](#7-収益化のヒント)

---

## 1. ドメイン取得

### 1.1 ドメインレジストラの選択

#### おすすめのドメインレジストラ
1. **Namecheap** 🌟 おすすめ
   - URL: https://www.namecheap.com
   - 価格: $8-15/年（.com）
   - 特徴: 安価、使いやすい、WHOIS保護無料

2. **Google Domains** (現 Squarespace Domains)
   - URL: https://domains.squarespace.com
   - 価格: $12/年（.com）
   - 特徴: シンプル、Google統合

3. **お名前.com**（日本語対応）
   - URL: https://www.onamae.com
   - 価格: ¥1,000-1,500/年（.com）
   - 特徴: 日本語サポート、国内最大手

### 1.2 ドメイン名の選び方

#### 推奨ドメイン名の例
```
gameportal.com
playclassicgames.com
boardgamehub.com
freegameportal.com
instantgames.online
gamecentral.io
```

#### ドメイン名選択のポイント
- ✅ 短く覚えやすい（15文字以内）
- ✅ スペルが簡単
- ✅ ゲームに関連するキーワードを含む
- ✅ .com, .io, .online, .games などの拡張子
- ❌ ハイフンや数字は避ける
- ❌ 商標侵害に注意

### 1.3 ドメイン取得手順（Namecheap例）

1. **アカウント作成**
   - https://www.namecheap.com でアカウント作成

2. **ドメイン検索**
   - 希望のドメイン名を検索
   - 空きを確認

3. **購入**
   - カートに追加
   - WHOIS保護を有効化（無料）
   - 支払い（クレジットカード、PayPal）

4. **確認**
   - 登録完了メールを確認
   - ダッシュボードでドメインを確認

**費用: 約$10-15/年**

---

## 2. ホスティングサービスの選択

### 2.1 無料ホスティング（初心者向け）

#### A. GitHub Pages 🌟 完全無料・おすすめ
- **URL:** https://pages.github.com
- **価格:** 完全無料
- **容量:** 1GB
- **帯域:** 月100GB
- **カスタムドメイン:** ✅ 対応

**メリット:**
- 完全無料
- HTTPSが自動
- GitHubと統合
- 高速・安定

**デメリット:**
- 静的サイトのみ
- サーバーサイド処理不可

#### B. Netlify
- **URL:** https://www.netlify.com
- **価格:** 無料プラン有り
- **容量:** 100GB/月
- **特徴:** 自動デプロイ、CDN、HTTPS

#### C. Vercel
- **URL:** https://vercel.com
- **価格:** 無料プラン有り
- **容量:** 100GB/月
- **特徴:** 高速、Next.js最適化

### 2.2 有料ホスティング（本格運用）

#### A. Cloudflare Pages + Pro
- **価格:** $20/月
- **特徴:** 超高速CDN、無制限帯域
- **おすすめ度:** ⭐⭐⭐⭐⭐

#### B. AWS (S3 + CloudFront)
- **価格:** $5-50/月（トラフィック依存）
- **特徴:** スケーラブル、高機能

#### C. DigitalOcean
- **価格:** $5-12/月
- **特徴:** シンプル、コスパ良い

---

## 3. サイトのデプロイ

### 3.1 GitHub Pagesでのデプロイ（推奨）

#### ステップ1: リポジトリの設定

1. **GitHubリポジトリにアクセス**
   ```
   https://github.com/Ishiuchi/game_potal
   ```

2. **Settings タブをクリック**

3. **Pages セクションに移動**
   - 左メニューから「Pages」を選択

4. **ソースの設定**
   - Source: `Deploy from a branch`
   - Branch: `master` / `/ (root)`
   - Save をクリック

5. **デプロイ完了を待つ（1-5分）**
   - 完了すると URL が表示される
   ```
   https://ishiuchi.github.io/game_potal/
   ```

#### ステップ2: カスタムドメインの設定

1. **ドメインレジストラでDNS設定**

**A レコードを追加:**
```
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

**CNAMEレコードを追加 (www用):**
```
Type: CNAME
Name: www
Value: ishiuchi.github.io
```

2. **GitHub Pagesでカスタムドメイン設定**
   - Settings > Pages
   - Custom domain に取得したドメイン入力
   - Save をクリック
   - `Enforce HTTPS` にチェック

#### ステップ3: CNAMEファイルの作成

リポジトリのルートに `CNAME` ファイルを作成:
```
yourdomain.com
```

```bash
git add CNAME
git commit -m "Add custom domain"
git push origin master
```

### 3.2 Netlifyでのデプロイ

1. **Netlifyにログイン**
   - GitHubアカウントで連携

2. **新しいサイトを作成**
   - `Add new site` > `Import an existing project`
   - GitHubを選択
   - `game_potal` リポジトリを選択

3. **ビルド設定**
   ```
   Build command: (空白)
   Publish directory: .
   ```

4. **デプロイ**
   - `Deploy site` をクリック
   - 自動的にURLが発行される

5. **カスタムドメイン設定**
   - Site settings > Domain management
   - `Add custom domain`
   - ドメインを入力
   - DNSレコードを設定（指示に従う）

---

## 4. 広告の設置

### 4.1 Google AdSense（最も一般的）

#### ステップ1: アカウント作成

1. **Google AdSenseに申し込み**
   - URL: https://www.google.com/adsense
   - Googleアカウントでログイン

2. **サイト情報を入力**
   - サイトURL
   - 連絡先情報
   - 支払い情報（後で設定可）

3. **AdSenseコードをサイトに追加**
   - <head>タグ内に追加する専用コードが発行される

#### ステップ2: 審査コードの設置

`index.html` の `<head>` セクションに追加:

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GAME PORTAL - 遊びを通じて新しい体験を</title>
    
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
         crossorigin="anonymous"></script>
    
    <link rel="stylesheet" href="assets/css/styles.css">
    ...
</head>
```

#### ステップ3: 審査申請

1. **AdSenseダッシュボードで申請**
   - サイトの審査を申請
   - 審査期間: 1-3週間

2. **審査基準**
   - ✅ オリジナルコンテンツ
   - ✅ プライバシーポリシー
   - ✅ 十分なコンテンツ量
   - ✅ ユーザーフレンドリーなナビゲーション
   - ✅ 最低6ヶ月の運用実績（推奨）
   - ❌ 違法コンテンツ
   - ❌ アダルトコンテンツ

#### ステップ4: 広告ユニットの配置

審査通過後、広告を配置:

**推奨配置場所:**

1. **ヘッダー下（728x90 リーダーボード）**
```html
<section class="hero">
    <!-- 広告 -->
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
         data-ad-slot="1234567890"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
    <script>
         (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
    
    <div class="hero-content">
        ...
    </div>
</section>
```

2. **サイドバー（300x600 ラージスカイスクレイパー）**
```html
<aside class="sidebar">
    <ins class="adsbygoogle"
         style="display:inline-block;width:300px;height:600px"
         data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
         data-ad-slot="9876543210"></ins>
    <script>
         (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</aside>
```

3. **コンテンツ内（336x280 レクタングル）**
```html
<div class="games-grid">
    <!-- ゲームカード -->
    ...
    
    <!-- 広告 -->
    <div class="ad-container">
        <ins class="adsbygoogle"
             style="display:inline-block;width:336px;height:280px"
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot="1357924680"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
    </div>
    
    <!-- ゲームカード -->
    ...
</div>
```

4. **フッター上（728x90 リーダーボード）**

### 4.2 その他の広告ネットワーク

#### A. Media.net（Yahoo/Bingの広告）
- URL: https://www.media.net
- 特徴: AdSenseの代替、承認が比較的簡単

#### B. PropellerAds
- URL: https://propellerads.com
- 特徴: 審査が緩い、即座に収益化可能

#### C. Ezoic
- URL: https://www.ezoic.com
- 特徴: AI最適化、高収益だが審査厳しい
- 要件: 月間10,000PV以上

### 4.3 広告最適化のポイント

```css
/* 広告コンテナのスタイリング */
.ad-container {
    margin: 2rem auto;
    text-align: center;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.ad-container::before {
    content: 'Advertisement';
    display: block;
    font-size: 0.75rem;
    color: #999;
    margin-bottom: 0.5rem;
}
```

**広告配置のベストプラクティス:**
- ✅ Above the fold（最初の画面）に1つ
- ✅ コンテンツに溶け込むように配置
- ✅ モバイルフレンドリー
- ❌ 広告だらけにしない（ユーザー体験重視）
- ❌ クリックを誘導しない

---

## 5. SEO対策

### 5.1 メタタグの最適化

各HTMLファイルの `<head>` セクションを更新:

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO メタタグ -->
    <title>Free Online Games - Play Classic Board Games | Game Portal</title>
    <meta name="description" content="Play free online games including Chess, Othello, Ludo, Sudoku, 2048, and more. No download required. Available in 6 languages.">
    <meta name="keywords" content="free online games, board games, chess online, othello, ludo, sudoku, 2048, browser games">
    <meta name="author" content="Game Portal">
    <link rel="canonical" href="https://yourdomain.com/">
    
    <!-- Open Graph (Facebook) -->
    <meta property="og:title" content="Free Online Games - Game Portal">
    <meta property="og:description" content="Play free classic board games online. No download required.">
    <meta property="og:image" content="https://yourdomain.com/assets/img/og-image.jpg">
    <meta property="og:url" content="https://yourdomain.com/">
    <meta property="og:type" content="website">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Free Online Games - Game Portal">
    <meta name="twitter:description" content="Play free classic board games online.">
    <meta name="twitter:image" content="https://yourdomain.com/assets/img/twitter-card.jpg">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="assets/img/favicon.png">
    
    ...
</head>
```

### 5.2 サイトマップの作成

`sitemap.xml` をルートディレクトリに作成:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://yourdomain.com/</loc>
        <lastmod>2026-01-14</lastmod>
        <priority>1.0</priority>
        <changefreq>daily</changefreq>
    </url>
    <url>
        <loc>https://yourdomain.com/othello.html</loc>
        <lastmod>2026-01-14</lastmod>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
    </url>
    <url>
        <loc>https://yourdomain.com/ludo.html</loc>
        <lastmod>2026-01-14</lastmod>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
    </url>
    <url>
        <loc>https://yourdomain.com/chess.html</loc>
        <lastmod>2026-01-14</lastmod>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
    </url>
    <url>
        <loc>https://yourdomain.com/gomoku.html</loc>
        <lastmod>2026-01-14</lastmod>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
    </url>
    <url>
        <loc>https://yourdomain.com/memory.html</loc>
        <lastmod>2026-01-14</lastmod>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
    </url>
    <url>
        <loc>https://yourdomain.com/stopwatch.html</loc>
        <lastmod>2026-01-14</lastmod>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
    </url>
    <url>
        <loc>https://yourdomain.com/2048.html</loc>
        <lastmod>2026-01-14</lastmod>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
    </url>
    <url>
        <loc>https://yourdomain.com/sudoku.html</loc>
        <lastmod>2026-01-14</lastmod>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
    </url>
    <url>
        <loc>https://yourdomain.com/minesweeper.html</loc>
        <lastmod>2026-01-14</lastmod>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
    </url>
    <url>
        <loc>https://yourdomain.com/poker.html</loc>
        <lastmod>2026-01-14</lastmod>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
    </url>
    <url>
        <loc>https://yourdomain.com/privacy-policy.html</loc>
        <lastmod>2026-01-14</lastmod>
        <priority>0.3</priority>
        <changefreq>monthly</changefreq>
    </url>
</urlset>
```

### 5.3 robots.txtの作成

`robots.txt` をルートディレクトリに作成:

```
User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml

# 高速クローリング設定
Crawl-delay: 0
```

### 5.4 Google Search Consoleの設定

1. **Google Search Consoleにアクセス**
   - URL: https://search.google.com/search-console

2. **プロパティを追加**
   - ドメインを入力
   - DNS確認またはHTML確認

3. **サイトマップを送信**
   - サイトマップ > 新しいサイトマップを追加
   - `https://yourdomain.com/sitemap.xml`

4. **インデックス登録をリクエスト**
   - URL検査ツールで各ページをリクエスト

### 5.5 構造化データの追加

各ゲームページに構造化データを追加:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Game",
  "name": "Chess",
  "description": "Play chess online for free",
  "genre": "Strategy Game",
  "gamePlatform": "Web Browser",
  "numberOfPlayers": "2",
  "playMode": "SinglePlayer",
  "url": "https://yourdomain.com/chess.html",
  "inLanguage": ["en", "ja", "zh", "hi", "es", "fr"]
}
</script>
```

---

## 6. アクセス解析

### 6.1 Google Analytics 4の設定

1. **Google Analytics アカウント作成**
   - URL: https://analytics.google.com

2. **プロパティを作成**
   - プロパティ名: Game Portal
   - タイムゾーン: 日本
   - 通貨: JPY

3. **データストリームを設定**
   - ウェブを選択
   - URLを入力

4. **測定IDを取得**
   ```
   G-XXXXXXXXXX
   ```

5. **トラッキングコードを追加**

すべてのHTMLファイルの `<head>` に追加:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 6.2 イベントトラッキングの実装

`game-stats.js` を拡張してGoogle Analyticsと統合:

```javascript
// Google Analytics イベント送信関数
function sendGAEvent(eventName, eventParams) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventParams);
    }
}

// ゲームプレイ時のトラッキング
function incrementPlayCount(gameName) {
    // 既存のコード
    const stats = getGameStats();
    if (!stats[gameName]) {
        stats[gameName] = { playCount: 0, lastPlayed: null };
    }
    stats[gameName].playCount++;
    stats[gameName].lastPlayed = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    
    // Google Analytics イベント送信
    sendGAEvent('game_start', {
        game_name: gameName,
        event_category: 'Games',
        event_label: gameName
    });
}
```

---

## 7. 収益化のヒント

### 7.1 収益予測

#### トラフィック別の収益目安（Google AdSense）

| 月間PV | RPM (1000PV単価) | 月間収益目安 |
|--------|------------------|--------------|
| 1,000 | $1-3 | $1-3 |
| 10,000 | $1-3 | $10-30 |
| 50,000 | $2-5 | $100-250 |
| 100,000 | $3-8 | $300-800 |
| 500,000 | $5-15 | $2,500-7,500 |
| 1,000,000 | $8-20 | $8,000-20,000 |

**注意:** RPMは国、ジャンル、季節により大きく変動

### 7.2 トラフィック増加戦略

#### A. SEO強化
- ✅ 定期的なコンテンツ更新
- ✅ ロングテールキーワード対策
- ✅ 内部リンク最適化
- ✅ ページ速度改善

#### B. ソーシャルメディア
- Facebook ページ作成
- Twitter でゲーム攻略情報を発信
- YouTube でゲームプレイ動画
- TikTok でショート動画

#### C. コミュニティ構築
- Discord サーバー開設
- Reddit でコミュニティ運営
- ランキング機能の実装
- ユーザーレビュー機能

#### D. 口コミマーケティング
- 学校や職場で共有を促進
- インフルエンサーとコラボ
- プレスリリース配信

### 7.3 追加の収益化方法

#### A. プレミアム機能
```javascript
// 広告なしプラン
const PREMIUM_FEATURES = {
    noAds: {
        price: '$2.99/month',
        benefits: ['広告なし', 'プレミアムテーマ', '詳細統計']
    }
};
```

#### B. アフィリエイト
- ボードゲーム関連商品のアフィリエイト
- Amazon Associates
- ゲーム攻略本の紹介

#### C. スポンサーシップ
- ゲーム会社からのスポンサー
- ボードゲームメーカーとのパートナーシップ

### 7.4 収益最適化のポイント

1. **広告配置の A/B テスト**
   - 異なる配置パターンをテスト
   - クリック率（CTR）を監視

2. **ユーザー体験と収益のバランス**
   - 広告を増やしすぎない
   - ページ速度を維持
   - モバイル体験を最優先

3. **高価値キーワードへの対応**
   - 「online chess game」
   - 「free board games」
   - 「sudoku solver」など

4. **季節イベント**
   - クリスマス特別ゲーム
   - 正月企画
   - バレンタインイベント

---

## 📊 実装チェックリスト

### Phase 1: 基本セットアップ（1-2日）
- [ ] ドメイン取得
- [ ] GitHubリポジトリ公開設定
- [ ] GitHub Pages設定
- [ ] カスタムドメイン設定
- [ ] HTTPS有効化

### Phase 2: SEO対策（2-3日）
- [ ] メタタグ最適化
- [ ] sitemap.xml作成
- [ ] robots.txt作成
- [ ] Google Search Console設定
- [ ] 構造化データ追加
- [ ] OGP画像作成

### Phase 3: アクセス解析（1日）
- [ ] Google Analytics設定
- [ ] イベントトラッキング実装
- [ ] コンバージョン設定

### Phase 4: 広告設置（1-2週間）
- [ ] Google AdSense申込
- [ ] 審査コード設置
- [ ] 審査待ち（1-3週間）
- [ ] 広告ユニット配置
- [ ] 広告最適化

### Phase 5: プロモーション（継続）
- [ ] ソーシャルメディアアカウント作成
- [ ] 定期的なコンテンツ更新
- [ ] コミュニティ運営
- [ ] SEO改善継続

---

## 💰 収益化タイムライン

### 月1: セットアップ期間
- ドメイン・ホスティング設定
- SEO基盤構築
- AdSense申込・審査
- 収益: $0

### 月2-3: 成長期
- トラフィック増加開始
- AdSense承認
- 初収益発生
- 収益: $10-50

### 月4-6: 拡大期
- SEO効果が出始める
- 月間10,000-50,000 PV
- 収益: $50-200

### 月7-12: 安定期
- 継続的なトラフィック
- 月間50,000-100,000 PV
- 収益: $200-500

### 1年後以降: 成熟期
- 確立されたトラフィック
- 月間100,000+ PV
- 収益: $500-2,000+

---

## 📞 サポート・リソース

### 公式ドキュメント
- GitHub Pages: https://docs.github.com/pages
- Google AdSense: https://support.google.com/adsense
- Google Analytics: https://support.google.com/analytics
- Google Search Console: https://support.google.com/webmasters

### コミュニティ
- Reddit r/webdev
- Stack Overflow
- Web制作者フォーラム

### 学習リソース
- Google Digital Garage（無料デジタルマーケティング講座）
- Udemy SEO コース
- YouTube AdSense チュートリアル

---

## ⚠️ 重要な注意事項

1. **AdSense ポリシー遵守**
   - 自分で広告をクリックしない
   - クリックを誘導しない
   - 違法・アダルトコンテンツ禁止

2. **著作権**
   - ゲームロジックはオリジナル実装
   - 画像・音楽は権利確認

3. **GDPR / Cookie同意**
   - EU訪問者向けにCookie同意バナー必要
   - プライバシーポリシーの明記

4. **税金**
   - 収益が発生したら確定申告が必要
   - AdSenseの支払いは源泉徴収なし

---

## 🎯 成功のための3つのポイント

1. **ユーザー体験を最優先**
   - 広告よりもゲーム体験
   - 高速なページロード
   - モバイルフレンドリー

2. **継続的な改善**
   - データ分析
   - A/Bテスト
   - フィードバック収集

3. **長期的視点**
   - 即座の収益は期待しない
   - コンテンツの質を重視
   - コミュニティを大切に

---

**作成日:** 2026年1月14日  
**バージョン:** 1.0
