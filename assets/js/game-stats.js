/**
 * ゲーム統計管理システム
 * プレイ数のカウント、ランキング表示、統計グラフを提供
 */

// ========================================
// データ管理
// ========================================

const GameStats = {
    STORAGE_KEY: 'gamePlayStats',
    
    /**
     * 統計データを取得
     */
    getData() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : this.getDefaultData();
    },
    
    /**
     * デフォルトデータ構造
     */
    getDefaultData() {
        return {
            games: {
                othello: { total: 0, weekly: 0, monthly: 0, lastPlayed: null },
                ludo: { total: 0, weekly: 0, monthly: 0, lastPlayed: null },
                chess: { total: 0, weekly: 0, monthly: 0, lastPlayed: null },
                gomoku: { total: 0, weekly: 0, monthly: 0, lastPlayed: null },
                memory: { total: 0, weekly: 0, monthly: 0, lastPlayed: null }
            },
            lastWeekReset: Date.now(),
            lastMonthReset: Date.now()
        };
    },
    
    /**
     * データを保存
     */
    saveData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },
    
    /**
     * プレイ数をカウント
     */
    incrementPlayCount(gameName) {
        const data = this.getData();
        
        // 週間・月間リセット処理
        this.checkAndResetPeriods(data);
        
        if (data.games[gameName]) {
            data.games[gameName].total++;
            data.games[gameName].weekly++;
            data.games[gameName].monthly++;
            data.games[gameName].lastPlayed = Date.now();
            this.saveData(data);
        }
    },
    
    /**
     * 期間リセット処理
     */
    checkAndResetPeriods(data) {
        const now = Date.now();
        const weekMs = 7 * 24 * 60 * 60 * 1000;
        const monthMs = 30 * 24 * 60 * 60 * 1000;
        
        // 週間リセット
        if (now - data.lastWeekReset > weekMs) {
            Object.keys(data.games).forEach(game => {
                data.games[game].weekly = 0;
            });
            data.lastWeekReset = now;
        }
        
        // 月間リセット
        if (now - data.lastMonthReset > monthMs) {
            Object.keys(data.games).forEach(game => {
                data.games[game].monthly = 0;
            });
            data.lastMonthReset = now;
        }
    },
    
    /**
     * ランキングを取得
     */
    getRanking(period = 'total') {
        const data = this.getData();
        const games = Object.entries(data.games).map(([name, stats]) => ({
            name,
            playCount: stats[period] || 0,
            lastPlayed: stats.lastPlayed
        }));
        
        return games.sort((a, b) => b.playCount - a.playCount);
    },
    
    /**
     * 総プレイ数を取得
     */
    getTotalPlays() {
        const data = this.getData();
        return Object.values(data.games).reduce((sum, game) => sum + game.total, 0);
    },
    
    /**
     * ゲーム名の翻訳を取得
     */
    getGameTitle(gameName, lang = 'ja') {
        const titles = {
            othello: { ja: 'オセロ', en: 'Othello', zh: '黑白棋', hi: 'ओथेलो', es: 'Otelo', fr: 'Othello' },
            ludo: { ja: 'ルドー', en: 'Ludo', zh: '飞行棋', hi: 'लूडो', es: 'Ludo', fr: 'Ludo' },
            chess: { ja: 'チェス', en: 'Chess', zh: '国际象棋', hi: 'शतरंज', es: 'Ajedrez', fr: 'Échecs' },
            gomoku: { ja: '五目並べ', en: 'Gomoku', zh: '五子棋', hi: 'गोमोकु', es: 'Gomoku', fr: 'Gomoku' },
            memory: { ja: '神経衰弱', en: 'Memory', zh: '记忆游戏', hi: 'मेमोरी', es: 'Memoria', fr: 'Mémoire' }
        };
        
        return titles[gameName]?.[lang] || gameName;
    }
};

// ========================================
// UI表示関数
// ========================================

/**
 * ランキングセクションを表示
 */
function renderRankingSection() {
    const container = document.getElementById('rankingContainer');
    if (!container) return;
    
    const currentLang = localStorage.getItem('language') || 'ja';
    const periods = ['total', 'monthly', 'weekly'];
    let activePeriod = 'total';
    
    const translations = {
        ja: { 
            title: '人気ランキング',
            total: '全期間', 
            monthly: '月間', 
            weekly: '週間',
            plays: 'プレイ',
            noData: 'まだプレイ記録がありません'
        },
        en: { 
            title: 'Popular Ranking',
            total: 'All Time', 
            monthly: 'Monthly', 
            weekly: 'Weekly',
            plays: 'plays',
            noData: 'No play records yet'
        },
        zh: { 
            title: '热门排行',
            total: '全部', 
            monthly: '月度', 
            weekly: '周',
            plays: '次',
            noData: '尚无游戏记录'
        },
        hi: { 
            title: 'लोकप्रिय रैंकिंग',
            total: 'सभी समय', 
            monthly: 'मासिक', 
            weekly: 'साप्ताहिक',
            plays: 'खेल',
            noData: 'अभी तक कोई रिकॉर्ड नहीं'
        },
        es: { 
            title: 'Ranking Popular',
            total: 'Todo el tiempo', 
            monthly: 'Mensual', 
            weekly: 'Semanal',
            plays: 'jugadas',
            noData: 'Aún no hay registros'
        },
        fr: { 
            title: 'Classement Populaire',
            total: 'Tout le temps', 
            monthly: 'Mensuel', 
            weekly: 'Hebdomadaire',
            plays: 'parties',
            noData: 'Pas encore de records'
        }
    };
    
    const t = translations[currentLang] || translations.ja;
    
    function updateRanking(period) {
        activePeriod = period;
        const ranking = GameStats.getRanking(period);
        const totalPlays = period === 'total' ? GameStats.getTotalPlays() : 
                          ranking.reduce((sum, game) => sum + game.playCount, 0);
        
        container.innerHTML = `
            <div class="ranking-header">
                <h2 class="section-title">${t.title}</h2>
                <div class="period-selector">
                    ${periods.map(p => `
                        <button class="period-btn ${p === activePeriod ? 'active' : ''}" 
                                onclick="updateRankingPeriod('${p}')">
                            ${t[p]}
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <div class="ranking-list">
                ${ranking.length === 0 || totalPlays === 0 ? `
                    <p class="no-data">${t.noData}</p>
                ` : ranking.map((game, index) => {
                    const percentage = totalPlays > 0 ? (game.playCount / totalPlays * 100).toFixed(1) : 0;
                    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
                    
                    return `
                        <div class="ranking-item ${index < 3 ? 'top-three' : ''}" data-rank="${index + 1}">
                            <div class="rank-info">
                                <span class="rank-number">${medal || (index + 1)}</span>
                                <span class="game-name">${GameStats.getGameTitle(game.name, currentLang)}</span>
                            </div>
                            <div class="play-stats">
                                <span class="play-count">${game.playCount} ${t.plays}</span>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${percentage}%"></div>
                                </div>
                                <span class="percentage">${percentage}%</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    // グローバル関数として登録
    window.updateRankingPeriod = updateRanking;
    
    // 初期表示
    updateRanking(activePeriod);
}

/**
 * ゲームカードに人気バッジを追加
 */
function addPopularityBadges() {
    const ranking = GameStats.getRanking('total');
    const totalPlays = GameStats.getTotalPlays();
    
    if (totalPlays === 0) return;
    
    ranking.forEach((game, index) => {
        const card = document.querySelector(`a[href="${game.name}.html"]`)?.closest('.game-card');
        if (!card) return;
        
        const badge = document.createElement('div');
        badge.className = 'popularity-badge';
        
        if (index === 0) {
            badge.innerHTML = '🔥 Most Popular';
            badge.classList.add('rank-1');
        } else if (index === 1) {
            badge.innerHTML = '⭐ Popular';
            badge.classList.add('rank-2');
        } else if (index === 2) {
            badge.innerHTML = '👍 Trending';
            badge.classList.add('rank-3');
        }
        
        if (index < 3) {
            card.querySelector('.game-card-image').appendChild(badge);
        }
    });
}

// ========================================
// 初期化
// ========================================

// ページロード時に実行
if (typeof window !== 'undefined') {
    window.GameStats = GameStats;
    
    // DOMContentLoaded時に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            renderRankingSection();
            addPopularityBadges();
        });
    } else {
        renderRankingSection();
        addPopularityBadges();
    }
}
