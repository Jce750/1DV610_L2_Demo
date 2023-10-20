/**
 * The mini-games module.
 *
 * @author Joakim Eriksson <je224cq@student.lnu.se>
 * @version 1.1.0
 */

// Show a header with a personal icon and name.

import { WrapperGameBoardLibrary } from './WrapperGameBoardLibrary.js'
import { Default } from './default.js'

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
    }

    /**
     * Initialize the game.
     */
    #initialize () {
      this.#clickCounter = 0
      this.#sideSize = Default.SIDE_SIZE
      this.#alignedToWin = Default.ALIGNED_TO_WIN
      this.#squareSize = Default.SQUARE_SIZE
    }

    /**
     * Called after the element is inserted into the DOM.
     *
     */
    connectedCallback () {
      const gameboardTitle = this.shadowRoot.querySelector('h3')
      this.#createGameBoard()
      gameboardTitle.innerText = Default.TITLE
    }

    /**
     * Create the game board.
     */
    #createGameBoard () {
      const gameBoardDiv = this.shadowRoot.querySelector('.gameboard')
      this.#gameBoardElement = this.#gameBoardLibrary.createGameBoardHtmlElementByRowsColumns(this.#sideSize, this.#sideSize)
      this.#addClickEventToAllCells(this.#gameBoardElement)
      this.#addGameBoardToDom(gameBoardDiv)
    }

    /**
     * Add click event to all cells.
     */
    #addClickEventToAllCells () {
      this.#gameBoardLibrary.addClickEventToAllCells(this.boundHandleClick, this.#gameBoardElement)
    }

    /**
     * Add the game board to the DOM.
     *
     * @param {HTMLElement} gameBoardDiv - The game board div.
     */
    #addGameBoardToDom (gameBoardDiv) {
      gameBoardDiv.appendChild(this.#gameBoardElement)
    }

    /**
     * Handle click on a square.
     *
     * @param {*} event - The click event.
     */
    handleClick (event) {
      event.preventDefault()
      const currentCell = event.target
      if (!this.#isCellEmpty(event.target)) {
        return
      }
      this.#advanceClickCounter()
      if (currentCell.innerText !== '') {
        return
      }
      this.#togglePlayer(currentCell)
      this.#evaluateGame(currentCell)
    }

    /**
     * Advance the click counter by 1.
     */
    #advanceClickCounter () {
      this.#clickCounter++
    }

    /**
     * Check if the cell is empty.
     *
     * @param {HTMLElement} cell cell
     * @returns {boolean} - True if the cell is empty.
     */
    #isCellEmpty (cell) {
      return cell.innerText === ''
    }

    /**
     * Assign a value to the cell.
     *
     * @param {HTMLElement} currentCell - The clicked cell.
     */
    #togglePlayer (currentCell) {
      if (this.#clickCounter % 2 === 0) {
        this.#updateClickedCell(currentCell, 'O')
      } else {
        this.#updateClickedCell(currentCell, 'X')
      }
    }

    /**
     * Update the clicked cell.
     *
     * @param {HTMLElement} currentCell - The clicked cell.
     * @param {string} signature - The signature of the player.
     */
    #updateClickedCell (currentCell, signature) {
      currentCell.classList.add('pressed')
      currentCell.innerText = signature
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

    /**
     * Finish the game.
     *
     * @param {*} currentCell - The clicked cell.
     * @param {*} alignedSignatures - The winning squares.
     */
    #finishGame (currentCell, alignedSignatures) {
      this.#freezeGameBoard()
      if (alignedSignatures) {
        this.#showMessage(`Winner: ${currentCell.innerText}`)
        this.#highlightWinningSquares(alignedSignatures)
      } else {
        this.#showMessage('Draw')
      }
      this.#showPlayAgain()
    }

    /**
     * Freeze the game board.
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

    /**
     * Highlight the winning squares.
     *
     * @param {*} htmlCells - The winning squares.
     */
    #highlightWinningSquares (htmlCells) {
      htmlCells.forEach(cell => {
        cell.classList.add('shine')
      })
    }

    /**
     * Show a message to the winner.
     *
     * @param {*} message - The message to show.
     */
    #showMessage (message) {
      const winnerMessage = document.createElement('h3')
      winnerMessage.innerText = message
      this.#gameBoardElement.appendChild(winnerMessage)
    }

    /**
     * Show option to play again.
     *
     */
    #showPlayAgain () {
      const playAgain = document.createElement('button')
      playAgain.innerText = 'Play again'
      playAgain.addEventListener('click', this.#resetGame.bind(this))
      this.#gameBoardElement.appendChild(playAgain)
    }

    /**
     * Reset the game.
     *
     */
    #resetGame () {
      this.#gameBoardElement.innerHTML = ''
      this.#clickCounter = 0
      this.#createGameBoard()
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    attributeChangedCallback () {}
  }
)
