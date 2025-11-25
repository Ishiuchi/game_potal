/**
 * GAMENAME ゲーム実装
 * ゲームロジック、CPU対戦、勝敗判定を含む
 */

// ゲーム状態
let gameMode = 'pvp'; // 'pvp' or 'cpu'
let cpuLevel = 1; // 1: 易しい, 2: 普通, 3: 難しい
let currentPlayer = 1; // 1 or 2
let board = [];
let gameOver = false;

// 定数
const BOARD_SIZE = 8; // ボードのサイズ（必要に応じて変更）

/**
 * ゲーム開始
 */
function startGame(mode) {
    gameMode = mode;
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
    initializeGame();
}

/**
 * ゲーム初期化
 */
function initializeGame() {
    document.getElementById('modeSelection').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    
    currentPlayer = 1;
    gameOver = false;
    
    initializeBoard();
    renderBoard();
    updateStatus();
}

/**
 * ボード初期化
 */
function initializeBoard() {
    board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
    
    // 初期配置があればここに記述
    // 例: board[3][3] = 1;
}

/**
 * ボード描画
 */
function renderBoard() {
    const boardElement = document.getElementById('gameBoard');
    boardElement.innerHTML = '';
    
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // セルの内容を設定
            if (board[row][col]) {
                cell.textContent = getCellContent(board[row][col]);
            }
            
            // クリックイベント
            cell.addEventListener('click', () => handleCellClick(row, col));
            
            boardElement.appendChild(cell);
        }
    }
}

/**
 * セルの内容を取得
 */
function getCellContent(value) {
    // プレイヤーの駒や記号を返す
    if (value === 1) return '●';
    if (value === 2) return '○';
    return '';
}

/**
 * セルクリック処理
 */
function handleCellClick(row, col) {
    if (gameOver) return;
    if (gameMode === 'cpu' && currentPlayer === 2) return;
    
    // 移動が有効かチェック
    if (!isValidMove(row, col)) return;
    
    // 移動を実行
    makeMove(row, col);
    
    // 勝敗判定
    if (checkGameEnd()) {
        return;
    }
    
    // プレイヤー交代
    switchPlayer();
    
    // CPU対戦の場合、CPUの手番
    if (gameMode === 'cpu' && currentPlayer === 2 && !gameOver) {
        setTimeout(() => makeCPUMove(), 500);
    }
}

/**
 * 有効な移動かチェック
 */
function isValidMove(row, col) {
    // 既に駒が置かれている場合は無効
    if (board[row][col] !== null) return false;
    
    // その他のゲーム固有のルールをチェック
    return true;
}

/**
 * 移動を実行
 */
function makeMove(row, col) {
    board[row][col] = currentPlayer;
    renderBoard();
    updateStatus();
}

/**
 * プレイヤー交代
 */
function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateStatus();
}

/**
 * ステータス更新
 */
function updateStatus() {
    const turnElement = document.getElementById('currentTurn');
    if (gameMode === 'cpu') {
        turnElement.textContent = currentPlayer === 1 ? 'あなたの番' : 'CPUの番';
    } else {
        turnElement.textContent = `プレイヤー${currentPlayer}の番`;
    }
    
    // スコア更新（必要に応じて）
    updateScore();
}

/**
 * スコア更新
 */
function updateScore() {
    // ゲーム固有のスコア計算
    let score1 = 0;
    let score2 = 0;
    
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === 1) score1++;
            if (board[row][col] === 2) score2++;
        }
    }
    
    document.getElementById('player1Score').textContent = score1;
    document.getElementById('player2Score').textContent = score2;
}

/**
 * ゲーム終了判定
 */
function checkGameEnd() {
    // 勝利条件をチェック
    const winner = checkWinner();
    
    if (winner) {
        gameOver = true;
        showGameOver(getWinnerMessage(winner));
        return true;
    }
    
    // 引き分け判定
    if (isBoardFull()) {
        gameOver = true;
        showGameOver('引き分けです！');
        return true;
    }
    
    return false;
}

/**
 * 勝者判定
 */
function checkWinner() {
    // ゲーム固有の勝利条件を実装
    // 例: 5目並べ、チェックメイトなど
    
    return null; // 勝者がいない場合
}

/**
 * ボードが埋まっているかチェック
 */
function isBoardFull() {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === null) return false;
        }
    }
    return true;
}

/**
 * 勝者メッセージ取得
 */
function getWinnerMessage(winner) {
    if (gameMode === 'cpu') {
        return winner === 1 ? 'あなたの勝ちです！' : 'CPUの勝ちです！';
    }
    return `プレイヤー${winner}の勝ちです！`;
}

/**
 * CPU移動
 */
function makeCPUMove() {
    if (gameOver) return;
    
    let move = null;
    
    if (cpuLevel === 1) {
        move = getRandomMove();
    } else if (cpuLevel === 2) {
        move = getGoodMove();
    } else if (cpuLevel === 3) {
        move = getBestMove();
    }
    
    if (move) {
        makeMove(move.row, move.col);
        
        if (!checkGameEnd()) {
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
            if (isValidMove(row, col)) {
                validMoves.push({ row, col });
            }
        }
    }
    
    if (validMoves.length === 0) return null;
    return validMoves[Math.floor(Math.random() * validMoves.length)];
}

/**
 * 良い移動を取得（レベル2）
 */
function getGoodMove() {
    // 簡単な評価関数を使用
    // まずはランダム移動と同じ（後で改善）
    return getRandomMove();
}

/**
 * 最良の移動を取得（レベル3）
 */
function getBestMove() {
    // ミニマックスアルゴリズムや高度な評価関数を使用
    // まずはランダム移動と同じ（後で改善）
    return getRandomMove();
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
