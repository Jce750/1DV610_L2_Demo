/**
 * The mini-games module.
 *
 * @author Joakim Eriksson <je224cq@student.lnu.se>
 * @version 1.1.0
 */

// Show a header with a personal icon and name.

import { GameBoard } from './../../../../node_modules/matrixanalysislibrary/dist/GameBoard.js'

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
    #gameboardElement
    #gameboard
    #clickCounter
    #sideSize
    #squareSize
    #alignedToWin
    /**
     * Creates an instance of the component.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.#gameboardElement = this.shadowRoot.querySelector('.gameboard')
      this.boundHandleClick = this.handleClick.bind(this)
      this.#clickCounter = 0
      this.#sideSize = 15
      this.#alignedToWin = 5
      this.#squareSize = 40
    }

    /**
     * Called after the element is inserted into the DOM.
     *
     */
    connectedCallback () {
      const gameboardTitle = this.shadowRoot.querySelector('h3')
      console.log('Log from x-tictactoe.js')
      this.#createBoard()
      gameboardTitle.innerText = 'Tic Tac Toe'
    }

    /**
     * Create the game board.
     *
     */
    #createBoard () {
      this.#gameboard = new GameBoard(5, 5)

      this.#gameboard.test('Hello from Gameboard')
      this.#gameboard.updateCellWidthHeight(30, 30)
      this.#gameboard.addclickEventToCells(this.#gameboard.cellElements, this.boundHandleClick)
      this.#gameboardElement.appendChild(this.#gameboard.element) // Stupid naming TODO
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
      this.#clickCounter++
      const currentCol = currentCell.getAttribute('data-col')
      const currentRow = currentCell.getAttribute('data-row')
      console.log(`You clicked ${currentCol}, ${currentRow}`)
      if (currentCell.innerText !== '') {
        return
      }
      this.#togglePlayer(currentCell)
      this.#evaluateGame(currentCell)
    }

    /**
     * Check if the cell is empty.
     *
     * @param {*} cell cell
     * @returns {boolean} - True if the cell is empty.
     */
    #isCellEmpty (cell) {
      return cell.innerText === ''
    }

    /**
     * Assign a value to the cell.
     *
     * @param {*} currentCell - The clicked cell.
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
     * @param {*} currentCell - The clicked cell.
     * @param {*} signature - The signature of the player.
     */
    #updateClickedCell (currentCell, signature) {
      currentCell.classList.add('pressed')
      currentCell.innerText = signature
    }

    /**
     * Evaluate the game.
     *
     * @param {*} currentCell - The clicked cell.
     */
    #evaluateGame (currentCell) {
      const alignedSignatures = this.#gameboard
        .getLongestCellLineOfValueMatchIntersectingCell(currentCell)
      const isWinner = alignedSignatures.length >= this.#alignedToWin
      const isDraw = this.#isNoCellsLeft() && !isWinner
      if (isWinner) {
        this.#finishGame(currentCell, alignedSignatures)
      }
      if (isDraw) {
        this.#finishGame(currentCell)
      }
    }

    /**
     * Check if there are no cells left.
     *
     * @returns {boolean} - True if there are no cells left.
     */
    #isNoCellsLeft () {
      return this.#clickCounter >= this.#gameboard.size.rows * this.#gameboard.size.columns
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
      const cells = this.#gameboardElement.querySelectorAll('.cell')
      cells.forEach(cell => {
        cell.removeEventListener('click', this.boundHandleClick)
      })
      return this
    }

    /**
     * Highlight the winning squares.
     *
     * @param {*} neighbors - The winning squares.
     */
    #highlightWinningSquares (neighbors) {
      neighbors.forEach(neighbor => {
        neighbor.classList.add('shine')
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
      this.#gameboardElement.appendChild(winnerMessage)
    }

    /**
     * Show option to play again.
     *
     */
    #showPlayAgain () {
      const playAgain = document.createElement('button')
      playAgain.innerText = 'Play again'
      playAgain.addEventListener('click', this.#resetGame.bind(this))
      this.#gameboardElement.appendChild(playAgain)
    }

    /**
     * Reset the game.
     *
     */
    #resetGame () {
      this.#gameboardElement.innerHTML = ''
      this.#clickCounter = 0
      this.#createBoard()
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    attributeChangedCallback () {}
  }
)
