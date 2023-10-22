/**
 * The mini-games module.
 *
 * @author Joakim Eriksson <je224cq@student.lnu.se>
 * @version 1.1.0
 */

// Show a header with a personal icon and name.

import { WrapperGameBoardLibrary } from './WrapperGameBoardLibrary.js'
import { Default } from './default.js'
import { Player } from './player.js'

const template = document.createElement('template')
template.innerHTML = `
  <style>

    #gamearea {
      overflow: hidden;
      height: auto;
      min-height: 100%;
    }

    .gameboard {
      display: flex;
      flex-direction: column;
      background-color: #fff;
      border-radius: 15px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      margin: 20px;
      padding: 20px;
      height: auto;
      width: auto;
      text-align: center;
    }

    .cell {
      background-color: #BFeFFF;
      border: 1px solid black;
      float: left;
      text-align: center;
      vertical-align: middle;
      font-size: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .pressed {
      background-color: lightblue;
    }

    .shine {
      background-color: yellow;
    }

    /* Center text and buttons */
    h1, h2, p, button, input {
      text-align: center;
    }



  </style>
  <div id="gamearea">
    <h3>Tic Tac Toe</h3>
    <p id="playerOnTurn">Next move: Player X</p>
    <div class="gameboard">
    </div>
  </div>
`

customElements.define('x-tictactoe',
  /**
   * Define template.
   *
   * @type {HTMLTemplateElement} template
   */
  class extends HTMLElement {
    #gameBoardElement
    #gameBoardLibrary
    #clickCounter
    #sideSize
    #squareSize
    #alignedToWin
    #player1
    #player2

    /**
     * Creates an instance of the class.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.boundHandleClick = this.handleClick.bind(this)
      this.#initialize()
      this.#gameBoardLibrary = new WrapperGameBoardLibrary()
      this.#player1 = new Player('X', this.shadowRoot)
      this.#player2 = new Player('O', this.shadowRoot)
    }

    #initialize () {
      this.#clickCounter = 0
      this.#sideSize = Default.SIDE_SIZE
      this.#alignedToWin = Default.ALIGNED_TO_WIN
      this.#squareSize = Default.SQUARE_SIZE
    }

    /**
     * Called after the main element is inserted into the DOM.
     *
     */
    connectedCallback () {
      const gameboardTitle = this.shadowRoot.querySelector('h3')
      this.#createGameBoard()
      gameboardTitle.innerText = Default.TITLE
    }

    #createGameBoard () {
      try {
        const gameBoardDiv = this.shadowRoot.querySelector('.gameboard')
        this.#gameBoardElement = this.#gameBoardLibrary.createGameBoardHtmlElementByRowsColumns(this.#sideSize, this.#sideSize)
        this.#addClickEventToAllCells(this.#gameBoardElement)
        this.#addGameBoardToDom(gameBoardDiv)
      } catch (error) {
        console.log(error)
      }
    }

    #addClickEventToAllCells () {
      this.#gameBoardLibrary.addClickEventToAllCells(this.boundHandleClick, this.#gameBoardElement)
    }

    #addGameBoardToDom (gameBoardDiv) {
      gameBoardDiv.appendChild(this.#gameBoardElement)
    }

    /**
     * Handle click on a square.
     *
     * @param {*} event - contains the target element cell
     */
    handleClick (event) {
      event.preventDefault()
      const currentCell = event.target
      if (this.#isCellEmpty(currentCell)) {
        this.#executeRound(currentCell)
      }
    }

    #isCellEmpty(cell) {
      return cell.innerText === ''
    }

    #getCurrentPlayer () {
      return (this.#clickCounter % 2 === 0) ? this.#player1 : this.#player2
    }

    #executeRound(currentCell) {
      const currentPlayer = this.#getCurrentPlayer()
      currentPlayer.makeMove(currentCell)
      this.#advanceClickCounter()
      this.#showPlayerOnTurn()
      this.#evaluateGame(currentCell)
    }

    #advanceClickCounter () {
      this.#clickCounter++
    }

    #showPlayerOnTurn () {
      let nextPlayer
      if (this.#clickCounter % 2 === 0) {
        nextPlayer = this.#player1
      } else {
        nextPlayer = this.#player2
      }
      nextPlayer.showTurn()
    }

    /**
     * Evaluate the game.
     *
     * @param {HTMLElement} currentCell - The clicked cell.
     */
    #evaluateGame (currentCell) {
      const alignedCells = this.#gameBoardLibrary.getLongestCellElementLineOfValueMatchIntersectingCell(currentCell, this.#gameBoardElement)
      const isWinner = alignedCells.length >= this.#alignedToWin
      const isDraw = this.#isNoCellsLeft() && !isWinner
      if (isWinner) {
        this.#finishGame(currentCell, alignedCells)
      }
      if (isDraw) {
        this.#finishGame(currentCell)
      }
    }

    /**
     * Check if there are no cells left on the board to click.
     *
     * @returns {boolean} - True if there are no cells left.
     */
    #isNoCellsLeft () {
      const size = this.#gameBoardLibrary.getGameBoardSize(this.#gameBoardElement)
      return this.#clickCounter >= size.rows * size.columns
    }

    #finishGame (currentCell, alignedSignatures) {
      this.#freezeGameBoard()
      this.#hidePlayerOnTurnMessage()
      if (alignedSignatures) {
        this.#showMessage(`Winner: ${currentCell.innerText}`)
        this.#highlightWinningSquares(alignedSignatures)
      } else {
        this.#showMessage('Draw')
      }
      this.#showPlayAgain()
    }

    /**
     * Remove the click event listener from all squares.
     *
     * @returns {boolean} - True if the game board was frozen.
     */
    #freezeGameBoard () {
      const cells = this.#gameBoardElement.querySelectorAll('.cell')
      cells.forEach(cell => {
        cell.removeEventListener('click', this.boundHandleClick)
      })
      return this
    }

    #hidePlayerOnTurnMessage () {
      const playerOnTurn = this.shadowRoot.querySelector('#playerOnTurn')
      playerOnTurn.innerText = ''
    }

    #showMessage (message) {
      const winnerMessage = document.createElement('h3')
      winnerMessage.innerText = message
      this.#gameBoardElement.appendChild(winnerMessage)
    }

    #highlightWinningSquares (htmlCells) {
      htmlCells.forEach(cell => {
        cell.classList.add('shine')
      })
    }

    #showPlayAgain () {
      const playAgain = document.createElement('button')
      playAgain.innerText = 'Play again'
      playAgain.addEventListener('click', this.#resetGame.bind(this))
      this.#gameBoardElement.appendChild(playAgain)
    }

    #resetGame () {
      this.#gameBoardElement.remove()
      this.#clickCounter = 0
      this.#createGameBoard()
      this.#player1.showTurn()
    }
  }
)
