// ストップウォッチゲーム JavaScript

// ゲーム状態管理
const gameState = {
    currentTurn: 1,
    targetSeconds: [3, 5, 10],
    isBlindMode: false,
    results: [
        { elapsed: 0, error: 0, absError: 0, rank: '' },
        { elapsed: 0, error: 0, absError: 0, rank: '' },
        { elapsed: 0, error: 0, absError: 0, rank: '' }
    ],
    totalAbsError: 0,
    finalRank: '',
    isRunning: false,
    startTime: 0,
    endTime: 0,
    timerInterval: null
};

// DOM要素
const elements = {
    // 画面
    startScreen: document.getElementById('startScreen'),
    gameScreen: document.getElementById('gameScreen'),
    resultScreen: document.getElementById('resultScreen'),
    
    // 開始画面
    startGameBtn: document.getElementById('startGameBtn'),
    normalModeBtn: document.getElementById('normalModeBtn'),
    blindModeBtn: document.getElementById('blindModeBtn'),
    
    // ゲーム画面
    currentTurn: document.getElementById('currentTurn'),
    targetTime: document.getElementById('targetTime'),
    timerDisplay: document.getElementById('timerDisplay'),
    statusIndicator: document.getElementById('statusIndicator'),
    startBtn: document.getElementById('startBtn'),
    stopBtn: document.getElementById('stopBtn'),
    resetBtn: document.getElementById('resetBtn'),
    
    // ターン結果
    turnResult: document.getElementById('turnResult'),
    resultElapsed: document.getElementById('resultElapsed'),
    resultError: document.getElementById('resultError'),
    rankBadge: document.getElementById('rankBadge'),
    nextTurnBtn: document.getElementById('nextTurnBtn'),
    
    // 最終結果
    turn1Elapsed: document.getElementById('turn1Elapsed'),
    turn1Error: document.getElementById('turn1Error'),
    turn1Rank: document.getElementById('turn1Rank'),
    turn2Elapsed: document.getElementById('turn2Elapsed'),
    turn2Error: document.getElementById('turn2Error'),
    turn2Rank: document.getElementById('turn2Rank'),
    turn3Elapsed: document.getElementById('turn3Elapsed'),
    turn3Error: document.getElementById('turn3Error'),
    turn3Rank: document.getElementById('turn3Rank'),
    totalErrorDisplay: document.getElementById('totalErrorDisplay'),
    finalRankBadge: document.getElementById('finalRankBadge'),
    rankMessage: document.getElementById('rankMessage'),
    playAgainBtn: document.getElementById('playAgainBtn')
};

// 初期化
function init() {
    setupEventListeners();
    setupKeyboardControls();
}

// イベントリスナー設定
function setupEventListeners() {
    elements.startGameBtn.addEventListener('click', startGame);
    elements.normalModeBtn.addEventListener('click', () => selectMode('normal'));
    elements.blindModeBtn.addEventListener('click', () => selectMode('blind'));
    elements.startBtn.addEventListener('click', startTimer);
    elements.stopBtn.addEventListener('click', stopTimer);
    elements.resetBtn.addEventListener('click', resetGame);
    elements.nextTurnBtn.addEventListener('click', nextTurn);
    elements.playAgainBtn.addEventListener('click', resetGame);
}

// モード選択
function selectMode(mode) {
    gameState.isBlindMode = (mode === 'blind');
    
    elements.normalModeBtn.classList.toggle('active', mode === 'normal');
    elements.blindModeBtn.classList.toggle('active', mode === 'blind');
}

// キーボード操作
function setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !elements.startBtn.disabled) {
            startTimer();
        } else if (e.key === ' ' && !elements.stopBtn.disabled) {
            e.preventDefault();
            stopTimer();
        }
    });
}

// ゲーム開始
function startGame() {
    showScreen('gameScreen');
    resetGameState();
    updateTurnDisplay();
    
    // ブラインドモードのクラスを適用
    if (gameState.isBlindMode) {
        document.body.classList.add('blind-mode');
    } else {
        document.body.classList.remove('blind-mode');
    }
}

// タイマー開始
function startTimer() {
    if (gameState.isRunning) return;
    
    gameState.isRunning = true;
    gameState.startTime = performance.now();
    
    elements.startBtn.disabled = true;
    elements.stopBtn.disabled = false;
    elements.statusIndicator.textContent = translations[currentLanguage]?.stopwatch?.measuring || '計測中';
    
    gameState.timerInterval = setInterval(updateTimerDisplay, 10);
}

// タイマー停止
function stopTimer() {
    if (!gameState.isRunning) return;
    
    gameState.isRunning = false;
    gameState.endTime = performance.now();
    
    clearInterval(gameState.timerInterval);
    
    // ブラインドモードの場合、停止時に時間を表示
    if (gameState.isBlindMode) {
        document.body.classList.add('timer-stopped');
    }
    
    elements.startBtn.disabled = false;
    elements.stopBtn.disabled = true;
    elements.statusIndicator.textContent = translations[currentLanguage]?.stopwatch?.stopped || '停止';
    
    calculateResult();
    showTurnResult();
}

// タイマー表示更新
function updateTimerDisplay() {
    const elapsed = (performance.now() - gameState.startTime) / 1000;
    elements.timerDisplay.textContent = elapsed.toFixed(3);
}

// 結果計算
function calculateResult() {
    const elapsed = (gameState.endTime - gameState.startTime) / 1000;
    const target = gameState.targetSeconds[gameState.currentTurn - 1];
    const error = elapsed - target;
    const absError = Math.abs(error);
    const rank = getRank(absError);
    
    const result = {
        elapsed: parseFloat(elapsed.toFixed(3)),
        error: parseFloat(error.toFixed(3)),
        absError: parseFloat(absError.toFixed(3)),
        rank: rank
    };
    
    gameState.results[gameState.currentTurn - 1] = result;
    gameState.totalAbsError += result.absError;
    
    return result;
}

// ランク判定
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

// ターン結果表示
function showTurnResult() {
    const result = gameState.results[gameState.currentTurn - 1];
    
    elements.resultElapsed.textContent = result.elapsed.toFixed(3);
    elements.resultError.textContent = (result.error >= 0 ? '+' : '') + result.error.toFixed(3);
    elements.rankBadge.textContent = result.rank;
    elements.rankBadge.className = 'rank-badge rank-' + result.rank;
    
    elements.turnResult.classList.remove('hidden');
}

// 次のターン
function nextTurn() {
    elements.turnResult.classList.add('hidden');
    
    if (gameState.currentTurn >= 3) {
        showFinalResult();
        return;
    }
    
    gameState.currentTurn++;
    updateTurnDisplay();
    resetTimerDisplay();
}

// ターン表示更新
function updateTurnDisplay() {
    elements.currentTurn.textContent = gameState.currentTurn;
    elements.targetTime.textContent = gameState.targetSeconds[gameState.currentTurn - 1].toFixed(3);
}

// タイマー表示リセット
function resetTimerDisplay() {
    elements.timerDisplay.textContent = '0.000';
    elements.statusIndicator.textContent = translations[currentLanguage]?.stopwatch?.waiting || '待機中';
    elements.startBtn.disabled = false;
    elements.stopBtn.disabled = true;
    
    // ブラインドモードの停止状態をリセット
    if (gameState.isBlindMode) {
        document.body.classList.remove('timer-stopped');
    }
}

// 最終結果表示
function showFinalResult() {
    // 各ターンの結果
    for (let i = 0; i < 3; i++) {
        const result = gameState.results[i];
        const turnNum = i + 1;
        
        elements[`turn${turnNum}Elapsed`].textContent = result.elapsed.toFixed(3) + translations[currentLanguage]?.stopwatch?.seconds || '秒';
        elements[`turn${turnNum}Error`].textContent = (result.error >= 0 ? '+' : '') + result.error.toFixed(3) + (translations[currentLanguage]?.stopwatch?.seconds || '秒');
        elements[`turn${turnNum}Rank`].textContent = result.rank;
        elements[`turn${turnNum}Rank`].className = 'rank-text rank-' + result.rank;
    }
    
    // 総合評価
    const avgError = gameState.totalAbsError / 3;
    gameState.finalRank = getRank(avgError);
    
    elements.totalErrorDisplay.textContent = gameState.totalAbsError.toFixed(3);
    elements.finalRankBadge.textContent = gameState.finalRank;
    elements.finalRankBadge.className = 'rank-badge large rank-' + gameState.finalRank;
    elements.rankMessage.textContent = getRankMessage(gameState.finalRank);
    
    // 最高記録保存
    saveBestRecord();
    
    showScreen('resultScreen');
}

// ランクメッセージ取得
function getRankMessage(rank) {
    const messages = translations[currentLanguage]?.stopwatch || {};
    const messageMap = {
        'SSS': messages.rankSSS || '神業!',
        'SS': messages.rankSS || '超人的!',
        'S': messages.rankS || '達人級!',
        'A': messages.rankA || '優秀!',
        'B': messages.rankB || '良好!',
        'C': messages.rankC || '普通',
        'D': messages.rankD || '要練習',
        'E': messages.rankE || 'ネタレベル'
    };
    return messageMap[rank] || '';
}

// ゲームリセット
function resetGame() {
    resetGameState();
    resetTimerDisplay();
    elements.turnResult.classList.add('hidden');
    showScreen('gameScreen');
    updateTurnDisplay();
}

// ゲーム状態リセット
function resetGameState() {
    gameState.currentTurn = 1;
    gameState.results = [
        { elapsed: 0, error: 0, absError: 0, rank: '' },
        { elapsed: 0, error: 0, absError: 0, rank: '' },
        { elapsed: 0, error: 0, absError: 0, rank: '' }
    ];
    gameState.totalAbsError = 0;
    gameState.finalRank = '';
    gameState.isRunning = false;
    
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
}

// 画面切り替え
function showScreen(screenId) {
    elements.startScreen.classList.remove('active');
    elements.gameScreen.classList.remove('active');
    elements.resultScreen.classList.remove('active');
    
    document.getElementById(screenId).classList.add('active');
}

// 最高記録保存
function saveBestRecord() {
    try {
        const bestRecord = localStorage.getItem('stopwatch_best');
        if (!bestRecord || gameState.totalAbsError < JSON.parse(bestRecord).totalAbsError) {
            localStorage.setItem('stopwatch_best', JSON.stringify({
                totalAbsError: gameState.totalAbsError,
                finalRank: gameState.finalRank,
                date: new Date().toISOString(),
                results: gameState.results
            }));
        }
    } catch (error) {
        console.error('Failed to save best record:', error);
    }
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', init);
