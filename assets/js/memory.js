/**
 * 神経衰弱（Memory Game）実装
 * 仕様書 v1 に基づく実装
 */

// ============================================
// 定数定義
// ============================================

// カードの絵柄（トランプ）
const CARD_SYMBOLS = {
    easy: ['A', 'K', 'Q', 'J', '10', '9', '8', '7'],
    normal: ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '3', '5', '7', '9', '2', '4', '6', '8'],
    hard: ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '3', '5', '7', '9', '2', '4', '6', '8', '10', '2', '4', '6', '8', '3', '5', '7', '9', 'J']
};

const CARD_SUITS = ['club', 'diamond', 'heart', 'spade'];

// グリッド設定
const GRID_CONFIG = {
    easy: { rows: 4, cols: 4, pairs: 8, rowLayout: [4, 4, 4, 4] },
    normal: { rows: 5, cols: 7, pairs: 16, rowLayout: [6, 6, 6, 7, 7] },
    hard: { rows: 5, cols: 11, pairs: 26, rowLayout: [10, 10, 10, 11, 11] }
};

// ============================================
// ゲーム状態管理
// ============================================

let gameState = {
    mode: null,           // 'single' or 'multi'
    difficulty: null,     // 'easy', 'normal', 'hard'
    cards: [],            // カード配列
    flippedCards: [],     // めくられたカード
    matchedPairs: 0,      // マッチしたペア数
    totalPairs: 0,        // 総ペア数
    moves: 0,             // 手数
    timeElapsed: 0,       // 経過時間（秒）
    timerInterval: null,  // タイマーのインターバルID
    currentPlayer: 1,     // 現在のプレイヤー（1 or 2）
    player1Score: 0,      // プレイヤー1のスコア
    player2Score: 0,      // プレイヤー2のスコア
    isProcessing: false   // カード処理中フラグ
};

let playCountRecorded = false;

// プレイ数カウント（初回のみ）
function recordPlayCount() {
    if (!playCountRecorded && typeof GameStats !== 'undefined') {
        GameStats.incrementPlayCount('memory');
        playCountRecorded = true;
    }
}

// ============================================
// 初期化関数
// ============================================

/**
 * ゲームモード選択
 */
function selectMode(mode) {
    gameState.mode = mode;
    
    // ボタンの視覚的フィードバック
    document.querySelectorAll('.mode-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // 難易度選択を表示
    document.getElementById('difficultySelection').style.display = 'block';
}

/**
 * ゲーム開始
 */
function startGame(difficulty) {
    recordPlayCount();
    gameState.difficulty = difficulty;
    
    // ゲーム状態の初期化
    const config = GRID_CONFIG[difficulty];
    gameState.totalPairs = config.pairs;
    gameState.matchedPairs = 0;
    gameState.moves = 0;
    gameState.timeElapsed = 0;
    gameState.flippedCards = [];
    gameState.isProcessing = false;
    gameState.currentPlayer = 1;
    gameState.player1Score = 0;
    gameState.player2Score = 0;
    
    // カードの生成とシャッフル
    initializeCards();
    
    // UIの切り替え
    document.getElementById('gameSetup').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    
    // プレイヤー情報の表示設定
    if (gameState.mode === 'multi') {
        document.getElementById('pairsInfo').style.display = 'none';
        document.getElementById('player1Info').style.display = 'flex';
        document.getElementById('player2Info').style.display = 'flex';
        document.getElementById('currentPlayerDisplay').style.display = 'block';
        updateCurrentPlayerDisplay();
    } else {
        document.getElementById('pairsInfo').style.display = 'flex';
        document.getElementById('player1Info').style.display = 'none';
        document.getElementById('player2Info').style.display = 'none';
        document.getElementById('currentPlayerDisplay').style.display = 'none';
    }
    
    // ボードの描画
    renderBoard();
    
    // ステータスの更新
    updateStatus();
    
    // タイマー開始
    startTimer();
    
    console.log(`ゲーム開始: ${gameState.mode}, ${difficulty}`);
}

/**
 * カードの初期化とシャッフル
 */
function initializeCards() {
    const config = GRID_CONFIG[gameState.difficulty];
    const symbols = CARD_SYMBOLS[gameState.difficulty].slice(0, config.pairs);
    
    // カードペアを作成
    gameState.cards = [];
    for (let i = 0; i < symbols.length; i++) {
        const suit = CARD_SUITS[i % CARD_SUITS.length];
        const symbol = symbols[i];
        
        // 同じカードを2枚追加
        gameState.cards.push({
            id: i * 2,
            symbol: symbol,
            suit: suit,
            isFlipped: false,
            isMatched: false
        });
        
        gameState.cards.push({
            id: i * 2 + 1,
            symbol: symbol,
            suit: suit,
            isFlipped: false,
            isMatched: false
        });
    }
    
    // Fisher-Yatesアルゴリズムでシャッフル
    shuffleCards();
    
    console.log('カード初期化完了:', gameState.cards.length, '枚');
}

/**
 * カードをシャッフル（Fisher-Yatesアルゴリズム）
 */
function shuffleCards() {
    for (let i = gameState.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameState.cards[i], gameState.cards[j]] = [gameState.cards[j], gameState.cards[i]];
    }
}

// ============================================
// UI描画関数
// ============================================

/**
 * ボードを描画
 */
function renderBoard() {
    const grid = document.getElementById('cardGrid');
    grid.innerHTML = '';
    grid.className = `card-grid ${gameState.difficulty}`;
    
    const config = GRID_CONFIG[gameState.difficulty];
    const rowLayout = config.rowLayout;
    
    let cardIndex = 0;
    rowLayout.forEach((cardsInRow, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'card-row';
        rowDiv.style.gridTemplateColumns = `repeat(${cardsInRow}, 1fr)`;
        
        for (let i = 0; i < cardsInRow; i++) {
            if (cardIndex >= gameState.cards.length) break;
            
            const card = gameState.cards[cardIndex];
            const currentIndex = cardIndex; // クロージャ問題を回避
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            if (card.isMatched) {
                cardElement.classList.add('matched', 'flipped');
            } else if (card.isFlipped) {
                cardElement.classList.add('flipped');
            }
            
            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-face card-back"></div>
                    <div class="card-face card-front">
                        <img src="assets/img/playing_cards/${card.suit}_${card.symbol}.png" 
                             alt="${card.suit} ${card.symbol}"
                             onerror="this.outerHTML='<div style=\\'font-size:2rem\\'>${card.symbol}</div>'">
                    </div>
                </div>
            `;
            
            cardElement.addEventListener('click', () => handleCardClick(currentIndex));
            rowDiv.appendChild(cardElement);
            cardIndex++;
        }
        
        grid.appendChild(rowDiv);
    });
}

/**
 * ステータス表示を更新
 */
function updateStatus() {
    document.getElementById('timer').textContent = formatTime(gameState.timeElapsed);
    document.getElementById('moves').textContent = gameState.moves;
    
    if (gameState.mode === 'single') {
        document.getElementById('pairs').textContent = 
            `${gameState.matchedPairs} / ${gameState.totalPairs}`;
    } else {
        document.getElementById('player1Score').textContent = gameState.player1Score;
        document.getElementById('player2Score').textContent = gameState.player2Score;
    }
}

/**
 * 現在のプレイヤー表示を更新
 */
function updateCurrentPlayerDisplay() {
    const playerText = gameState.currentPlayer === 1 ? 
        (translations[currentLanguage]?.memory?.player1 || 'プレイヤー1') :
        (translations[currentLanguage]?.memory?.player2 || 'プレイヤー2');
    const turnText = translations[currentLanguage]?.memory?.turn || 'のターン';
    document.getElementById('currentPlayerText').textContent = `${playerText}${turnText}`;
}

/**
 * 時間をフォーマット（分:秒）
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============================================
// ゲームロジック
// ============================================

/**
 * カードクリック処理
 */
function handleCardClick(index) {
    const card = gameState.cards[index];
    
    // クリック無効条件
    if (gameState.isProcessing || 
        card.isMatched || 
        card.isFlipped || 
        gameState.flippedCards.length >= 2) {
        return;
    }
    
    // カードをめくる
    flipCard(index);
    
    // 2枚目がめくられた場合、判定
    if (gameState.flippedCards.length === 2) {
        gameState.moves++;
        updateStatus();
        checkMatch();
    }
}

/**
 * カードをめくる
 */
function flipCard(index) {
    const card = gameState.cards[index];
    card.isFlipped = true;
    gameState.flippedCards.push(index);
    
    renderBoard();
}

/**
 * ペアが一致するか判定
 */
function checkMatch() {
    gameState.isProcessing = true;
    
    const [index1, index2] = gameState.flippedCards;
    const card1 = gameState.cards[index1];
    const card2 = gameState.cards[index2];
    
    const isMatch = card1.symbol === card2.symbol && card1.suit === card2.suit;
    
    if (isMatch) {
        // マッチング成功
        console.log('マッチ成功:', card1.symbol);
        
        setTimeout(() => {
            lockCards();
            gameState.isProcessing = false;
        }, 600);
        
    } else {
        // マッチング失敗
        console.log('マッチ失敗');
        
        // 不一致アニメーション
        const cardElements = document.querySelectorAll('.card');
        cardElements[index1].classList.add('wrong');
        cardElements[index2].classList.add('wrong');
        
        setTimeout(() => {
            resetFlippedCards();
            gameState.isProcessing = false;
        }, 1000);
    }
}

/**
 * マッチしたカードをロック
 */
function lockCards() {
    const [index1, index2] = gameState.flippedCards;
    gameState.cards[index1].isMatched = true;
    gameState.cards[index2].isMatched = true;
    
    gameState.matchedPairs++;
    
    // スコア更新（2人対戦時）
    if (gameState.mode === 'multi') {
        if (gameState.currentPlayer === 1) {
            gameState.player1Score++;
        } else {
            gameState.player2Score++;
        }
        // マッチ時は同じプレイヤーがもう一度
    } else {
        // 1人プレイ時はターン交代不要
    }
    
    gameState.flippedCards = [];
    renderBoard();
    updateStatus();
    
    // ゲームクリア判定
    if (gameState.matchedPairs === gameState.totalPairs) {
        setTimeout(() => {
            endGame();
        }, 500);
    }
}

/**
 * めくったカードを裏返す
 */
function resetFlippedCards() {
    gameState.flippedCards.forEach(index => {
        gameState.cards[index].isFlipped = false;
    });
    
    gameState.flippedCards = [];
    
    // 2人対戦時はターン交代
    if (gameState.mode === 'multi') {
        switchTurn();
    }
    
    renderBoard();
}

/**
 * ターン交代（2人対戦時）
 */
function switchTurn() {
    gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
    updateCurrentPlayerDisplay();
    console.log(`ターン交代: プレイヤー${gameState.currentPlayer}`);
}

// ============================================
// タイマー機能
// ============================================

/**
 * タイマー開始
 */
function startTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    gameState.timerInterval = setInterval(() => {
        gameState.timeElapsed++;
        updateStatus();
    }, 1000);
}

/**
 * タイマー停止
 */
function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

// ============================================
// ゲーム終了処理
// ============================================

/**
 * ゲーム終了
 */
function endGame() {
    stopTimer();
    
    console.log('ゲームクリア!');
    console.log(`時間: ${formatTime(gameState.timeElapsed)}, 手数: ${gameState.moves}`);
    
    showResults();
}

/**
 * 結果モーダル表示
 */
function showResults() {
    const modal = document.getElementById('gameModal');
    const modalBody = document.getElementById('modalBody');
    
    let content = '';
    
    if (gameState.mode === 'single') {
        // 1人プレイ: ランク評価
        const rank = calculateRank();
        const clearTimeText = translations[currentLanguage]?.memory?.clearTime || 'クリアタイム:';
        const totalMovesText = translations[currentLanguage]?.memory?.totalMoves || '総手数:';
        const rankText = translations[currentLanguage]?.memory?.rank || 'ランク:';
        
        content = `
            <p>${clearTimeText} <strong>${formatTime(gameState.timeElapsed)}</strong></p>
            <p>${totalMovesText} <strong>${gameState.moves}</strong></p>
            <div class="rank ${rank}">${rank}</div>
            <p>${rankText} ${rank}</p>
        `;
    } else {
        // 2人対戦: 勝者発表
        let winner;
        if (gameState.player1Score > gameState.player2Score) {
            winner = translations[currentLanguage]?.memory?.player1 || 'プレイヤー1';
        } else if (gameState.player2Score > gameState.player1Score) {
            winner = translations[currentLanguage]?.memory?.player2 || 'プレイヤー2';
        } else {
            winner = translations[currentLanguage]?.memory?.draw || '引き分け';
        }
        
        const winnerText = translations[currentLanguage]?.memory?.winner || '勝者:';
        const scoreText = translations[currentLanguage]?.memory?.score || 'スコア:';
        const player1Text = translations[currentLanguage]?.memory?.player1 || 'プレイヤー1';
        const player2Text = translations[currentLanguage]?.memory?.player2 || 'プレイヤー2';
        
        content = `
            <p>${winnerText} <strong>${winner}</strong></p>
            <p>${player1Text} ${scoreText} <strong>${gameState.player1Score}</strong></p>
            <p>${player2Text} ${scoreText} <strong>${gameState.player2Score}</strong></p>
        `;
    }
    
    modalBody.innerHTML = content;
    modal.style.display = 'flex';
}

/**
 * パフォーマンス評価計算
 */
function calculateRank() {
    const optimalMoves = gameState.totalPairs; // 最適手数 = ペア数
    const timePerMove = gameState.timeElapsed / gameState.moves;
    
    if (gameState.moves <= optimalMoves * 1.2 && gameState.timeElapsed < optimalMoves * 10) {
        return 'S';
    } else if (gameState.moves <= optimalMoves * 1.5) {
        return 'A';
    } else if (gameState.moves <= optimalMoves * 2.0) {
        return 'B';
    } else {
        return 'C';
    }
}

// ============================================
// リセット・モード選択
// ============================================

/**
 * ゲームリセット
 */
function resetGame() {
    stopTimer();
    
    // モーダルを閉じる
    document.getElementById('gameModal').style.display = 'none';
    
    // 同じ設定で再スタート
    if (gameState.difficulty) {
        startGame(gameState.difficulty);
    }
}

/**
 * モード選択に戻る
 */
function backToModeSelection() {
    stopTimer();
    
    // モーダルを閉じる
    document.getElementById('gameModal').style.display = 'none';
    
    // ゲーム状態をリセット
    gameState = {
        mode: null,
        difficulty: null,
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        totalPairs: 0,
        moves: 0,
        timeElapsed: 0,
        timerInterval: null,
        currentPlayer: 1,
        player1Score: 0,
        player2Score: 0,
        isProcessing: false
    };
    
    // UI切り替え
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('gameSetup').style.display = 'block';
    document.getElementById('difficultySelection').style.display = 'none';
    
    // ボタンの選択状態をリセット
    document.querySelectorAll('.mode-button').forEach(btn => {
        btn.classList.remove('selected');
    });
}

// ============================================
// ページロード時の初期化
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('神経衰弱ゲーム起動');
});
