/**
 * Player class
 */
export class Player {
  /**
   * Constructor.
   *
   * @param {string} signature - The signature of the player.
   * @param {HTMLElement} root - The root element.
   */
  constructor (signature, root) {
    this.signature = signature
    this.root = root
  }

  /**
   * Make a move.
   *
   * @param {HTMLElement} cell - The clicked cell.
   */
  makeMove (cell) {
    cell.classList.add('pressed')
    cell.innerText = this.signature
  }

  /**
   * Show the player on turn.
   */
  showTurn () {
    const playerOnTurn = this.root.querySelector('#playerOnTurn')
    playerOnTurn.innerText = `Next move: Player ${this.signature}`
  }
}
