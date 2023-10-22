import { IMatrix2DFacade } from 'matrixanalysislibrary/IMatrix2DFacade'
import { IHtmlGameBoardFacade } from 'matrixanalysislibrary/IHtmlGameBoardFacade'

/**
 * This class is a wrapper for the matrixanalysislibrary.
 * The wrapper will help limit exposure to methods that are needed for this project.
 * Add or remove methods as needed. See readme for more information.
 *
 * @class WrapperGameBoardLibrary
 */
export class WrapperGameBoardLibrary {
  /**
   * Creates an instance of WrapperGameBoardLibrary.
   *
   */
  constructor () {
    this.IMatrix2DFacade = new IMatrix2DFacade()
    this.IHtmlGameBoardFacade = new IHtmlGameBoardFacade()
  }

  /**
   * This will create a new game-board by using the matrixanalysislibrary.
   * Argument is an anonymous object with the properties rows and columns.
   *
   * @param {rows} rows rows
   * @returns {object} A new game-board
   */
  createMatrixByRowsColumns ({ rows, columns }) {
    return this.IMatrix2DFacade.buildMatrix2DFromScratch({ rows, columns })
  }

  /**
   * This will create a new game-board by using the matrixanalysislibrary.
   * The game-board is a html element.
   * The game-board is a rectangle.
   *
   * @param {*} rows Number of rows
   * @param {*} columns Number of columns
   * @returns {HTMLElement} A new game-board
   */
  createGameBoardHtmlElementByRowsColumns (rows, columns) {
    return this.IHtmlGameBoardFacade.createGameBoardHtml({ rows, columns }, { width: 50, height: 50 })
  }

  /**
   * Returns all cell html elements.
   *
   * @param {HTMLElement} gameBoardHtmlElement The game-board html element.
   * @returns {Array} All Point2D-objects.
   */
  selectAllCells (gameBoardHtmlElement) {
    return this.IHtmlGameBoardFacade.selectAllCellsInHtmlElement(gameBoardHtmlElement)
  }

  /**
   * Add click event to all cells.
   *
   * @param {Function} eventHandler The event handler.
   * @param {HTMLElement} gameBoardHtmlElement The game-board html element.
   */
  addClickEventToAllCells (eventHandler, gameBoardHtmlElement) {
    this.IHtmlGameBoardFacade.addClickEventToAllCellsInHtmlElement(eventHandler, gameBoardHtmlElement)
  }

  /**
   * Get the longest line of intersecting cells that match the value of the current cell.
   * The current cell is included in the result.
   * Search is done in horisontal, vertical and diagonal directions.
   *
   * @param {HTMLElement} currentCellHtmlElement The current cell.
   * @param {HTMLElement} gameBoardHtmlElement The game-board html element.
   * @returns {Array} An array of Html-cell-objects.
   */
  getLongestCellElementLineOfValueMatchIntersectingCell (currentCellHtmlElement, gameBoardHtmlElement) {
    return this.IHtmlGameBoardFacade.getLongestCellElementLineOfValueMatchIntersectingCell(currentCellHtmlElement, gameBoardHtmlElement)
  }

  /**
   * Get the game-board size.
   * The size is the number of rows or columns.
   * The game-board is a rectangle.
   *
   * @param {HTMLElement} gameBoardHtmlElement The game-board html element.
   * @returns {object} The size as {rows:number, columns:number}.
   */
  getGameBoardSize (gameBoardHtmlElement) {
    const size = this.IHtmlGameBoardFacade.getGameBoardSize(gameBoardHtmlElement)
    return { rows: size.rows, columns: size.columns }
  }
}
