/**
 * チェスゲーム実装
 * 完全なチェスルール、CPU対戦、チェック・チェックメイト判定を含む
 */

// ゲーム状態
let gameMode = 'pvp'; // 'pvp' or 'cpu'
let cpuLevel = 1; // 1: ランダム, 2: 駒価値, 3: ミニマックス
let currentPlayer = 'white'; // 'white' or 'black'
let selectedCell = null;
let board = [];
let moveHistory = [];
let capturedPieces = { white: [], black: [] };
let gameOver = false;
let promotionPending = null;
let playCountRecorded = false;

// プレイ数カウント（初回のみ）
function recordPlayCount() {
    if (!playCountRecorded && typeof GameStats !== 'undefined') {
        GameStats.incrementPlayCount('chess');
        playCountRecorded = true;
    }
}

// 駒の定義
const PIECES = {
    WHITE_KING: '♔',
    WHITE_QUEEN: '♕',
    WHITE_ROOK: '♖',
    WHITE_BISHOP: '♗',
    WHITE_KNIGHT: '♘',
    WHITE_PAWN: '♙',
    BLACK_KING: '♚',
    BLACK_QUEEN: '♛',
    BLACK_ROOK: '♜',
    BLACK_BISHOP: '♝',
    BLACK_KNIGHT: '♞',
    BLACK_PAWN: '♟'
};

// 駒の価値
const PIECE_VALUES = {
    '♙': 1, '♟': 1,
    '♘': 3, '♞': 3,
    '♗': 3, '♝': 3,
    '♖': 5, '♜': 5,
    '♕': 9, '♛': 9,
    '♔': 1000, '♚': 1000
};

// 初期化
function startGame(mode) {
    gameMode = mode;
    if (mode === 'cpu') {
        document.getElementById('cpuLevelSelection').style.display = 'block';
    } else {
        initializeGame();
    }
}

function setCPULevel(level) {
    cpuLevel = level;
    initializeGame();
}

function initializeGame() {
    recordPlayCount();
    document.getElementById('modeSelection').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'grid';
    
    currentPlayer = 'white';
    selectedCell = null;
    moveHistory = [];
    capturedPieces = { white: [], black: [] };
    gameOver = false;
    
    initializeBoard();
    renderBoard();
    updateTurnDisplay();
}

function initializeBoard() {
    // 8x8のボードを初期化
    board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // 黒の駒を配置
    board[0] = [
        { piece: PIECES.BLACK_ROOK, color: 'black', moved: false },
        { piece: PIECES.BLACK_KNIGHT, color: 'black', moved: false },
        { piece: PIECES.BLACK_BISHOP, color: 'black', moved: false },
        { piece: PIECES.BLACK_QUEEN, color: 'black', moved: false },
        { piece: PIECES.BLACK_KING, color: 'black', moved: false },
        { piece: PIECES.BLACK_BISHOP, color: 'black', moved: false },
        { piece: PIECES.BLACK_KNIGHT, color: 'black', moved: false },
        { piece: PIECES.BLACK_ROOK, color: 'black', moved: false }
    ];
    board[1] = Array(8).fill(null).map(() => ({ piece: PIECES.BLACK_PAWN, color: 'black', moved: false }));
    
    // 白の駒を配置
    board[6] = Array(8).fill(null).map(() => ({ piece: PIECES.WHITE_PAWN, color: 'white', moved: false }));
    board[7] = [
        { piece: PIECES.WHITE_ROOK, color: 'white', moved: false },
        { piece: PIECES.WHITE_KNIGHT, color: 'white', moved: false },
        { piece: PIECES.WHITE_BISHOP, color: 'white', moved: false },
        { piece: PIECES.WHITE_QUEEN, color: 'white', moved: false },
        { piece: PIECES.WHITE_KING, color: 'white', moved: false },
        { piece: PIECES.WHITE_BISHOP, color: 'white', moved: false },
        { piece: PIECES.WHITE_KNIGHT, color: 'white', moved: false },
        { piece: PIECES.WHITE_ROOK, color: 'white', moved: false }
    ];
}

function renderBoard() {
    const boardElement = document.getElementById('chessBoard');
    boardElement.innerHTML = '';
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.className = 'chess-cell';
            cell.className += (row + col) % 2 === 0 ? ' light' : ' dark';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            const piece = board[row][col];
            if (piece) {
                cell.innerHTML = `<span class="chess-piece">${piece.piece}</span>`;
            }
            
            cell.addEventListener('click', () => handleCellClick(row, col));
            boardElement.appendChild(cell);
        }
    }
    
    updateCapturedPieces();
}

function handleCellClick(row, col) {
    if (gameOver) return;
    if (gameMode === 'cpu' && currentPlayer === 'black') return;
    
    const piece = board[row][col];
    
    if (selectedCell) {
        // 移動を試みる
        const [selectedRow, selectedCol] = selectedCell;
        const possibleMoves = getPossibleMoves(selectedRow, selectedCol);
        
        const moveExists = possibleMoves.some(m => m.row === row && m.col === col);
        
        if (moveExists) {
            makeMove(selectedRow, selectedCol, row, col);
            selectedCell = null;
            clearHighlights();
            
            if (!gameOver) {
                switchPlayer();
                
                if (gameMode === 'cpu' && currentPlayer === 'black') {
                    setTimeout(makeCPUMove, 500);
                }
            }
        } else if (piece && piece.color === currentPlayer) {
            // 別の自分の駒を選択
            selectPiece(row, col);
        } else {
            // 選択解除
            selectedCell = null;
            clearHighlights();
        }
    } else if (piece && piece.color === currentPlayer) {
        // 駒を選択
        selectPiece(row, col);
    }
}

function selectPiece(row, col) {
    selectedCell = [row, col];
    clearHighlights();
    
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell.classList.add('selected');
    
    const possibleMoves = getPossibleMoves(row, col);
    possibleMoves.forEach(move => {
        const targetCell = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
        if (move.capture) {
            targetCell.classList.add('possible-capture');
        } else {
            targetCell.classList.add('possible-move');
        }
    });
}

function clearHighlights() {
    document.querySelectorAll('.chess-cell').forEach(cell => {
        cell.classList.remove('selected', 'possible-move', 'possible-capture', 'in-check');
    });
}

function getPossibleMoves(row, col) {
    const piece = board[row][col];
    if (!piece) return [];
    
    let moves = [];
    const pieceType = piece.piece;
    
    if (pieceType === PIECES.WHITE_PAWN || pieceType === PIECES.BLACK_PAWN) {
        moves = getPawnMoves(row, col, piece.color);
    } else if (pieceType === PIECES.WHITE_ROOK || pieceType === PIECES.BLACK_ROOK) {
        moves = getRookMoves(row, col, piece.color);
    } else if (pieceType === PIECES.WHITE_KNIGHT || pieceType === PIECES.BLACK_KNIGHT) {
        moves = getKnightMoves(row, col, piece.color);
    } else if (pieceType === PIECES.WHITE_BISHOP || pieceType === PIECES.BLACK_BISHOP) {
        moves = getBishopMoves(row, col, piece.color);
    } else if (pieceType === PIECES.WHITE_QUEEN || pieceType === PIECES.BLACK_QUEEN) {
        moves = getQueenMoves(row, col, piece.color);
    } else if (pieceType === PIECES.WHITE_KING || pieceType === PIECES.BLACK_KING) {
        moves = getKingMoves(row, col, piece.color);
    }
    
    // 王手放置禁止チェック
    moves = moves.filter(move => {
        return !wouldBeInCheck(row, col, move.row, move.col, piece.color);
    });
    
    return moves;
}

function getPawnMoves(row, col, color) {
    const moves = [];
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;
    
    // 前進
    if (isValidPosition(row + direction, col) && !board[row + direction][col]) {
        moves.push({ row: row + direction, col, capture: false });
        
        // 初手2マス前進
        if (row === startRow && !board[row + 2 * direction][col]) {
            moves.push({ row: row + 2 * direction, col, capture: false });
        }
    }
    
    // 斜め取り
    for (const dcol of [-1, 1]) {
        const newRow = row + direction;
        const newCol = col + dcol;
        if (isValidPosition(newRow, newCol)) {
            const target = board[newRow][newCol];
            if (target && target.color !== color) {
                moves.push({ row: newRow, col: newCol, capture: true });
            }
        }
    }
    
    return moves;
}

function getRookMoves(row, col, color) {
    const moves = [];
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    
    for (const [drow, dcol] of directions) {
        let newRow = row + drow;
        let newCol = col + dcol;
        
        while (isValidPosition(newRow, newCol)) {
            const target = board[newRow][newCol];
            if (!target) {
                moves.push({ row: newRow, col: newCol, capture: false });
            } else {
                if (target.color !== color) {
                    moves.push({ row: newRow, col: newCol, capture: true });
                }
                break;
            }
            newRow += drow;
            newCol += dcol;
        }
    }
    
    return moves;
}

function getBishopMoves(row, col, color) {
    const moves = [];
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    
    for (const [drow, dcol] of directions) {
        let newRow = row + drow;
        let newCol = col + dcol;
        
        while (isValidPosition(newRow, newCol)) {
            const target = board[newRow][newCol];
            if (!target) {
                moves.push({ row: newRow, col: newCol, capture: false });
            } else {
                if (target.color !== color) {
                    moves.push({ row: newRow, col: newCol, capture: true });
                }
                break;
            }
            newRow += drow;
            newCol += dcol;
        }
    }
    
    return moves;
}

function getKnightMoves(row, col, color) {
    const moves = [];
    const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    
    for (const [drow, dcol] of knightMoves) {
        const newRow = row + drow;
        const newCol = col + dcol;
        
        if (isValidPosition(newRow, newCol)) {
            const target = board[newRow][newCol];
            if (!target || target.color !== color) {
                moves.push({ row: newRow, col: newCol, capture: !!target });
            }
        }
    }
    
    return moves;
}

function getQueenMoves(row, col, color) {
    return [...getRookMoves(row, col, color), ...getBishopMoves(row, col, color)];
}

function getKingMoves(row, col, color) {
    const moves = [];
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    
    for (const [drow, dcol] of directions) {
        const newRow = row + drow;
        const newCol = col + dcol;
        
        if (isValidPosition(newRow, newCol)) {
            const target = board[newRow][newCol];
            if (!target || target.color !== color) {
                moves.push({ row: newRow, col: newCol, capture: !!target });
            }
        }
    }
    
    return moves;
}

function isValidPosition(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function wouldBeInCheck(fromRow, fromCol, toRow, toCol, color) {
    // 仮想的に移動してチェック判定
    const originalPiece = board[fromRow][fromCol];
    const targetPiece = board[toRow][toCol];
    
    board[toRow][toCol] = originalPiece;
    board[fromRow][fromCol] = null;
    
    const inCheck = isInCheck(color);
    
    // 元に戻す
    board[fromRow][fromCol] = originalPiece;
    board[toRow][toCol] = targetPiece;
    
    return inCheck;
}

function isInCheck(color) {
    // キングの位置を探す
    let kingRow, kingCol;
    const kingPiece = color === 'white' ? PIECES.WHITE_KING : PIECES.BLACK_KING;
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col]?.piece === kingPiece) {
                kingRow = row;
                kingCol = col;
                break;
            }
        }
    }
    
    // 相手の駒がキングを攻撃できるか
    const opponentColor = color === 'white' ? 'black' : 'white';
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.color === opponentColor) {
                const moves = getBasicMoves(row, col, opponentColor);
                if (moves.some(m => m.row === kingRow && m.col === kingCol)) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

function getBasicMoves(row, col, color) {
    // チェック判定用の基本移動（再帰防止）
    const piece = board[row][col];
    if (!piece) return [];
    
    const pieceType = piece.piece;
    
    if (pieceType === PIECES.WHITE_PAWN || pieceType === PIECES.BLACK_PAWN) {
        return getPawnMoves(row, col, color);
    } else if (pieceType === PIECES.WHITE_ROOK || pieceType === PIECES.BLACK_ROOK) {
        return getRookMoves(row, col, color);
    } else if (pieceType === PIECES.WHITE_KNIGHT || pieceType === PIECES.BLACK_KNIGHT) {
        return getKnightMoves(row, col, color);
    } else if (pieceType === PIECES.WHITE_BISHOP || pieceType === PIECES.BLACK_BISHOP) {
        return getBishopMoves(row, col, color);
    } else if (pieceType === PIECES.WHITE_QUEEN || pieceType === PIECES.BLACK_QUEEN) {
        return getQueenMoves(row, col, color);
    } else if (pieceType === PIECES.WHITE_KING || pieceType === PIECES.BLACK_KING) {
        return getKingMoves(row, col, color);
    }
    
    return [];
}

function makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    const captured = board[toRow][toCol];
    
    if (captured) {
        capturedPieces[currentPlayer].push(captured.piece);
    }
    
    // 駒を移動
    board[toRow][toCol] = { ...piece, moved: true };
    board[fromRow][fromCol] = null;
    
    // プロモーションチェック
    if ((piece.piece === PIECES.WHITE_PAWN && toRow === 0) ||
        (piece.piece === PIECES.BLACK_PAWN && toRow === 7)) {
        promotionPending = { row: toRow, col: toCol, color: piece.color };
        showPromotionModal();
        return;
    }
    
    // 棋譜記録
    const moveNotation = getMoveNotation(piece.piece, fromRow, fromCol, toRow, toCol, !!captured);
    moveHistory.push(moveNotation);
    updateMoveHistory();
    
    renderBoard();
    checkGameEnd();
}

function showPromotionModal() {
    const modal = document.getElementById('gameModal');
    const modalTitle = document.getElementById('modalTitle');
    const gameOverContent = document.getElementById('gameOverContent');
    const promotionContent = document.getElementById('promotionContent');
    
    modalTitle.textContent = 'ポーン昇格';
    modalTitle.setAttribute('data-i18n', 'chess.promotion');
    gameOverContent.style.display = 'none';
    promotionContent.style.display = 'block';
    modal.style.display = 'flex';
    
    // 多言語対応のために再適用
    if (typeof applyLanguage === 'function') {
        applyLanguage();
    }
}

function promoteToQueen() {
    promotePawn(promotionPending.color === 'white' ? PIECES.WHITE_QUEEN : PIECES.BLACK_QUEEN);
}

function promoteToRook() {
    promotePawn(promotionPending.color === 'white' ? PIECES.WHITE_ROOK : PIECES.BLACK_ROOK);
}

function promoteToBishop() {
    promotePawn(promotionPending.color === 'white' ? PIECES.WHITE_BISHOP : PIECES.BLACK_BISHOP);
}

function promoteToKnight() {
    promotePawn(promotionPending.color === 'white' ? PIECES.WHITE_KNIGHT : PIECES.BLACK_KNIGHT);
}

function promotePawn(newPiece) {
    const { row, col, color } = promotionPending;
    board[row][col] = { piece: newPiece, color, moved: true };
    document.getElementById('gameModal').style.display = 'none';
    
    const moveNotation = `${String.fromCharCode(97 + col)}${8 - row}=${getPieceSymbol(newPiece)}`;
    moveHistory[moveHistory.length - 1] += '=' + getPieceSymbol(newPiece);
    updateMoveHistory();
    
    promotionPending = null;
    renderBoard();
    checkGameEnd();
}

function getPieceSymbol(piece) {
    if (piece === PIECES.WHITE_QUEEN || piece === PIECES.BLACK_QUEEN) return 'Q';
    if (piece === PIECES.WHITE_ROOK || piece === PIECES.BLACK_ROOK) return 'R';
    if (piece === PIECES.WHITE_BISHOP || piece === PIECES.BLACK_BISHOP) return 'B';
    if (piece === PIECES.WHITE_KNIGHT || piece === PIECES.BLACK_KNIGHT) return 'N';
    return '';
}

function getMoveNotation(piece, fromRow, fromCol, toRow, toCol, isCapture) {
    let notation = '';
    
    // 駒の記号
    if (piece !== PIECES.WHITE_PAWN && piece !== PIECES.BLACK_PAWN) {
        notation += getPieceSymbol(piece);
    }
    
    // 出発位置
    notation += String.fromCharCode(97 + fromCol);
    notation += (8 - fromRow);
    
    // キャプチャ
    if (isCapture) {
        notation += 'x';
    }
    
    // 到着位置
    notation += String.fromCharCode(97 + toCol);
    notation += (8 - toRow);
    
    return notation;
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    updateTurnDisplay();
}

function updateTurnDisplay() {
    const turnElement = document.getElementById('currentTurn');
    turnElement.textContent = currentPlayer === 'white' ? '白の番' : '黒の番';
    
    const checkStatus = document.getElementById('checkStatus');
    if (isInCheck(currentPlayer)) {
        checkStatus.textContent = 'チェック！';
        highlightCheck();
    } else {
        checkStatus.textContent = '';
    }
}

function highlightCheck() {
    const kingPiece = currentPlayer === 'white' ? PIECES.WHITE_KING : PIECES.BLACK_KING;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col]?.piece === kingPiece) {
                const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                cell.classList.add('in-check');
            }
        }
    }
}

function updateMoveHistory() {
    const moveList = document.getElementById('moveList');
    let html = '';
    
    for (let i = 0; i < moveHistory.length; i += 2) {
        const moveNum = Math.floor(i / 2) + 1;
        html += `<div class="move-entry">`;
        html += `<span class="move-number">${moveNum}.</span>`;
        html += `${moveHistory[i] || ''} `;
        html += `${moveHistory[i + 1] || ''}`;
        html += `</div>`;
    }
    
    moveList.innerHTML = html;
    moveList.scrollTop = moveList.scrollHeight;
}

function updateCapturedPieces() {
    document.getElementById('capturedWhite').innerHTML = capturedPieces.white.join(' ');
    document.getElementById('capturedBlack').innerHTML = capturedPieces.black.join(' ');
}

function checkGameEnd() {
    const hasLegalMoves = checkHasLegalMoves(currentPlayer);
    const inCheck = isInCheck(currentPlayer);
    
    if (!hasLegalMoves) {
        gameOver = true;
        if (inCheck) {
            // チェックメイト
            showGameOver(`${currentPlayer === 'white' ? '黒' : '白'}の勝ち！（チェックメイト）`);
        } else {
            // ステイルメイト
            showGameOver('引き分け（ステイルメイト）');
        }
    }
}

function checkHasLegalMoves(color) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.color === color) {
                const moves = getPossibleMoves(row, col);
                if (moves.length > 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

function showGameOver(message) {
    const modal = document.getElementById('gameModal');
    const modalTitle = document.getElementById('modalTitle');
    const gameOverContent = document.getElementById('gameOverContent');
    const promotionContent = document.getElementById('promotionContent');
    
    document.getElementById('gameResult').textContent = message;
    modalTitle.textContent = 'ゲーム終了';
    modalTitle.setAttribute('data-i18n', 'common.gameOver');
    gameOverContent.style.display = 'block';
    promotionContent.style.display = 'none';
    modal.style.display = 'flex';
    
    // 多言語対応のために再適用
    if (typeof applyLanguage === 'function') {
        applyLanguage();
    }
}

function closeModal() {
    document.getElementById('gameModal').style.display = 'none';
}

function makeCPUMove() {
    if (gameOver) return;
    
    let bestMove = null;
    
    if (cpuLevel === 1) {
        bestMove = getRandomMove();
    } else if (cpuLevel === 2) {
        bestMove = getBestMoveByValue();
    } else if (cpuLevel === 3) {
        bestMove = getBestMoveByMinimax();
    }
    
    if (bestMove) {
        const { fromRow, fromCol, toRow, toCol } = bestMove;
        makeMove(fromRow, fromCol, toRow, toCol);
        
        if (!gameOver) {
            switchPlayer();
        }
    }
}

function getRandomMove() {
    const allMoves = getAllLegalMoves('black');
    if (allMoves.length === 0) return null;
    return allMoves[Math.floor(Math.random() * allMoves.length)];
}

function getBestMoveByValue() {
    const allMoves = getAllLegalMoves('black');
    if (allMoves.length === 0) return null;
    
    let bestMove = null;
    let bestScore = -Infinity;
    
    for (const move of allMoves) {
        const score = evaluateMoveByCapture(move);
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    
    return bestMove;
}

function evaluateMoveByCapture(move) {
    const { toRow, toCol } = move;
    const captured = board[toRow][toCol];
    return captured ? PIECE_VALUES[captured.piece] : 0;
}

function getBestMoveByMinimax() {
    const allMoves = getAllLegalMoves('black');
    if (allMoves.length === 0) return null;
    
    let bestMove = null;
    let bestScore = -Infinity;
    
    for (const move of allMoves) {
        const score = minimax(move, 2, -Infinity, Infinity, false);
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    
    return bestMove;
}

function minimax(move, depth, alpha, beta, maximizingPlayer) {
    if (depth === 0) {
        return evaluateBoard();
    }
    
    const { fromRow, fromCol, toRow, toCol } = move;
    const originalPiece = board[fromRow][fromCol];
    const targetPiece = board[toRow][toCol];
    
    // 仮想移動
    board[toRow][toCol] = originalPiece;
    board[fromRow][fromCol] = null;
    
    let score;
    if (maximizingPlayer) {
        score = -Infinity;
        const moves = getAllLegalMoves('black');
        for (const nextMove of moves) {
            score = Math.max(score, minimax(nextMove, depth - 1, alpha, beta, false));
            alpha = Math.max(alpha, score);
            if (beta <= alpha) break;
        }
    } else {
        score = Infinity;
        const moves = getAllLegalMoves('white');
        for (const nextMove of moves) {
            score = Math.min(score, minimax(nextMove, depth - 1, alpha, beta, true));
            beta = Math.min(beta, score);
            if (beta <= alpha) break;
        }
    }
    
    // 元に戻す
    board[fromRow][fromCol] = originalPiece;
    board[toRow][toCol] = targetPiece;
    
    return score;
}

function evaluateBoard() {
    let score = 0;
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece) {
                const value = PIECE_VALUES[piece.piece];
                if (piece.color === 'black') {
                    score += value;
                } else {
                    score -= value;
                }
            }
        }
    }
    
    return score;
}

function getAllLegalMoves(color) {
    const moves = [];
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.color === color) {
                const pieceMoves = getPossibleMoves(row, col);
                pieceMoves.forEach(move => {
                    moves.push({
                        fromRow: row,
                        fromCol: col,
                        toRow: move.row,
                        toCol: move.col
                    });
                });
            }
        }
    }
    
    return moves;
}

function resetGame() {
    document.getElementById('gameModal').style.display = 'none';
    initializeGame();
}

function backToModeSelection() {
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('modeSelection').style.display = 'block';
    document.getElementById('cpuLevelSelection').style.display = 'none';
    document.getElementById('gameModal').style.display = 'none';
}
