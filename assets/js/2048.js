// 2048 ゲームロジック

class Game2048 {
    constructor(size = 4) {
        this.size = size;
        this.grid = [];
        this.score = 0;
        this.moveCount = 0;
        this.history = [];
        this.won = false;
        this.keepPlaying = false;
        this.isAnimating = false;
        
        this.initGrid();
        this.addRandomTile();
        this.addRandomTile();
    }

    initGrid() {
        this.grid = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
    }

    addRandomTile() {
        const emptyCells = [];
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.grid[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }

        if (emptyCells.length === 0) return false;

        const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        this.grid[row][col] = Math.random() < 0.9 ? 2 : 4;
        return true;
    }

    saveState() {
        this.history.push({
            grid: this.grid.map(row => [...row]),
            score: this.score,
            moveCount: this.moveCount
        });
        
        // 最大5手まで保存
        if (this.history.length > 5) {
            this.history.shift();
        }
    }

    undo() {
        if (this.history.length === 0) return false;
        
        const state = this.history.pop();
        this.grid = state.grid;
        this.score = state.score;
        this.moveCount = state.moveCount;
        return true;
    }

    move(direction) {
        if (this.isAnimating) return { moved: false };

        this.saveState();
        let moved = false;
        const mergedCells = new Set();
        let scoreGain = 0;

        const rotateGrid = (grid, times) => {
            let result = grid.map(row => [...row]);
            for (let i = 0; i < times; i++) {
                const newGrid = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
                for (let row = 0; row < this.size; row++) {
                    for (let col = 0; col < this.size; col++) {
                        newGrid[col][this.size - 1 - row] = result[row][col];
                    }
                }
                result = newGrid;
            }
            return result;
        };

        // 左移動を基準に、他の方向は回転で対応
        const rotations = { left: 0, up: 1, right: 2, down: 3 };
        const rotateCount = rotations[direction];

        this.grid = rotateGrid(this.grid, rotateCount);

        // 左方向に移動・合体
        for (let row = 0; row < this.size; row++) {
            const tiles = this.grid[row].filter(val => val !== 0);
            const merged = [];
            
            for (let i = 0; i < tiles.length; i++) {
                if (i < tiles.length - 1 && tiles[i] === tiles[i + 1]) {
                    merged.push(tiles[i] * 2);
                    scoreGain += tiles[i] * 2;
                    i++; // 次のタイルをスキップ
                } else {
                    merged.push(tiles[i]);
                }
            }

            // 元のグリッドと比較
            const newRow = [...merged, ...Array(this.size - merged.length).fill(0)];
            if (JSON.stringify(this.grid[row]) !== JSON.stringify(newRow)) {
                moved = true;
            }
            this.grid[row] = newRow;
        }

        // 元の向きに戻す
        this.grid = rotateGrid(this.grid, 4 - rotateCount);

        if (moved) {
            this.score += scoreGain;
            this.moveCount++;
            this.addRandomTile();

            // 2048達成チェック
            if (!this.won && !this.keepPlaying) {
                for (let row = 0; row < this.size; row++) {
                    for (let col = 0; col < this.size; col++) {
                        if (this.grid[row][col] === 2048) {
                            this.won = true;
                            return { moved: true, won: true, scoreGain };
                        }
                    }
                }
            }
        } else {
            // 移動できなかった場合は履歴から削除
            this.history.pop();
        }

        return { moved, scoreGain };
    }

    isGameOver() {
        // 空きマスがあればゲーム継続
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.grid[row][col] === 0) return false;
            }
        }

        // 隣接する同じ数字があればゲーム継続
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const current = this.grid[row][col];
                
                // 右隣チェック
                if (col < this.size - 1 && this.grid[row][col + 1] === current) return false;
                
                // 下隣チェック
                if (row < this.size - 1 && this.grid[row + 1][col] === current) return false;
            }
        }

        return true; // ゲームオーバー
    }

    getMaxTile() {
        let max = 0;
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                max = Math.max(max, this.grid[row][col]);
            }
        }
        return max;
    }

    getBestMove() {
        // シンプルなヒント: 最大タイルを右下隅に維持する戦略
        const maxTile = this.getMaxTile();
        let maxPos = null;

        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.grid[row][col] === maxTile) {
                    maxPos = { row, col };
                    break;
                }
            }
            if (maxPos) break;
        }

        if (!maxPos) return 'down';

        // 最大タイルが右下にない場合
        if (maxPos.row < this.size - 1) return 'down';
        if (maxPos.col < this.size - 1) return 'right';
        
        return 'left'; // デフォルト
    }
}

// UI管理
class GameUI {
    constructor() {
        this.game = null;
        this.selectedSize = 4;
        this.touchStartX = 0;
        this.touchStartY = 0;
        
        this.initElements();
        this.loadBestScores();
        this.setupEventListeners();
        this.updateBestScoresDisplay();
    }

    initElements() {
        // スタート画面
        this.startScreen = document.getElementById('startScreen');
        this.gameScreen = document.getElementById('gameScreen');
        this.startBtn = document.getElementById('startBtn');
        this.sizeButtons = document.querySelectorAll('.size-btn');

        // ゲーム画面
        this.gridContainer = document.getElementById('gridContainer');
        this.currentScoreEl = document.getElementById('currentScore');
        this.bestScoreEl = document.getElementById('bestScore');
        this.moveCountEl = document.getElementById('moveCount');
        this.maxTileEl = document.getElementById('maxTile');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.undoBtn = document.getElementById('undoBtn');
        this.hintBtn = document.getElementById('hintBtn');

        // モーダル
        this.winModal = document.getElementById('winModal');
        this.gameOverModal = document.getElementById('gameOverModal');
        this.keepPlayingBtn = document.getElementById('keepPlayingBtn');
        this.newGameFromWinBtn = document.getElementById('newGameFromWinBtn');
        this.tryAgainBtn = document.getElementById('tryAgainBtn');
        this.backToMenuBtn = document.getElementById('backToMenuBtn');
    }

    setupEventListeners() {
        // サイズ選択
        this.sizeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.sizeButtons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedSize = parseInt(btn.dataset.size);
            });
        });

        // ゲーム開始
        this.startBtn.addEventListener('click', () => this.startGame());

        // コントロールボタン
        this.newGameBtn.addEventListener('click', () => this.startGame());
        this.undoBtn.addEventListener('click', () => this.handleUndo());
        this.hintBtn.addEventListener('click', () => this.showHint());

        // キーボード操作
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // タッチ操作
        this.gridContainer.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.gridContainer.addEventListener('touchend', (e) => this.handleTouchEnd(e));

        // モーダルボタン
        this.keepPlayingBtn.addEventListener('click', () => this.keepPlaying());
        this.newGameFromWinBtn.addEventListener('click', () => this.startGame());
        this.tryAgainBtn.addEventListener('click', () => this.startGame());
        this.backToMenuBtn.addEventListener('click', () => this.backToMenu());
    }

    startGame() {
        // プレイ数を記録
        if (typeof GameStats !== 'undefined') {
            GameStats.incrementPlayCount('2048');
        }
        
        this.game = new Game2048(this.selectedSize);
        this.startScreen.classList.remove('active');
        this.gameScreen.classList.add('active');
        this.winModal.classList.remove('active');
        this.gameOverModal.classList.remove('active');
        
        this.renderGrid();
        this.updateUI();
        this.updateBestScore();
    }

    renderGrid() {
        const size = this.game.size;
        const cellSize = Math.min(500 / size, 110);
        const gap = 10;
        const gridSize = cellSize * size + gap * (size + 1);

        this.gridContainer.style.width = gridSize + 'px';
        this.gridContainer.style.height = gridSize + 'px';
        this.gridContainer.innerHTML = '';

        // グリッド背景
        const grid = document.createElement('div');
        grid.className = `grid size-${size}`;
        grid.style.width = gridSize + 'px';
        grid.style.height = gridSize + 'px';

        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.width = cellSize + 'px';
            cell.style.height = cellSize + 'px';
            grid.appendChild(cell);
        }

        this.gridContainer.appendChild(grid);

        // タイル配置
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const value = this.game.grid[row][col];
                if (value !== 0) {
                    this.createTile(row, col, value, cellSize, gap);
                }
            }
        }
    }

    createTile(row, col, value, cellSize, gap) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.dataset.value = value;
        tile.textContent = value;
        
        const fontSize = cellSize * (value >= 1024 ? 0.4 : value >= 128 ? 0.45 : 0.5);
        tile.style.fontSize = fontSize + 'px';
        tile.style.width = cellSize + 'px';
        tile.style.height = cellSize + 'px';
        tile.style.left = (col * (cellSize + gap) + gap) + 'px';
        tile.style.top = (row * (cellSize + gap) + gap) + 'px';

        this.gridContainer.appendChild(tile);
    }

    updateUI() {
        this.currentScoreEl.textContent = this.game.score;
        this.moveCountEl.textContent = this.game.moveCount;
        this.maxTileEl.textContent = this.game.getMaxTile();
        this.updateBestScore();
    }

    handleKeyPress(e) {
        if (!this.game || this.startScreen.classList.contains('active')) return;

        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'w': 'up',
            'W': 'up',
            's': 'down',
            'S': 'down',
            'a': 'left',
            'A': 'left',
            'd': 'right',
            'D': 'right'
        };

        const direction = keyMap[e.key];
        if (direction) {
            e.preventDefault();
            this.handleMove(direction);
        }
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
    }

    handleTouchEnd(e) {
        if (!this.game) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const dx = touchEndX - this.touchStartX;
        const dy = touchEndY - this.touchStartY;

        const minSwipeDistance = 30;
        
        if (Math.abs(dx) < minSwipeDistance && Math.abs(dy) < minSwipeDistance) return;

        let direction;
        if (Math.abs(dx) > Math.abs(dy)) {
            direction = dx > 0 ? 'right' : 'left';
        } else {
            direction = dy > 0 ? 'down' : 'up';
        }

        this.handleMove(direction);
    }

    handleMove(direction) {
        const result = this.game.move(direction);
        
        if (result.moved) {
            this.renderGrid();
            this.updateUI();
            
            if (result.won) {
                setTimeout(() => this.showWinModal(), 300);
            } else if (this.game.isGameOver()) {
                setTimeout(() => this.showGameOverModal(), 300);
            }
        }
    }

    handleUndo() {
        if (this.game.undo()) {
            this.renderGrid();
            this.updateUI();
        }
    }

    showHint() {
        const bestMove = this.game.getBestMove();
        const directions = {
            'up': '↑',
            'down': '↓',
            'left': '←',
            'right': '→'
        };
        
        this.hintBtn.textContent = `💡 ${directions[bestMove]}`;
        setTimeout(() => {
            this.hintBtn.textContent = '💡';
        }, 1500);
    }

    showWinModal() {
        document.getElementById('winScore').textContent = this.game.score;
        document.getElementById('winMoves').textContent = this.game.moveCount;
        this.winModal.classList.add('active');
        this.saveBestScore();
    }

    showGameOverModal() {
        document.getElementById('gameOverScore').textContent = this.game.score;
        document.getElementById('gameOverMaxTile').textContent = this.game.getMaxTile();
        document.getElementById('gameOverMoves').textContent = this.game.moveCount;
        this.gameOverModal.classList.add('active');
        this.saveBestScore();
    }

    keepPlaying() {
        this.game.keepPlaying = true;
        this.winModal.classList.remove('active');
    }

    backToMenu() {
        this.startScreen.classList.add('active');
        this.gameScreen.classList.remove('active');
        this.gameOverModal.classList.remove('active');
    }

    loadBestScores() {
        this.bestScores = {
            3: parseInt(localStorage.getItem('2048_best_3x3') || '0'),
            4: parseInt(localStorage.getItem('2048_best_4x4') || '0'),
            5: parseInt(localStorage.getItem('2048_best_5x5') || '0')
        };
    }

    saveBestScore() {
        const size = this.game.size;
        const currentBest = this.bestScores[size];
        
        if (this.game.score > currentBest) {
            this.bestScores[size] = this.game.score;
            localStorage.setItem(`2048_best_${size}x${size}`, this.game.score.toString());
            this.updateBestScoresDisplay();
        }
    }

    updateBestScore() {
        const size = this.game.size;
        this.bestScoreEl.textContent = this.bestScores[size];
    }

    updateBestScoresDisplay() {
        document.getElementById('best3x3').textContent = this.bestScores[3];
        document.getElementById('best4x4').textContent = this.bestScores[4];
        document.getElementById('best5x5').textContent = this.bestScores[5];
    }
}

// ゲーム初期化
let gameUI;
document.addEventListener('DOMContentLoaded', () => {
    gameUI = new GameUI();
});
