/**
 * ルドーゲーム実装
 * 仕様書 v1 に基づく実装
 */

// ============================================
// ユーティリティ関数
// ============================================

/**
 * 指定されたミリ秒だけ待機する関数（アニメーション用）
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// ゲーム定数の定義
// ============================================

// ゲームで使用する色の配列（赤、青、黄、緑の4色）
const COLORS = ['red', 'blue', 'yellow', 'green'];

// 色名を日本語で表示するための対応表
const COLOR_NAMES = { red: '赤', blue: '青', yellow: '黄', green: '緑' };

// 各プレイヤーが持つコマの数（1人4個）
const TOKENS_PER_PLAYER = 4;

// ゲームボードのサイズ（11×11マス）
const BOARD_SIZE = 11;

// ボード上のメインパス（円形の通路）の長さ
// 全プレイヤーが共通で使用する40マスの円形通路
const PATH_LENGTH = 40;

// ゴールまでの最終パス（ホームパス）の長さ
// 各色ごとに専用の4マスがある
const HOME_PATH_LENGTH = 4;

// セーフマスの配列（このゲームでは存在しない）
// 通常のルドーにはセーフマスがあるが、この実装では全てのマスで捕獲が可能
const SAFE_POSITIONS = [];

// 各色のスタート位置（パス配列内のインデックス）
// コマがベースから出た時に最初に配置される位置
const START_POSITIONS = {
    red: 0,      // 赤のスタート位置：パス配列の位置0 (ボード座標: row=4, col=0)
    blue: 10,    // 青のスタート位置：パス配列の位置10 (ボード座標: row=0, col=6)
    yellow: 20,  // 黄のスタート位置：パス配列の位置20 (ボード座標: row=6, col=10)
    green: 30    // 緑のスタート位置：パス配列の位置30 (ボード座標: row=10, col=4)
};

// ============================================
// ゲーム状態の管理
// ============================================

// ゲームの全ての状態を保持するオブジェクト
let gameState = {
    playerCount: 4,              // プレイヤー人数（デフォルトは4人）
    playerCountSelected: false,  // プレイヤー人数が選択されたかどうか
    players: [],                 // プレイヤー情報の配列（色とタイプを保持）
    currentPlayerIndex: 0,       // 現在のターンのプレイヤーのインデックス（0〜3）
    diceValue: null,             // サイコロの目（1〜6、振る前はnull）
    tokens: {},                  // 全プレイヤーのコマの状態を保持するオブジェクト
    settings: {
        requireSixToStart: true,    // ベースからコマを出すのに6が必要か
        extraTurnOnSix: true,       // 6が出たら追加ターンがあるか
        exactRollToFinish: true,    // ゴールにぴったりの目が必要か
        cpuThinkingTime: true       // CPUの思考時間を表示するか
    },
    isRolled: false,             // サイコロを振ったかどうか（二重に振ることを防ぐ）
    movableTokens: [],           // 現在動かせるコマのIDの配列
    gameStarted: false,          // ゲームが開始されたかどうか
    winners: [],                 // ゴールしたプレイヤーの順位リスト
    turnCount: 0                 // 現在のターン数（何ターン目か）
};

/**
 * ページロード時の初期化処理
 * HTMLが読み込まれた後に自動的に実行される
 */
document.addEventListener('DOMContentLoaded', () => {
    // デフォルトで4人プレイを選択状態にする
    // :nth-child(4)で4番目のボタン（4人ボタン）を取得
    const defaultButton = document.querySelector('.player-count-buttons .setup-button:nth-child(4)');
    if (defaultButton) {
        // 'active'クラスを追加して選択状態にする
        defaultButton.classList.add('active');
    }
    // プレイヤー人数が選択されたことを記録
    gameState.playerCountSelected = true;
    // プレイヤー設定UIを表示
    renderPlayerSetup();
    // コンソールに起動メッセージを出力
    console.log('ルドーゲーム起動');
});

/**
 * プレイヤー人数を設定する関数
 * ユーザーが人数ボタンをクリックした時に呼ばれる
 * @param {number} count - 選択されたプレイヤー人数（2、3、または4）
 */
function setPlayerCount(count) {
    // 選択された人数をゲーム状態に保存
    gameState.playerCount = count;
    // 人数が選択されたことを記録
    gameState.playerCountSelected = true;
    
    // 全ての人数ボタンから'active'クラスを削除（選択解除）
    document.querySelectorAll('.player-count-buttons .setup-button').forEach(btn => {
        btn.classList.remove('active');
    });
    // クリックされたボタンに'active'クラスを追加（選択状態にする）
    event.target.classList.add('active');
    
    // 選択された人数に応じてプレイヤー設定UIを再生成
    renderPlayerSetup();
}

/**
 * プレイヤー設定UIを生成する関数
 * 各プレイヤーの色とタイプ（人間/CPU）を選択するUI要素を作成
 */
function renderPlayerSetup() {
    // プレイヤー設定を表示するコンテナ要素を取得
    const container = document.getElementById('playerSetup');
    // 既存の内容をクリア
    container.innerHTML = '';
    
    // 選択されたプレイヤー人数分だけループ
    for (let i = 0; i < gameState.playerCount; i++) {
        // i番目のプレイヤーの色を取得（0=赤、1=青、2=黄、3=緑）
        const color = COLORS[i];
        
        // 各プレイヤーの設定用のdiv要素を作成
        const div = document.createElement('div');
        div.className = 'player-config';
        
        // HTML構造を文字列で定義
        // - 色インジケーター：プレイヤーの色を表示する小さな四角
        // - ラベル：色名を日本語で表示
        // - セレクトボックス：人間かCPU（レベル1-3）かを選択
        div.innerHTML = `
            <div class="player-color-indicator" style="background-color: ${getColorHex(color)};"></div>
            <label>${COLOR_NAMES[color]}</label>
            <select id="player-${i}-type">
                <option value="human">プレイヤー</option>
                <option value="ai1">CPU レベル1</option>
                <option value="ai2">CPU レベル2</option>
                <option value="ai3">CPU レベル3</option>
            </select>
        `;
        
        // 作成したdiv要素をコンテナに追加
        container.appendChild(div);
    }
}

/**
 * 色のHEX値を取得する関数
 * CSSで使用する16進数カラーコードを返す
 * @param {string} color - 色名（'red', 'blue', 'yellow', 'green'）
 * @returns {string} HEXカラーコード（例: '#f44336'）
 */
function getColorHex(color) {
    // 各色に対応するHEXカラーコードの対応表
    const colors = {
        red: '#f44336',      // 赤
        blue: '#2196f3',     // 青
        yellow: '#fbc02d',   // 黄
        green: '#4caf50'     // 緑
    };
    // 指定された色のHEXコードを返す
    return colors[color];
}

/**
 * ゲームを開始する関数
 * 「ゲーム開始」ボタンがクリックされた時に呼ばれる
 */
function startGame() {
    // ゲームのプレイ回数を記録（game-stats.jsが読み込まれている場合）
    if (typeof GameStats !== 'undefined') {
        GameStats.incrementPlayCount('ludo');
    }
    
    // プレイヤー人数が選択されているかを確認
    if (!gameState.playerCountSelected) {
        // 未選択の場合はアラートを表示して処理を中断
        alert('⚠️ プレイヤー人数を選択してください！');
        return;
    }
    
    // プレイヤー設定を読み込む
    gameState.players = []; // プレイヤー配列を初期化
    
    // 選択された人数分のプレイヤー情報を作成
    for (let i = 0; i < gameState.playerCount; i++) {
        // セレクトボックスから選択された値を取得（'human'または'ai1'/'ai2'/'ai3'）
        const type = document.getElementById(`player-${i}-type`).value;
        
        // プレイヤー情報をオブジェクトとして配列に追加
        gameState.players.push({
            color: COLORS[i],        // プレイヤーの色
            type: type,              // プレイヤーのタイプ（人間またはCPU）
            finishedTokens: 0        // ゴールしたコマの数（初期値は0）
        });
    }
    
    // ルール設定をチェックボックスから読み込む
    gameState.settings.requireSixToStart = document.getElementById('requireSixToStart').checked;    // 6でスタート
    gameState.settings.extraTurnOnSix = document.getElementById('extraTurnOnSix').checked;          // 6で追加ターン
    gameState.settings.exactRollToFinish = document.getElementById('exactRollToFinish').checked;    // ぴったりでゴール
    gameState.settings.cpuThinkingTime = document.getElementById('cpuThinkingTime').checked;        // CPU思考時間
    
    // 全プレイヤーのコマを初期化（ベースに配置）
    initTokens();
    
    // UI（画面表示）を切り替える
    document.getElementById('gameSetup').style.display = 'none';      // 設定画面を非表示
    document.getElementById('gameContainer').style.display = 'block'; // ゲーム画面を表示
    
    // ボードを描画
    renderBoard();
    // ステータス（現在のプレイヤー、スコアなど）を更新
    updateStatus();
    
    // ゲーム状態を初期化
    gameState.gameStarted = true;        // ゲームが開始されたフラグをtrueに
    gameState.currentPlayerIndex = 0;    // 最初のプレイヤー（赤）から開始
    gameState.isRolled = false;          // サイコロはまだ振られていない
    gameState.winners = [];              // 勝者リストを空にする
    gameState.turnCount = 1;             // ターン数を1に設定
    
    // ゲーム開始のログを記録
    addLog('ゲーム開始！');
    const currentPlayer = getCurrentPlayer();
    addLog(`--- ターン1: ${COLOR_NAMES[currentPlayer.color]}のターン ---`);
    
    // 最初のプレイヤーがCPU（AI）の場合は自動的にターンを開始
    if (getCurrentPlayer().type !== 'human') {
        // CPU思考時間の設定が有効な場合
        if (gameState.settings.cpuThinkingTime) {
            // 「思考中...」表示を出す
            showThinking();
            // 0.6〜1.8秒のランダムな時間待機（人間らしさを演出）
            const thinkTime = 600 + Math.random() * 1200;
            setTimeout(() => {
                hideThinking();  // 思考中表示を消す
                aiTurn();        // CPUのターンを実行
            }, thinkTime);
        } else {
            // 思考時間なしの場合は即座に実行
            aiTurn();
        }
    }
    
    // デバッグ用：コンソールにゲーム状態を出力
    console.log('ゲーム開始', gameState);
}

/**
 * 全プレイヤーのコマを初期化する関数
 * 各プレイヤーの4つのコマをベースに配置する
 */
function initTokens() {
    // トークンオブジェクトを空にする
    gameState.tokens = {};
    
    // デバッグモードが有効かチェック
    const debugMode = document.getElementById('debugMode') && document.getElementById('debugMode').checked;
    
    // 各プレイヤーごとにコマを初期化
    for (let i = 0; i < gameState.playerCount; i++) {
        const color = COLORS[i];  // プレイヤーの色を取得
        gameState.tokens[color] = [];  // この色のコマ配列を初期化
        
        // デバッグモード時は、プレイヤーのfinishedTokensを3に設定
        if (debugMode && gameState.players[i]) {
            gameState.players[i].finishedTokens = 3;
        }
        
        // 1プレイヤーあたり4つのコマを作成
        for (let j = 0; j < TOKENS_PER_PLAYER; j++) {
            // デバッグモード: 最初の3つのコマをゴール済みにする
            if (debugMode && j < 3) {
                gameState.tokens[color].push({
                    id: j,
                    position: 1003,          // ホームパスの最後（ゴール位置）
                    isInHomePath: true,
                    homePathPosition: 3,
                    isFinished: true         // ゴール済み
                });
            } else {
                gameState.tokens[color].push({
                    id: j,                   // コマのID（0〜3）
                    position: -1,            // 位置（-1 = ベースにいる状態）
                    isInHomePath: false,     // ホームパス（ゴール手前の専用路）にいるか
                    homePathPosition: -1,    // ホームパス内での位置（0〜3、未使用時は-1）
                    isFinished: false        // ゴールしたかどうか
                });
            }
        }
    }
    
    if (debugMode) {
        console.log('🔧 デバッグモード: 各プレイヤーの3コマがゴール済みでスタート');
        console.log('デバッグ状態:', gameState.tokens);
    }
}

/**
 * ボード描画
 */
function renderBoard() {
    const board = document.getElementById('ludoBoard');
    board.innerHTML = '';
    
    // 15x15グリッドでルドーボードを作成
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'board-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // ボードのレイアウト設定（簡略版）
            setCellType(cell, row, col);
            
            board.appendChild(cell);
        }
    }
    
    // トークン配置
    renderTokens();
}

/**
 * セルタイプ設定
 */
function setCellType(cell, row, col) {
    // 赤エリア（左上） - 1つの大きなエリアとして表示
    if (row === 0 && col === 0 && row < 4 && col < 4) {
        cell.classList.add('base-area', 'red', 'base-container');
        cell.style.gridRow = '1 / 5';
        cell.style.gridColumn = '1 / 5';
        // 4つのトークンスロットを内部に配置
        cell.innerHTML = `
            <div class="base-slots">
                <div class="slot-circle" data-slot="0"></div>
                <div class="slot-circle" data-slot="1"></div>
                <div class="slot-circle" data-slot="2"></div>
                <div class="slot-circle" data-slot="3"></div>
            </div>
        `;
    } else if (row < 4 && col < 4 && !(row === 0 && col === 0)) {
        // 他のベースエリアセルは非表示
        cell.style.display = 'none';
    }
    // 青エリア（右上）
    else if (row === 0 && col === 7 && row < 4 && col > 6) {
        cell.classList.add('base-area', 'blue', 'base-container');
        cell.style.gridRow = '1 / 5';
        cell.style.gridColumn = '8 / 12';
        cell.innerHTML = `
            <div class="base-slots">
                <div class="slot-circle" data-slot="0"></div>
                <div class="slot-circle" data-slot="1"></div>
                <div class="slot-circle" data-slot="2"></div>
                <div class="slot-circle" data-slot="3"></div>
            </div>
        `;
    } else if (row < 4 && col > 6 && !(row === 0 && col === 7)) {
        cell.style.display = 'none';
    }
    // 黄エリア（右下）
    else if (row === 7 && col === 7 && row > 6 && col > 6) {
        cell.classList.add('base-area', 'yellow', 'base-container');
        cell.style.gridRow = '8 / 12';
        cell.style.gridColumn = '8 / 12';
        cell.innerHTML = `
            <div class="base-slots">
                <div class="slot-circle" data-slot="0"></div>
                <div class="slot-circle" data-slot="1"></div>
                <div class="slot-circle" data-slot="2"></div>
                <div class="slot-circle" data-slot="3"></div>
            </div>
        `;
    } else if (row > 6 && col > 6 && !(row === 7 && col === 7)) {
        cell.style.display = 'none';
    }
    // 緑エリア（左下）
    else if (row === 7 && col === 0 && row > 6 && col < 4) {
        cell.classList.add('base-area', 'green', 'base-container');
        cell.style.gridRow = '8 / 12';
        cell.style.gridColumn = '1 / 5';
        cell.innerHTML = `
            <div class="base-slots">
                <div class="slot-circle" data-slot="0"></div>
                <div class="slot-circle" data-slot="1"></div>
                <div class="slot-circle" data-slot="2"></div>
                <div class="slot-circle" data-slot="3"></div>
            </div>
        `;
    } else if (row > 6 && col < 4 && !(row === 7 && col === 0)) {
        cell.style.display = 'none';
    }
    // パス
    else {
        cell.classList.add('path');
        
        // スタートマス（矢印付き）
        if (row === 4 && col === 0) {
            cell.classList.add('start', 'red');
            cell.innerHTML = '➡️';
        } else if (row === 0 && col === 6) {
            cell.classList.add('start', 'blue');
            cell.innerHTML = '⬇️';
        } else if (row === 6 && col === 10) {
            cell.classList.add('start', 'yellow');
            cell.innerHTML = '⬅️';
        } else if (row === 10 && col === 4) {
            cell.classList.add('start', 'green');
            cell.innerHTML = '⬆️';
        }
        
        
        // ホームパス（各色の最終ゴールへの道）
        // 赤：(col, row) = (1, 5), (2, 5), (3, 5), (4, 5)
        if (row === 5 && col >= 1 && col <= 4) {
            cell.classList.add('home-path', 'red');
        }
        // 青：(col, row) = (5, 1), (5, 2), (5, 3), (5, 4)
        else if (col === 5 && row >= 1 && row <= 4) {
            cell.classList.add('home-path', 'blue');
        }
        // 黄：(col, row) = (6, 5), (7, 5), (8, 5), (9, 5)
        else if (row === 5 && col >= 6 && col <= 9) {
            cell.classList.add('home-path', 'yellow');
        }
        // 緑：(col, row) = (5, 6), (5, 7), (5, 8), (5, 9)
        else if (col === 5 && row >= 6 && row <= 9) {
            cell.classList.add('home-path', 'green');
        } else if (row === 5 && col >= 1 && col <= 4) {
            cell.classList.add('home-path', 'red');
        }
        
        // ゴール（中央）
        if (row >= 4 && row <= 6 && col >= 4 && col <= 6) {
            // 中央のゴールエリアは通常のpathセルとして表示
        }
    }
}

/**
 * トークン描画
 */
function renderTokens() {
    // 既存のトークンを削除
    document.querySelectorAll('.token').forEach(t => t.remove());
    
    for (const color in gameState.tokens) {
        gameState.tokens[color].forEach((token, index) => {
            const tokenEl = document.createElement('div');
            tokenEl.className = `token ${color}`;
            tokenEl.textContent = index + 1;
            tokenEl.dataset.color = color;
            tokenEl.dataset.id = index;
            
            // ゴールしたトークンはホームパスの最後のマスに配置
            if (token.isFinished) {
                const goalPositions = {
                    red: [{ row: 5, col: 4 }],   // ホームパス3
                    blue: [{ row: 4, col: 5 }],  // ホームパス3
                    yellow: [{ row: 5, col: 6 }], // ホームパス3
                    green: [{ row: 6, col: 5 }]  // ホームパス3
                };
                const pos = goalPositions[color][0];
                const cell = document.querySelector(`[data-row="${pos.row}"][data-col="${pos.col}"]`);
                if (cell) {
                    tokenEl.classList.add('finished');
                    cell.appendChild(tokenEl);
                    console.log(`${color}のトークン${index + 1}をゴール位置(${pos.row},${pos.col})に配置`);
                }
                return;
            }
            
            // 動かせるトークンの場合
            if (gameState.movableTokens.some(t => t.color === color && t.id === index)) {
                tokenEl.classList.add('movable');
                tokenEl.onclick = async () => await moveToken(color, index);
            }
            
            // トークンの位置を計算して配置
            const pos = getTokenDOMPosition(color, token);
            if (pos) {
                const cell = document.querySelector(`[data-row="${pos.row}"][data-col="${pos.col}"]`);
                if (cell) {
                    // ベースエリアの場合、対応するスロット内に配置
                    if (token.position === -1) {
                        // 正しい色のベースエリアかを確認
                        if (cell.classList.contains('base-container') && cell.classList.contains(color)) {
                            const slots = cell.querySelectorAll('.slot-circle');
                            if (slots[token.id]) {
                                slots[token.id].appendChild(tokenEl);
                                console.log(`${color}のトークン${index + 1}をベースのスロットに配置`);
                            } else {
                                cell.appendChild(tokenEl);
                                console.log(`${color}のトークン${index + 1}をベースに配置`);
                            }
                        } else {
                            console.warn(`${color}のトークン${index + 1}はベースエリアではない場所に配置しようとしました`);
                        }
                    } else {
                        cell.appendChild(tokenEl);
                        console.log(`${color}のトークン${index + 1}を位置${token.position}(${pos.row},${pos.col})に配置`);
                    }
                } else {
                    console.error(`セルが見つかりません: ${color}のトークン${index + 1}, 位置=${token.position}, 座標=(${pos.row}, ${pos.col})`);
                }
            } else {
                console.error(`座標が取得できません: ${color}のトークン${index + 1}, 位置=${token.position}`);
            }
        });
    }
}

/**
 * トークンのDOM位置取得
 */
function getTokenDOMPosition(color, token) {
    if (token.position === -1) {
        // ベース - 大きなbase-containerセル内のスロット位置を返す
        const baseContainers = {
            red: { row: 0, col: 0 },
            blue: { row: 0, col: 7 },
            yellow: { row: 7, col: 7 },
            green: { row: 7, col: 0 }
        };
        const baseContainer = baseContainers[color];
        
        // base-containerセル内のスロットを探して位置を返す
        const containerCell = document.querySelector(
            `[data-row="${baseContainer.row}"][data-col="${baseContainer.col}"]`
        );
        if (containerCell) {
            const slots = containerCell.querySelectorAll('.slot-circle');
            if (slots[token.id]) {
                // スロットがある場合は、そのコンテナセルの位置を返す
                // トークンはスロット内に配置される
                return baseContainer;
            }
        }
        
        // フォールバック（念のため）
        return baseContainer;
    }
    
    // ホームパスにいる場合
    if (token.position >= 1000 && token.position < 9999) {
        const homeIndex = token.position - 1000;
        const homePaths = {
            red: [{ row: 5, col: 1 }, { row: 5, col: 2 }, { row: 5, col: 3 }, { row: 5, col: 4 }],
            blue: [{ row: 1, col: 5 }, { row: 2, col: 5 }, { row: 3, col: 5 }, { row: 4, col: 5 }],
            yellow: [{ row: 5, col: 9 }, { row: 5, col: 8 }, { row: 5, col: 7 }, { row: 5, col: 6 }],
            green: [{ row: 9, col: 5 }, { row: 8, col: 5 }, { row: 7, col: 5 }, { row: 6, col: 5 }]
        };
        if (homePaths[color] && homePaths[color][homeIndex]) {
            return homePaths[color][homeIndex];
        }
    }
    
    // ボード上の位置をマッピング
    return getPathPosition(token.position);
}

/**
 * パス位置取得
 * 11×11ボードのパス（40マス）
 * 図の矢印に従った正確なパス
 */
function getPathPosition(position) {
    const path = [
        // 位置0-9: 赤スタート(row:4, col:0)から時計回り
        { row: 4, col: 0 },  // 0: 　赤スタート
        { row: 4, col: 1 },  // 1: 
        { row: 4, col: 2 },  // 2: 
        { row: 4, col: 3 },  // 3: 
        { row: 4, col: 4 },  // 4: ↑
        { row: 3, col: 4 },  // 5: ↑
        { row: 2, col: 4 },  // 6: ↑
        { row: 1, col: 4 },  // 7: ↑
        { row: 0, col: 4 },  // 8: 
        { row: 0, col: 5 },  // 9: （赤のホームパス入口手前）
        
        // 位置10-19: 青スタート(row:0, col:6)
        { row: 0, col: 6 },  // 10: ↓　青スタート
        { row: 1, col: 6 },  // 11: ↓
        { row: 2, col: 6 },  // 12: ↓
        { row: 3, col: 6 },  // 13: ↓
        { row: 4, col: 6 },  // 14: 
        { row: 4, col: 7 },  // 15: 
        { row: 4, col: 8 },  // 16: 
        { row: 4, col: 9 },  // 17: 
        { row: 4, col: 10 }, // 18: ↓
        { row: 5, col: 10 }, // 19: ↓（青のホームパス入口手前）
        
        // 位置20-29: 黄スタート(row:6, col:10)
        { row: 6, col: 10 }, // 20:  黄スタート
        { row: 6, col: 9 },  // 21: 
        { row: 6, col: 8 },  // 22: 
        { row: 6, col: 7 },  // 23: 
        { row: 6, col: 6 },  // 24: ↓
        { row: 7, col: 6 },  // 25: ↓
        { row: 8, col: 6 },  // 26: ↓
        { row: 9, col: 6 },  // 27: ↓
        { row: 10, col: 6 }, // 28: 
        { row: 10, col: 5 }, // 29: （黄のホームパス入口手前）
        
        // 位置30-39: 緑スタート(row:10, col:4)
        { row: 10, col: 4 }, // 30: ↑　緑スタート
        { row: 9, col: 4 }, // 31: ↑
        { row: 8, col: 4 }, // 32: ↑
        { row: 7, col: 4 }, // 33: ↑
        { row: 6, col: 4 }, // 34: 
        { row: 6, col: 3 },  // 35: 
        { row: 6, col: 2 },  // 36: 
        { row: 6, col: 1 },  // 37: 
        { row: 6, col: 0 },  // 38: ↑
        { row: 5, col: 0 },  // 39: ↑（緑のホームパス入口手前）
    ];
    
    if (position >= 0 && position < path.length) {
        return path[position];
    }
    
    console.error(`getPathPosition: 無効な位置=${position}`);
    return { row: 5, col: 5 }; // デフォルト（中央）
}

/**
 * 現在のターンのプレイヤーを取得する関数
 * @returns {Object} 現在のプレイヤーオブジェクト（色とタイプを含む）
 */
function getCurrentPlayer() {
    // currentPlayerIndexを使って、players配列から現在のプレイヤーを取得
    return gameState.players[gameState.currentPlayerIndex];
}

/**
 * サイコロを振る関数（ボタンクリック時）
 * 人間のプレイヤーがサイコロボタンをクリックした時に呼ばれる
 */
function rollDice() {
    // ゲームが終了している場合は何もしない
    const allPlayersFinished = gameState.players.every(p => 
        gameState.tokens[p.color].every(t => t.isFinished)
    );
    if (allPlayersFinished) return;
    
    // 既にサイコロを振っている場合は何もしない（二重クリック防止）
    if (gameState.isRolled) return;
    
    // CPUのターンの場合は何もしない（CPUは自動で振る）
    if (getCurrentPlayer().type !== 'human') return;
    
    // サイコロを振る処理を実行
    performDiceRoll();
}

/**
 * サイコロを振る共通処理
 * 人間とCPU両方で使用される実際のサイコロ処理
 */
function performDiceRoll() {
    const player = getCurrentPlayer();
    const tokens = gameState.tokens[player.color];
    
    // ゲームが終了しているかチェック
    const allPlayersFinished = gameState.players.every(p => 
        gameState.tokens[p.color].every(t => t.isFinished)
    );
    if (allPlayersFinished) {
        return; // ゲーム終了済みなので何もしない
    }
    
    // 現在のプレイヤーの全トークンがゴール済みかチェック
    const allTokensFinished = tokens.every(t => t.isFinished);
    if (allTokensFinished) {
        addLog(`${COLOR_NAMES[player.color]}は全トークンがゴール済みなのでスキップ`);
        nextTurn();
        return;
    }
    
    // 全トークンがベースにいるかチェック（ゴール済みトークンは除外）
    const tokensInBase = tokens.filter(t => t.position === -1 && !t.isFinished);
    const tokensOnBoard = tokens.filter(t => t.position !== -1 && !t.isFinished);
    
    // ボード上に動かせるトークンがない場合（全てベースかゴール済み）
    if (tokensOnBoard.length === 0 && tokensInBase.length > 0) {
        // 6が必要な設定の場合
        if (gameState.settings.requireSixToStart) {
            // スタート位置をチェック（他の自分のトークンがいないか）
            const startPos = START_POSITIONS[player.color];
            const hasOwnTokenAtStart = tokens.some(t => t.position === startPos && !t.isFinished);
            
            // スタート位置が埋まっている場合は自動パス（6を出してもトークンを出せない）
            if (hasOwnTokenAtStart) {
                addLog(`${COLOR_NAMES[player.color]}は動かせるトークンがないため自動パス`);
                nextTurn();
                return;
            }
            // スタート位置が空いていれば6を出す可能性があるのでサイコロを振る
        }
        // 6が不要な設定の場合はサイコロを振る
    }
    
    // サイコロ表示要素を取得
    const diceEl = document.getElementById('diceDisplay');
    // 回転アニメーションのCSSクラスを追加
    diceEl.classList.add('rolling');
    
    // 300ミリ秒後に結果を表示（アニメーション演出）
    setTimeout(() => {
        // 1〜6のランダムな整数を生成
        const value = Math.floor(Math.random() * 6) + 1;
        // サイコロの結果をゲーム状態に保存
        gameState.diceValue = value;
        // サイコロを振ったフラグをtrueに（このターンでは再度振れない）
        gameState.isRolled = true;
        
        // サイコロの目を画面に表示
        diceEl.textContent = value;
        // 回転アニメーションを終了
        diceEl.classList.remove('rolling');
        
        // ログに記録
        addLog(`${COLOR_NAMES[getCurrentPlayer().color]}が${value}を出しました`);
        
        // この目で動かせるコマを計算
        calculateMovableTokens();
        
        // 動かせるコマが1つもない場合
        if (gameState.movableTokens.length === 0) {
            addLog(`${COLOR_NAMES[getCurrentPlayer().color]}は動かせるトークンがありません`);
            // 1.5秒後に次のプレイヤーのターンへ
            setTimeout(nextTurn, 1500);
        } else {
            // 動かせるコマがある場合
            // トークンの表示を更新（動かせるコマをハイライト）
            renderTokens();
            
            // CPUのターンの場合は自動的にコマを動かす
            if (getCurrentPlayer().type !== 'human') {
                // 1秒後にCPUの移動処理を実行
                setTimeout(aiMove, 1000);
            }
        }
    }, 500);  // サイコロアニメーションの0.5秒後に実行
}

/**
 * 動かせるコマを計算する関数
 * 現在のサイコロの目で動かせるコマを判定し、gameState.movableTokensに格納
 */
function calculateMovableTokens() {
    // 動かせるコマのリストを初期化
    gameState.movableTokens = [];
    
    // 現在のプレイヤーとそのコマを取得
    const player = getCurrentPlayer();
    const tokens = gameState.tokens[player.color];
    
    // 全トークンがゴール済みの場合は何もしない
    const allFinished = tokens.every(t => t.isFinished);
    if (allFinished) {
        console.log(`${COLOR_NAMES[player.color]}は全トークンがゴール済み`);
        return;
    }
    
    // 各コマについて、動かせるかどうかを判定
    tokens.forEach((token, id) => {
        // 既にゴールしているコマはスキップ
        if (token.isFinished) return;
        
        // ケース1: ベースにいるコマ
        if (token.position === -1) {
            // 6が出た場合、またはスタートに6が不要な設定の場合
            if (gameState.diceValue === 6 || !gameState.settings.requireSixToStart) {
                // スタート位置に自分の他のコマがいないかチェック
                const startPos = START_POSITIONS[player.color];
                const hasOwnTokenAtStart = tokens.some((t, idx) => 
                    idx !== id && t.position === startPos && !t.isFinished
                );
                // スタート位置が空いていればこのコマは動かせる
                if (!hasOwnTokenAtStart) {
                    gameState.movableTokens.push({ color: player.color, id: id });
                }
                // デバッグ用ログ（スタート位置が埋まっている場合）
                if (hasOwnTokenAtStart) {
                    console.log(`${COLOR_NAMES[player.color]}のトークン${id + 1}はベースにいますが、スタート位置が埋まっているため出せません`);
                }
            }
        }
        // ケース2: ホームパス（ゴール手前の専用路）にいるコマ
        else if (token.position >= 1000 && token.position < 9999) {
            // ホームパス内の現在位置（0〜3）
            const homePos = token.position - 1000;
            // サイコロの目を加えた新しい位置
            const newHomePos = homePos + gameState.diceValue;
            
            // ホームパス内（0-3）に止まれる場合のみ移動可能
            if (newHomePos < HOME_PATH_LENGTH) {
                // ホームパス内での移動の場合、移動先に自分のコマがないかチェック
                const targetHomePos = 1000 + newHomePos;
                const hasOwnTokenAtTarget = tokens.some((t, idx) => 
                    idx !== id && t.position === targetHomePos
                );
                if (!hasOwnTokenAtTarget) {
                    gameState.movableTokens.push({ color: player.color, id: id });
                }
            }
            // newHomePos >= HOME_PATH_LENGTH の場合はオーバーまたはゴール済みなので移動不可
        }
        // ケース3: メインパス（円形の通路）上にいるコマ
        else {
            // 自分のスタート位置を基準にした相対位置を計算
            const startPos = START_POSITIONS[player.color];
            const relativePos = (token.position - startPos + PATH_LENGTH) % PATH_LENGTH;
            const newRelativePos = relativePos + gameState.diceValue;
            
            // 1周を超える場合（ホームパスへの進入）
            if (newRelativePos >= PATH_LENGTH) {
                // 1周を超えた分のマス数
                const excessSteps = newRelativePos - PATH_LENGTH;
                // ホームパスの範囲内（0-3）に止まれる場合のみ移動可能
                if (excessSteps < HOME_PATH_LENGTH) {
                    // ホームパス内への移動の場合、移動先に自分のコマがないかチェック
                    const targetHomePos = 1000 + excessSteps;
                    const hasOwnTokenAtTarget = tokens.some((t, idx) => 
                        idx !== id && t.position === targetHomePos
                    );
                    if (!hasOwnTokenAtTarget) {
                        gameState.movableTokens.push({ color: player.color, id: id });
                    }
                }
                // excessSteps >= HOME_PATH_LENGTH の場合はオーバーなので移動不可
            } else {
                // 通常の移動
                const targetPos = (startPos + newRelativePos) % PATH_LENGTH;
                // 移動先に自分のコマがないかチェック
                const hasOwnTokenAtTarget = tokens.some((t, idx) => 
                    idx !== id && t.position === targetPos && !t.isFinished
                );
                if (!hasOwnTokenAtTarget) {
                    gameState.movableTokens.push({ color: player.color, id: id });
                }
            }
        }
    });
}

/**
 * トークン移動（アニメーション付き）
 */
async function moveToken(color, tokenId) {
    // 指定された色とIDのトークンを取得
    const token = gameState.tokens[color][tokenId];
    
    if (token.position === -1) {
        // ベースからスタート
        token.position = START_POSITIONS[color];
        renderTokens();
        await delay(300);
        addLog(`${COLOR_NAMES[color]}のトークン${tokenId + 1}がスタートしました`);
        
        // スタート位置で捕獲チェック
        checkCapture(color, token.position);
    } else {
        // 移動処理
        const startPos = START_POSITIONS[color];
        let relativePos = (token.position - startPos + PATH_LENGTH) % PATH_LENGTH;
        
        // ホームパスにいるかチェック
        if (token.position >= 1000) {
            // 既にホームパスにいる場合、1マスずつ移動
            const homePos = token.position - 1000;
            const newHomePos = homePos + gameState.diceValue;
            
            if (newHomePos < HOME_PATH_LENGTH) {
                // ホームパスを1マスずつアニメーション移動
                for (let i = 1; i <= gameState.diceValue; i++) {
                    token.position = 1000 + homePos + i;
                    renderTokens();
                    await delay(300);
                }
                // 位置1003（ホームパスの最後）に到達したらゴール扱い
                if (token.position === 1003) {
                    token.isFinished = true;
                    addLog(`${COLOR_NAMES[color]}のトークン${tokenId + 1}がゴールしました！`);
                } else {
                    addLog(`${COLOR_NAMES[color]}のトークン${tokenId + 1}がホームパスを移動`);
                }
            } else {
                // オーバーなので移動できない
                addLog(`${COLOR_NAMES[color]}のトークン${tokenId + 1}は移動できません（オーバー）`);
                gameState.isRolled = false;
                gameState.movableTokens = [];
                renderTokens();
                nextTurn();
                return;
            }
        } else {
            // メインパス上の移動 - 1マスずつアニメーション
            const steps = gameState.diceValue;
            
            for (let i = 1; i <= steps; i++) {
                relativePos++;
                
                console.log(`${COLOR_NAMES[color]}のトークン${tokenId + 1}: ステップ${i}/${steps}, 相対位置=${relativePos}`);
                
                if (relativePos >= PATH_LENGTH) {
                    // ホームパスへ進入
                    const excessSteps = relativePos - PATH_LENGTH;
                    console.log(`ホームパス進入: excessSteps=${excessSteps}`);
                    if (excessSteps < HOME_PATH_LENGTH) {
                        token.position = 1000 + excessSteps;
                        renderTokens();
                        await delay(300);
                        if (i === steps) {
                            // 位置1003（ホームパスの最後）に到達したらゴール扱い
                            if (token.position === 1003) {
                                token.isFinished = true;
                                addLog(`${COLOR_NAMES[color]}のトークン${tokenId + 1}がゴールしました！`);
                            } else {
                                addLog(`${COLOR_NAMES[color]}のトークン${tokenId + 1}がホームパスへ進入！`);
                            }
                        }
                    } else {
                        // オーバーなので移動できない
                        addLog(`${COLOR_NAMES[color]}のトークン${tokenId + 1}は移動できません（オーバー）`);
                        gameState.isRolled = false;
                        gameState.movableTokens = [];
                        renderTokens();
                        nextTurn();
                        return;
                    }
                } else {
                    // 通常のメインパス上での移動
                    const newAbsolutePos = (startPos + relativePos) % PATH_LENGTH;
                    token.position = newAbsolutePos;
                    console.log(`通常移動: 絶対位置=${newAbsolutePos}`);
                    renderTokens();
                    await delay(300);
                    
                    // 最後の移動でログ出力と捕獲チェック
                    if (i === steps) {
                        addLog(`${COLOR_NAMES[color]}のトークン${tokenId + 1}が移動しました (位置${newAbsolutePos})`);
                        checkCapture(color, token.position);
                    }
                }
            }
        }
    }
    
    // ターン終了後の状態更新
    gameState.isRolled = false;        // サイコロを振ったフラグをリセット
    gameState.movableTokens = [];      // 動かせるコマのリストをクリア
    
    // コマの表示を更新
    renderTokens();
    
    // ゴール判定（移動後すぐにチェック）
    checkWin();
    
    // 全員ゴールしたかチェック（ゲーム終了判定）
    const allPlayersFinished = gameState.players.every(p => 
        gameState.tokens[p.color].every(t => t.isFinished)
    );
    
    if (allPlayersFinished) {
        // 全員ゴールした場合はゲーム終了（次のターンに進まない）
        return;
    }
    
    // 6が出た場合の追加ターン処理
    if (gameState.diceValue === 6 && gameState.settings.extraTurnOnSix) {
        addLog(`${COLOR_NAMES[color]}は6を出したので追加ターン！`);
        // サイコロフラグをfalseにして再度振れるようにする
        gameState.isRolled = false;
        // ステータス表示を更新
        updateStatus();
        
        // CPUの場合は自動的に次のサイコロを振る
        if (getCurrentPlayer().type !== 'human') {
            setTimeout(aiTurn, 1000);
        }
    } else {
        // 6以外の場合は次のプレイヤーのターンへ
        nextTurn();
    }
}

/**
 * 敵のコマを捕獲するチェック処理
 * 移動したコマと同じマスに敵のコマがいた場合、敵のコマをベースに戻す
 * @param {string} movingColor - 移動したコマの色
 * @param {number} position - 移動先の位置
 */
function checkCapture(movingColor, position) {
    // セーフマス(捕獲不可能なマス)の場合は何もしない
    // このゲームではSAFE_POSITIONSは空配列なので、この条件は常にfalse
    if (SAFE_POSITIONS.includes(position)) {
        console.log(`位置${position}はセーフマスなので捕獲なし`);
        return;
    }
    
    // ホームパス内（1000以上）の場合は捕獲なし
    // ホームパスは各色専用なので、敵は存在しない
    if (position >= 1000) {
        console.log(`位置${position}はホームパス内なので捕獲なし`);
        return;
    }
    
    console.log(`${COLOR_NAMES[movingColor]}が位置${position}で捕獲チェック実行`);
    
    // 全プレイヤーのコマをチェック
    for (const color in gameState.tokens) {
        // 自分の色のコマはスキップ
        if (color === movingColor) continue;
        
        // この色の全てのコマをチェック
        gameState.tokens[color].forEach((token, id) => {
            // 同じ位置にいて、ゴールしていないコマを見つけた場合
            if (token.position === position && !token.isFinished) {
                // 捕獲！そのコマをベースに戻す
                token.position = -1;
                addLog(`${COLOR_NAMES[movingColor]}が${COLOR_NAMES[color]}のトークン${id + 1}を捕獲！`);
                console.log(`捕獲成功: ${COLOR_NAMES[color]}のトークン${id + 1}をベースに戻しました`);
                renderTokens(); // 捕獲後すぐに表示を更新
            }
        });
    }
}

/**
 * 次のプレイヤーのターンへ移行する関数
 * 現在のターンが終了した時に呼ばれる
 */
function nextTurn() {
    // まず勝利条件をチェック（全コマがゴールしたプレイヤーがいるか）
    checkWin();
    
    // 全プレイヤーがゴールしたかチェック
    const allPlayersFinished = gameState.players.every(p => 
        gameState.tokens[p.color].every(t => t.isFinished)
    );
    
    if (allPlayersFinished) {
        addLog('全プレイヤーがゴールしました！');
        showWinModal();
        return;
    }
    
    // 次のプレイヤーに移行（01230...と循環）
    // %（剰余演算子）を使って人数で割った余りを取得することで循環させる
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.playerCount;
    
    // 全トークンがゴール済みのプレイヤーはスキップ
    let skipped = 0;
    while (gameState.tokens[getCurrentPlayer().color].every(t => t.isFinished) && skipped < gameState.playerCount) {
        addLog(`${COLOR_NAMES[getCurrentPlayer().color]}は全トークンがゴール済みなのでパス`);
        gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.playerCount;
        skipped++;
    }
    
    // 全員ゴール済みの場合（念のため再チェック）
    if (skipped >= gameState.playerCount) {
        addLog('全プレイヤーがゴールしました！');
        showWinModal();
        return;
    }
    
    // ターン数を1増やす（ゲーム進行の記録）
    gameState.turnCount++;
    const currentPlayer = getCurrentPlayer();
    addLog(`--- ターン${gameState.turnCount}: ${COLOR_NAMES[currentPlayer.color]}のターン ---`);
    
    // 新しいターンのためにサイコロの状態をリセット
    gameState.isRolled = false;      // サイコロを振っていない状態に
    gameState.diceValue = null;      // サイコロの目をクリア
    
    // 画面表示を更新（現在のプレイヤー名、スコアなど）
    updateStatus();
    
    // 次のプレイヤーがCPUの場合は自動的にターンを開始
    if (getCurrentPlayer().type !== 'human') {
        // 思考中の表示を出す
        showThinking();
        // 0.6〜1.8秒のランダムな思考時間を設定
        const thinkTime = 600 + Math.random() * 1200;
        setTimeout(() => {
            hideThinking();  // 思考中表示を消す
            aiTurn();
        }, thinkTime);
    }
}

/**
 * AIのターン
 */
function aiTurn() {
    performDiceRoll();
}

/**
 * AI移動
 */
function aiMove() {
    const player = getCurrentPlayer();
    const level = parseInt(player.type.replace('ai', ''));
    
    if (gameState.settings.cpuThinkingTime) {
        showThinking();
        const thinkTime = 500 + Math.random() * 1000; // 0.5〜1.5秒
        
        setTimeout(() => {
            const move = getAIMove(level);
            hideThinking();
            
            if (move) {
                setTimeout(() => {
                    moveToken(move.color, move.id);
                }, 300);
            }
        }, thinkTime);
    } else {
        const move = getAIMove(level);
        if (move) {
            setTimeout(() => {
                moveToken(move.color, move.id);
            }, 100);
        }
    }
}

/**
 * AI移動計算
 */
function getAIMove(level) {
    if (gameState.movableTokens.length === 0) return null;
    
    if (level === 1) {
        // ランダム
        return gameState.movableTokens[Math.floor(Math.random() * gameState.movableTokens.length)];
    } else if (level === 2) {
        // 貪欲（捕獲優先）
        for (const move of gameState.movableTokens) {
            const token = gameState.tokens[move.color][move.id];
            const newPos = token.position === -1 ? 
                START_POSITIONS[move.color] : 
                (token.position + gameState.diceValue) % PATH_LENGTH;
            
            // 捕獲可能かチェック
            for (const color in gameState.tokens) {
                if (color === move.color) continue;
                if (gameState.tokens[color].some(t => t.position === newPos && !t.isFinished)) {
                    return move;
                }
            }
        }
        return gameState.movableTokens[0];
    } else {
        // レベル3（評価関数）
        let bestMove = gameState.movableTokens[0];
        let bestScore = -Infinity;
        
        for (const move of gameState.movableTokens) {
            let score = 0;
            const token = gameState.tokens[move.color][move.id];
            
            // ベースから出す
            if (token.position === -1) {
                score += 10;
            } else {
                // 進行距離
                score += gameState.diceValue * 2;
                
                // 捕獲ボーナス
                const newPos = (token.position + gameState.diceValue) % PATH_LENGTH;
                for (const color in gameState.tokens) {
                    if (color === move.color) continue;
                    if (gameState.tokens[color].some(t => t.position === newPos && !t.isFinished)) {
                        score += 50;
                    }
                }
            }
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        
        return bestMove;
    }
}

/**
 * 思考中表示
 */
function showThinking() {
    const currentPlayerText = document.getElementById('currentPlayerText');
    const player = getCurrentPlayer();
    currentPlayerText.textContent = `${COLOR_NAMES[player.color]}のターン（思考中...）`;
    currentPlayerText.style.opacity = '0.6';
}

/**
 * 思考中非表示
 */
function hideThinking() {
    const currentPlayerText = document.getElementById('currentPlayerText');
    currentPlayerText.style.opacity = '1';
}

/**
 * 勝利チェック
 */
function checkWin() {
    // 全プレイヤーをチェックして、ゴールした人を順位リストに追加
    gameState.players.forEach(player => {
        const tokens = gameState.tokens[player.color];
        const finishedCount = tokens.filter(t => t.isFinished).length;
        
        // 全トークンがゴールしていて、まだ順位リストに入っていない場合
        if (finishedCount === TOKENS_PER_PLAYER && !gameState.winners.some(w => w.color === player.color)) {
            const rank = gameState.winners.length + 1;
            gameState.winners.push({
                color: player.color,
                rank: rank,
                type: player.type
            });
            
            addLog(`🎉 ${COLOR_NAMES[player.color]}が${rank}位でゴール！`);
        }
    });
    
    // 全員ゴールしたかチェック
    const allPlayersFinished = gameState.players.every(p => 
        gameState.tokens[p.color].every(t => t.isFinished)
    );
    
    if (allPlayersFinished) {
        addLog('全プレイヤーがゴールしました！ゲーム終了');
        // 少し待ってからモーダル表示
        setTimeout(() => {
            showWinModal();
        }, 800);
    }
}

/**
 * ステータス更新
 */
function updateStatus() {
    const player = getCurrentPlayer();
    document.getElementById('currentPlayerText').textContent = 
        `${COLOR_NAMES[player.color]}のターン`;
    document.getElementById('currentPlayerText').style.color = getColorHex(player.color);
    
    // スコア表示
    const scoresContainer = document.getElementById('playerScores');
    scoresContainer.innerHTML = '';
    
    gameState.players.forEach(p => {
        const finishedCount = gameState.tokens[p.color].filter(t => t.isFinished).length;
        const div = document.createElement('div');
        div.className = 'player-score';
        div.style.backgroundColor = getColorHex(p.color);
        div.style.color = p.color === 'yellow' ? '#333' : 'white';
        div.textContent = `${COLOR_NAMES[p.color]}: ${finishedCount}/${TOKENS_PER_PLAYER}`;
        scoresContainer.appendChild(div);
    });
}

/**
 * ログ追加
 */
function addLog(message) {
    const logContent = document.getElementById('logContent');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = message;
    logContent.insertBefore(entry, logContent.firstChild);
    
    console.log(message);
}

/**
 * 勝利モーダル表示
 */
function showWinModal() {
    const modal = document.getElementById('winModal');
    const winnerInfo = document.getElementById('winnerInfo');
    
    let html = '<h3>🏆 最終順位 🏆</h3>';
    html += '<div style="margin: 20px 0;">';
    
    gameState.winners.forEach(w => {
        const rankEmoji = w.rank === 1 ? '🥇' : w.rank === 2 ? '🥈' : w.rank === 3 ? '🥉' : '🏅';
        const playerType = w.type === 'human' ? 'プレイヤー' : `CPU ${w.type.replace('ai', 'Lv')}`;
        html += `<p style="font-size: 1.2em; padding: 10px; margin: 8px 0; background-color: ${getColorHex(w.color)}; color: ${w.color === 'yellow' ? '#333' : 'white'}; border-radius: 8px;">`;
        html += `${rankEmoji} ${w.rank}位: ${COLOR_NAMES[w.color]} (${playerType})`;
        html += `</p>`;
    });
    
    html += '</div>';
    
    winnerInfo.innerHTML = html;
    modal.classList.add('show');
}

/**
 * 勝利モーダルを閉じる
 */
function closeWinModal() {
    document.getElementById('winModal').classList.remove('show');
}

/**
 * ゲームリセット
 */
function resetGame() {
    closeWinModal();
    initTokens();
    gameState.currentPlayerIndex = 0;
    gameState.diceValue = null;
    gameState.isRolled = false;
    gameState.movableTokens = [];
    gameState.winners = [];
    gameState.turnCount = 0;
    
    document.getElementById('logContent').innerHTML = '';
    document.getElementById('diceDisplay').textContent = '?';
    
    renderBoard();
    updateStatus();
    addLog('ゲームをリセットしました');
    
    if (getCurrentPlayer().type !== 'human') {
        setTimeout(aiTurn, 1000);
    }
}

/**
 * 設定画面に戻る
 */
function backToSetup() {
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('gameSetup').style.display = 'block';
    gameState.gameStarted = false;
}


