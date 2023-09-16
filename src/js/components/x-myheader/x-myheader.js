/**
 * The mini-games module.
 *
 * @author Joakim Eriksson <je224cq@student.lnu.se>
 * @version 1.1.0
 */

// Show a header with a personal icon and name.

const template = document.createElement('template')
template.innerHTML = `
  <style>
    #myheader {
      overflow: auto;
      max-height: 400px;
      background-color: #fff;
      border-radius: 15px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      margin: 20px;
      padding: 20px;
      width: 300px;
      text-align: center;
    }

    /* Center text and buttons */
    h1, h2, p, button, input {
      text-align: center;
    }

  </style>
  <div id="myheader">
    <img src="./assets/favicon.ico" alt="Joakim Eriksson" width="50" height="50">
    <h1>Joakim Eriksson</h1>
  </div>
`

customElements.define('x-myheader',
  /**
   * Define template.
   *
   * @type {HTMLTemplateElement} template
   */
  class extends HTMLElement {
  /**
   * Creates an instance of the component.
   */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
    }

    /**
     * Called after the element is inserted into the DOM.
     *
     */
    connectedCallback () {}

    /**
     * Called after the element has been removed from the DOM.
     */
    attributeChangedCallback () {}
  }
)
