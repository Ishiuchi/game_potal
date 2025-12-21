/**
 * オセロゲーム実装
 * 仕様書 v1 に基づく実装
 */

// ゲーム定数
const BOARD_SIZE = 8;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

// 8方向の探索用ベクトル (dx, dy)
const DIRECTIONS = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
];

// ゲーム状態
let board = [];
let currentPlayer = BLACK;
let gameMode = 'pvp'; // 'pvp' or 'cpu'
let cpuLevel = 1;
let passCount = 0;
let isGameOver = false;
let playCountRecorded = false;

// プレイ数カウント（初回のみ）
function recordPlayCount() {
    if (!playCountRecorded && typeof GameStats !== 'undefined') {
        GameStats.incrementPlayCount('othello');
        playCountRecorded = true;
    }
}

/**
 * ゲーム初期化
 */
function initBoard() {
    recordPlayCount();
    // 盤面を空で初期化
    board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY));
    
    // 初期配置（中央の4マス）
    const mid = BOARD_SIZE / 2;
    board[mid - 1][mid - 1] = WHITE;
    board[mid - 1][mid] = BLACK;
    board[mid][mid - 1] = BLACK;
    board[mid][mid] = WHITE;
    
    currentPlayer = BLACK;
    passCount = 0;
    isGameOver = false;
    
    console.log('盤面初期化完了');
    console.log(board);
}

/**
 * ゲーム開始
 */
function startGame(mode) {
    gameMode = mode;
    
    if (mode === 'cpu') {
        document.getElementById('cpuLevelSelection').style.display = 'block';
    } else {
        // PvPモードの場合、すぐにゲーム開始
        document.getElementById('modeSelection').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        initBoard();
        renderBoard();
        updateStatus();
    }
}

/**
 * CPUレベル設定
 */
function setCPULevel(level) {
    cpuLevel = level;
    document.getElementById('modeSelection').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    initBoard();
    renderBoard();
    updateStatus();
}

/**
 * モード選択画面に戻る
 */
function backToModeSelection() {
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('modeSelection').style.display = 'block';
    document.getElementById('cpuLevelSelection').style.display = 'none';
}

/**
 * 盤面描画
 */
function renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // 石の描画
            if (board[row][col] !== EMPTY) {
                const disc = document.createElement('div');
                disc.className = `disc ${board[row][col] === BLACK ? 'black' : 'white'}`;
                cell.appendChild(disc);
            }
            
            // 合法手の表示
            if (!isGameOver && isLegalMove(row, col, currentPlayer)) {
                cell.classList.add('legal-move');
            }
            
            // クリックイベント
            cell.addEventListener('click', () => handleCellClick(row, col));
            
            boardElement.appendChild(cell);
        }
    }
}

/**
 * セルクリック処理
 */
function handleCellClick(row, col) {
    if (isGameOver) return;
    
    // CPU対戦で白(CPU)のターンの場合は無効
    if (gameMode === 'cpu' && currentPlayer === WHITE) return;
    
    if (isLegalMove(row, col, currentPlayer)) {
        makeMove(row, col, currentPlayer);
    }
}

/**
 * 手を打つ
 */
function makeMove(row, col, player) {
    // 石を置く
    board[row][col] = player;
    
    // 裏返す
    const flippedCount = flipStones(row, col, player);
    
    // パスカウントをリセット
    passCount = 0;
    
    // 盤面を更新
    updateStatus();
    renderBoard();
    
    // アニメーション完了後にターン交代（アニメーションの時間を考慮）
    const animationDelay = flippedCount * 50 + 700; // 各石50ms + 最後のアニメーション600ms + 余裕100ms
    setTimeout(() => {
        switchTurn();
    }, animationDelay);
}

/**
 * 合法手判定
 */
function isLegalMove(row, col, player) {
    // すでに石がある場合は不可
    if (board[row][col] !== EMPTY) return false;
    
    const opponent = player === BLACK ? WHITE : BLACK;
    
    // 8方向を探索
    for (const [dx, dy] of DIRECTIONS) {
        let x = row + dx;
        let y = col + dy;
        let hasOpponent = false;
        
        // 隣が相手の石かチェック
        while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
            if (board[x][y] === EMPTY) break;
            if (board[x][y] === opponent) {
                hasOpponent = true;
            } else if (board[x][y] === player) {
                // 相手の石を挟んでいる場合は合法手
                if (hasOpponent) return true;
                break;
            }
            x += dx;
            y += dy;
        }
    }
    
    return false;
}

/**
 * 石を裏返す
 */
function flipStones(row, col, player) {
    const opponent = player === BLACK ? WHITE : BLACK;
    const allFlipped = [];
    
    // 8方向を探索
    for (const [dx, dy] of DIRECTIONS) {
        const toFlip = [];
        let x = row + dx;
        let y = col + dy;
        
        // この方向で裏返せる石を収集
        while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
            if (board[x][y] === EMPTY) break;
            if (board[x][y] === opponent) {
                toFlip.push([x, y]);
            } else if (board[x][y] === player) {
                // 自分の石に到達したら、この方向の石を裏返す
                for (const [fx, fy] of toFlip) {
                    board[fx][fy] = player;
                    allFlipped.push([fx, fy]);
                }
                break;
            }
            x += dx;
            y += dy;
        }
    }
    
    // アニメーション付きで石を裏返す
    allFlipped.forEach(([fx, fy], index) => {
        setTimeout(() => {
            const cell = document.querySelector(`[data-row="${fx}"][data-col="${fy}"]`);
            if (cell) {
                const disc = cell.querySelector('.disc');
                if (disc) {
                    disc.classList.add('flipping');
                    setTimeout(() => {
                        disc.classList.remove('flipping');
                    }, 600);
                }
            }
        }, index * 50); // 順番にアニメーションさせる
    });
    
    // 裏返した石の数を返す
    return allFlipped.length;
}

/**
 * 全ての合法手を取得
 */
function getLegalMoves(player) {
    const moves = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (isLegalMove(row, col, player)) {
                moves.push([row, col]);
            }
        }
    }
    return moves;
}

/**
 * ターン交代
 */
function switchTurn() {
    currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
    
    const legalMoves = getLegalMoves(currentPlayer);
    
    if (legalMoves.length === 0) {
        // 合法手がない場合はパス
        passCount++;
        console.log(`${currentPlayer === BLACK ? '黒' : '白'}はパス`);
        
        if (passCount >= 2) {
            // 両者パスでゲーム終了
            endGame();
            return;
        }
        
        // 相手のターンへ
        currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
        const opponentMoves = getLegalMoves(currentPlayer);
        
        if (opponentMoves.length === 0) {
            // 相手も打てない場合はゲーム終了
            endGame();
            return;
        }
    }
    
    updateStatus();
    renderBoard();
    
    // CPU対戦モードで白(CPU)のターンの場合
    if (gameMode === 'cpu' && currentPlayer === WHITE) {
        showThinking();
        const thinkTime = 800 + Math.random() * 1500; // 0.8〜2.3秒
        setTimeout(() => {
            hideThinking();
            cpuMove();
        }, thinkTime);
    }
}

/**
 * CPU の手
 */
function cpuMove() {
    const legalMoves = getLegalMoves(WHITE);
    if (legalMoves.length === 0) return;
    
    let selectedMove;
    
    switch (cpuLevel) {
        case 1:
            // レベル1: ランダム
            selectedMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
            break;
            
        case 2:
            // レベル2: 最大裏返し数
            selectedMove = getBestMoveByFlipCount(legalMoves);
            break;
            
        case 3:
            // レベル3: 評価関数
            selectedMove = getBestMoveByEvaluation(legalMoves);
            break;
    }
    
    makeMove(selectedMove[0], selectedMove[1], WHITE);
}

/**
 * 最大裏返し数の手を選択（レベル2）
 */
function getBestMoveByFlipCount(moves) {
    let bestMove = moves[0];
    let maxFlips = 0;
    
    for (const [row, col] of moves) {
        const flipCount = countFlips(row, col, WHITE);
        if (flipCount > maxFlips) {
            maxFlips = flipCount;
            bestMove = [row, col];
        }
    }
    
    return bestMove;
}

/**
 * 裏返せる石の数をカウント
 */
function countFlips(row, col, player) {
    const opponent = player === BLACK ? WHITE : BLACK;
    let count = 0;
    
    for (const [dx, dy] of DIRECTIONS) {
        let x = row + dx;
        let y = col + dy;
        let tempCount = 0;
        
        while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
            if (board[x][y] === EMPTY) break;
            if (board[x][y] === opponent) {
                tempCount++;
            } else if (board[x][y] === player) {
                count += tempCount;
                break;
            }
            x += dx;
            y += dy;
        }
    }
    
    return count;
}

/**
 * 評価関数による最適手選択（レベル3）
 */
function getBestMoveByEvaluation(moves) {
    // 位置の重み（角が最も重要）
    const weights = [
        [100, -20, 10,  5,  5, 10, -20, 100],
        [-20, -50, -2, -2, -2, -2, -50, -20],
        [ 10,  -2, 10,  1,  1, 10,  -2,  10],
        [  5,  -2,  1,  0,  0,  1,  -2,   5],
        [  5,  -2,  1,  0,  0,  1,  -2,   5],
        [ 10,  -2, 10,  1,  1, 10,  -2,  10],
        [-20, -50, -2, -2, -2, -2, -50, -20],
        [100, -20, 10,  5,  5, 10, -20, 100]
    ];
    
    let bestMove = moves[0];
    let bestScore = -Infinity;
    
    for (const [row, col] of moves) {
        // 位置の重みと裏返し数を組み合わせた評価
        const flipCount = countFlips(row, col, WHITE);
        const score = weights[row][col] + flipCount * 2;
        
        if (score > bestScore) {
            bestScore = score;
            bestMove = [row, col];
        }
    }
    
    return bestMove;
}

/**
 * ステータス更新
 */
function updateStatus() {
    const turnText = currentPlayer === BLACK 
        ? (translations[currentLanguage]?.othello?.blackTurn || '黒の番')
        : (translations[currentLanguage]?.othello?.whiteTurn || '白の番');
    document.getElementById('currentTurn').textContent = turnText;
    
    const { black, white } = countStones();
    document.getElementById('blackScore').textContent = black;
    document.getElementById('whiteScore').textContent = white;
}

/**
 * 石の数をカウント
 */
function countStones() {
    let black = 0;
    let white = 0;
    
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === BLACK) black++;
            if (board[row][col] === WHITE) white++;
        }
    }
    
    return { black, white };
}

/**
 * ゲーム終了
 */
function endGame() {
    isGameOver = true;
    const { black, white } = countStones();
    
    let result;
    if (black > white) {
        result = '⚫ 黒の勝ち！';
    } else if (white > black) {
        result = '⚪ 白の勝ち！';
    } else {
        result = '引き分け！';
    }
    
    document.getElementById('gameResult').textContent = result;
    document.getElementById('finalBlackScore').textContent = black;
    document.getElementById('finalWhiteScore').textContent = white;
    
    const modal = document.getElementById('gameOverModal');
    modal.classList.add('show');
    
    console.log('ゲーム終了:', result, `黒:${black} 白:${white}`);
}

/**
 * モーダルを閉じる
 */
function closeModal() {
    const modal = document.getElementById('gameOverModal');
    modal.classList.remove('show');
}

/**
 * 思考中表示
 */
function showThinking() {
    const turnEl = document.getElementById('currentTurn');
    turnEl.textContent = translations[currentLanguage]?.othello?.whiteThinking || '白のターン（思考中...）';
    turnEl.style.opacity = '0.6';
}

/**
 * 思考中非表示
 */
function hideThinking() {
    const turnEl = document.getElementById('currentTurn');
    turnEl.style.opacity = '1';
}

/**
 * ゲームリセット
 */
function resetGame() {
    closeModal();
    initBoard();
    renderBoard();
    updateStatus();
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('オセロゲーム起動');
});
