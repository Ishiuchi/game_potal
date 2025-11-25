/**
 * 五目並べ（Gomoku）ゲーム実装
 * 15×15盤面、CPU対戦（3レベル）、勝敗判定を含む
 */

// ゲーム状態
let gameMode = 'pvp'; // 'pvp' or 'cpu'
let cpuLevel = 1; // 1: ランダム, 2: 評価関数, 3: ミニマックス
let currentPlayer = 'black'; // 'black' or 'white'
let board = [];
let gameOver = false;
let moveCount = 0;
let lastMove = null;
let playCountRecorded = false;

// プレイ数カウント（初回のみ）
function recordPlayCount() {
    if (!playCountRecorded && typeof GameStats !== 'undefined') {
        GameStats.incrementPlayCount('gomoku');
        playCountRecorded = true;
    }
}

// 定数
const BOARD_SIZE = 15;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;
const WIN_LENGTH = 5;

// 方向ベクトル（縦、横、斜め）
const DIRECTIONS = [
    [0, 1],   // 横
    [1, 0],   // 縦
    [1, 1],   // 右斜め下
    [1, -1]   // 左斜め下
];

/**
 * ゲーム開始
 */
function startGame(mode) {
    gameMode = mode;
    
    // ボタンの視覚的フィードバック
    document.querySelectorAll('.mode-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    if (mode === 'cpu') {
        document.getElementById('cpuLevelSelection').style.display = 'block';
    } else {
        initializeGame();
    }
}

/**
 * CPUレベル設定
 */
function setCPULevel(level) {
    cpuLevel = level;
    console.log(`CPU Level set to: ${level}`);
    
    // ボタンの視覚的フィードバック
    document.querySelectorAll('.level-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    initializeGame();
}

/**
 * ゲーム初期化
 */
function initializeGame() {
    recordPlayCount();
    document.getElementById('modeSelection').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    
    currentPlayer = 'black';
    gameOver = false;
    moveCount = 0;
    lastMove = null;
    
    initializeBoard();
    renderBoard();
    updateStatus();
}

/**
 * ボード初期化
 */
function initializeBoard() {
    board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY));
}

/**
 * ボード描画
 */
function renderBoard() {
    const boardElement = document.getElementById('gameBoard');
    boardElement.innerHTML = '';
    
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const intersection = document.createElement('div');
            intersection.className = 'intersection';
            intersection.dataset.row = row;
            intersection.dataset.col = col;
            
            // 端の処理
            if (row === 0) intersection.classList.add('top');
            if (row === BOARD_SIZE - 1) intersection.classList.add('bottom');
            if (col === 0) intersection.classList.add('left');
            if (col === BOARD_SIZE - 1) intersection.classList.add('right');
            
            // 星の位置（天元と隅）
            if ((row === 3 && col === 3) || (row === 3 && col === 11) ||
                (row === 11 && col === 3) || (row === 11 && col === 11) ||
                (row === 7 && col === 7)) {
                intersection.classList.add('star');
            }
            
            // 石を配置
            if (board[row][col] !== EMPTY) {
                const stone = document.createElement('div');
                stone.className = 'stone';
                stone.classList.add(board[row][col] === BLACK ? 'black' : 'white');
                
                // 最後に置かれた石
                if (lastMove && lastMove.row === row && lastMove.col === col) {
                    stone.classList.add('last-move');
                }
                
                intersection.appendChild(stone);
                intersection.classList.add('has-stone');
            }
            
            // クリックイベント
            intersection.addEventListener('click', () => handleCellClick(row, col));
            
            boardElement.appendChild(intersection);
        }
    }
}

/**
 * セルクリック処理
 */
function handleCellClick(row, col) {
    if (gameOver) return;
    if (gameMode === 'cpu' && currentPlayer === 'white') return;
    if (board[row][col] !== EMPTY) return;
    
    console.log(`Click: (${row}, ${col})`);
    
    // 石を置く
    makeMove(row, col);
    
    // 勝敗判定
    if (checkGameEnd(row, col)) {
        return;
    }
    
    // プレイヤー交代
    switchPlayer();
    
    // CPU対戦の場合、CPUの手番
    if (gameMode === 'cpu' && currentPlayer === 'white' && !gameOver) {
        setTimeout(() => makeCPUMove(), 300);
    }
}

/**
 * 移動を実行
 */
function makeMove(row, col) {
    const player = currentPlayer === 'black' ? BLACK : WHITE;
    board[row][col] = player;
    lastMove = { row, col };
    moveCount++;
    
    renderBoard();
    updateStatus();
}

/**
 * プレイヤー交代
 */
function switchPlayer() {
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    updateStatus();
}

/**
 * ステータス更新
 */
function updateStatus() {
    const turnElement = document.getElementById('currentTurn');
    if (currentPlayer === 'black') {
        turnElement.textContent = '黒の番';
        turnElement.setAttribute('data-i18n', 'gomoku.blackTurn');
    } else {
        turnElement.textContent = '白の番';
        turnElement.setAttribute('data-i18n', 'gomoku.whiteTurn');
    }
    
    document.getElementById('moveCount').textContent = moveCount;
    
    // 多言語対応の再適用
    if (typeof applyLanguage === 'function') {
        applyLanguage();
    }
}

/**
 * ゲーム終了判定
 */
function checkGameEnd(row, col) {
    const player = board[row][col];
    
    // 5目並んだかチェック
    const winningLine = checkWinner(row, col, player);
    
    if (winningLine) {
        gameOver = true;
        highlightWinningLine(winningLine);
        const winner = player === BLACK ? '黒' : '白';
        console.log(`Winner: ${winner}`);
        console.log('Winning line:', winningLine);
        
        setTimeout(() => {
            showGameOver(gameMode === 'cpu' && player === BLACK ? 
                'あなたの勝ちです！' : 
                gameMode === 'cpu' ? 'CPUの勝ちです！' : 
                `${winner}の勝ちです！`);
        }, 500);
        return true;
    }
    
    // 引き分け判定
    if (moveCount === BOARD_SIZE * BOARD_SIZE) {
        gameOver = true;
        console.log('Game ended in a draw');
        setTimeout(() => showGameOver('引き分けです！'), 300);
        return true;
    }
    
    return false;
}

/**
 * 勝者判定（5連続チェック）
 */
function checkWinner(row, col, player) {
    for (const [dx, dy] of DIRECTIONS) {
        const line = [];
        
        // 両方向にチェック
        for (let i = -4; i <= 4; i++) {
            const newRow = row + i * dx;
            const newCol = col + i * dy;
            
            if (newRow >= 0 && newRow < BOARD_SIZE && 
                newCol >= 0 && newCol < BOARD_SIZE &&
                board[newRow][newCol] === player) {
                line.push({ row: newRow, col: newCol });
            } else {
                if (line.length >= WIN_LENGTH) break;
                line.length = 0;
            }
        }
        
        if (line.length >= WIN_LENGTH) {
            console.log(`${WIN_LENGTH} in a row found:`, line.slice(0, WIN_LENGTH));
            return line.slice(0, WIN_LENGTH);
        }
    }
    
    return null;
}

/**
 * 勝利ラインをハイライト
 */
function highlightWinningLine(line) {
    for (const pos of line) {
        const cell = document.querySelector(`[data-row="${pos.row}"][data-col="${pos.col}"]`);
        if (cell) {
            const stone = cell.querySelector('.stone');
            if (stone) {
                stone.classList.add('winning');
            }
        }
    }
}

/**
 * CPU移動
 */
function makeCPUMove() {
    if (gameOver) return;
    
    console.log(`CPU Level ${cpuLevel} thinking...`);
    
    let move = null;
    const startTime = Date.now();
    
    if (cpuLevel === 1) {
        move = getRandomMove();
    } else if (cpuLevel === 2) {
        move = getEvaluatedMove();
    } else if (cpuLevel === 3) {
        move = getMinimaxMove();
    }
    
    const elapsed = Date.now() - startTime;
    console.log(`CPU decision time: ${elapsed}ms`);
    
    if (move) {
        console.log(`CPU plays: (${move.row}, ${move.col})`);
        makeMove(move.row, move.col);
        
        if (!checkGameEnd(move.row, move.col)) {
            switchPlayer();
        }
    }
}

/**
 * ランダムな移動を取得（レベル1）
 */
function getRandomMove() {
    const validMoves = [];
    
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === EMPTY) {
                validMoves.push({ row, col });
            }
        }
    }
    
    if (validMoves.length === 0) return null;
    return validMoves[Math.floor(Math.random() * validMoves.length)];
}

/**
 * 評価関数を使用した移動（レベル2）
 */
function getEvaluatedMove() {
    let bestScore = -Infinity;
    let bestMove = null;
    
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === EMPTY) {
                // 攻撃スコア：自分の石を置いた場合の強さ
                const attackScore = evaluatePosition(row, col, WHITE);
                // 防御スコア：相手の石を置いた場合の強さ
                const defenseScore = evaluatePosition(row, col, BLACK);
                
                // 防御をやや優先（1.2倍）
                const score = attackScore + defenseScore * 1.2;
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { row, col };
                }
            }
        }
    }
    
    console.log(`Best move score: ${bestScore}`);
    return bestMove || getRandomMove();
}

/**
 * 位置の評価
 */
function evaluatePosition(row, col, player) {
    let score = 0;
    
    for (const [dx, dy] of DIRECTIONS) {
        const pattern = analyzePattern(row, col, dx, dy, player);
        
        // パターンによるスコア計算
        if (pattern.count >= 5) {
            score += 100000; // 勝ち確
        } else if (pattern.count === 4) {
            if (pattern.openEnds === 2) {
                score += 50000; // 両端開いた4（次の一手で勝ち）
            } else if (pattern.openEnds === 1) {
                score += 5000; // 片端開いた4
            }
        } else if (pattern.count === 3) {
            if (pattern.openEnds === 2) {
                score += 1000; // 両端開いた3（強力）
            } else if (pattern.openEnds === 1) {
                score += 100; // 片端開いた3
            }
        } else if (pattern.count === 2) {
            if (pattern.openEnds === 2) {
                score += 50; // 両端開いた2
            } else if (pattern.openEnds === 1) {
                score += 10; // 片端開いた2
            }
        } else if (pattern.count === 1) {
            if (pattern.openEnds === 2) {
                score += 5; // 両端開いた1
            }
        }
    }
    
    return score;
}

/**
 * パターン分析：連続数と両端の空白をチェック
 */
function analyzePattern(row, col, dx, dy, player) {
    let count = 1;
    let openEnds = 0;
    
    // 正方向をチェック
    let i = 1;
    while (i < WIN_LENGTH) {
        const newRow = row + i * dx;
        const newCol = col + i * dy;
        
        if (newRow < 0 || newRow >= BOARD_SIZE || 
            newCol < 0 || newCol >= BOARD_SIZE) break;
        
        if (board[newRow][newCol] === player) {
            count++;
            i++;
        } else if (board[newRow][newCol] === EMPTY) {
            openEnds++;
            break;
        } else {
            break;
        }
    }
    
    // 逆方向をチェック
    i = 1;
    while (i < WIN_LENGTH) {
        const newRow = row - i * dx;
        const newCol = col - i * dy;
        
        if (newRow < 0 || newRow >= BOARD_SIZE || 
            newCol < 0 || newCol >= BOARD_SIZE) break;
        
        if (board[newRow][newCol] === player) {
            count++;
            i++;
        } else if (board[newRow][newCol] === EMPTY) {
            openEnds++;
            break;
        } else {
            break;
        }
    }
    
    return { count, openEnds };
}

/**
 * 連続する石をカウント
 */
function countConsecutive(row, col, dx, dy, player) {
    let count = 1;
    
    // 正方向
    for (let i = 1; i < WIN_LENGTH; i++) {
        const newRow = row + i * dx;
        const newCol = col + i * dy;
        
        if (newRow < 0 || newRow >= BOARD_SIZE || 
            newCol < 0 || newCol >= BOARD_SIZE) break;
        
        if (board[newRow][newCol] === player) {
            count++;
        } else if (board[newRow][newCol] !== EMPTY) {
            break;
        } else {
            break;
        }
    }
    
    // 逆方向
    for (let i = 1; i < WIN_LENGTH; i++) {
        const newRow = row - i * dx;
        const newCol = col - i * dy;
        
        if (newRow < 0 || newRow >= BOARD_SIZE || 
            newCol < 0 || newCol >= BOARD_SIZE) break;
        
        if (board[newRow][newCol] === player) {
            count++;
        } else if (board[newRow][newCol] !== EMPTY) {
            break;
        } else {
            break;
        }
    }
    
    return count;
}

/**
 * ミニマックスアルゴリズム（レベル3）
 */
function getMinimaxMove() {
    const depth = 3; // 深度を3に増やして強化
    let bestScore = -Infinity;
    let bestMove = null;
    
    // 既に石がある周辺のみを探索（最適化）
    const candidates = getCandidateMoves();
    
    for (const move of candidates) {
        board[move.row][move.col] = WHITE;
        const score = minimax(depth - 1, false, -Infinity, Infinity);
        board[move.row][move.col] = EMPTY;
        
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    
    console.log(`Minimax best score: ${bestScore}`);
    return bestMove || getRandomMove();
}

/**
 * 候補手を取得（最適化：既存の石の周辺のみ）
 */
function getCandidateMoves() {
    const candidates = new Set();
    
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] !== EMPTY) {
                // 周辺2マスを候補に追加
                for (let dr = -2; dr <= 2; dr++) {
                    for (let dc = -2; dc <= 2; dc++) {
                        const newRow = row + dr;
                        const newCol = col + dc;
                        
                        if (newRow >= 0 && newRow < BOARD_SIZE &&
                            newCol >= 0 && newCol < BOARD_SIZE &&
                            board[newRow][newCol] === EMPTY) {
                            candidates.add(`${newRow},${newCol}`);
                        }
                    }
                }
            }
        }
    }
    
    // 盤面が空の場合は中央付近
    if (candidates.size === 0) {
        return [{ row: 7, col: 7 }];
    }
    
    return Array.from(candidates).map(pos => {
        const [row, col] = pos.split(',').map(Number);
        return { row, col };
    });
}

/**
 * ミニマックスアルゴリズム
 */
function minimax(depth, isMaximizing, alpha, beta) {
    // 勝敗チェック
    const winCheck = quickWinCheck();
    if (winCheck === WHITE) return 10000;
    if (winCheck === BLACK) return -10000;
    
    if (depth === 0) {
        return evaluateBoard();
    }
    
    const candidates = getCandidateMoves().slice(0, 15); // 上位15手のみ
    
    if (isMaximizing) {
        let maxScore = -Infinity;
        
        for (const move of candidates) {
            board[move.row][move.col] = WHITE;
            const score = minimax(depth - 1, false, alpha, beta);
            board[move.row][move.col] = EMPTY;
            
            maxScore = Math.max(maxScore, score);
            alpha = Math.max(alpha, score);
            
            if (beta <= alpha) break; // αβ剪定
        }
        
        return maxScore;
    } else {
        let minScore = Infinity;
        
        for (const move of candidates) {
            board[move.row][move.col] = BLACK;
            const score = minimax(depth - 1, true, alpha, beta);
            board[move.row][move.col] = EMPTY;
            
            minScore = Math.min(minScore, score);
            beta = Math.min(beta, score);
            
            if (beta <= alpha) break; // αβ剪定
        }
        
        return minScore;
    }
}

/**
 * 高速勝敗チェック
 */
function quickWinCheck() {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const player = board[row][col];
            if (player !== EMPTY && checkWinner(row, col, player)) {
                return player;
            }
        }
    }
    return null;
}

/**
 * ボード全体の評価
 */
function evaluateBoard() {
    let score = 0;
    
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] !== EMPTY) {
                const player = board[row][col];
                const posScore = evaluatePosition(row, col, player);
                
                if (player === WHITE) {
                    score += posScore;
                } else {
                    score -= posScore;
                }
            }
        }
    }
    
    return score;
}

/**
 * ゲーム終了モーダル表示
 */
function showGameOver(message) {
    document.getElementById('gameResult').textContent = message;
    document.getElementById('gameModal').style.display = 'flex';
}

/**
 * モーダルを閉じる
 */
function closeModal() {
    document.getElementById('gameModal').style.display = 'none';
}

/**
 * ゲームリセット
 */
function resetGame() {
    document.getElementById('gameModal').style.display = 'none';
    initializeGame();
}

/**
 * モード選択に戻る
 */
function backToModeSelection() {
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('modeSelection').style.display = 'block';
    document.getElementById('cpuLevelSelection').style.display = 'none';
    document.getElementById('gameModal').style.display = 'none';
}
