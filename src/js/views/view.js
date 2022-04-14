
import icons from 'url:../../img/icons.svg'; //Parcel 2

export default class View {
    _data;

    /**
     * Render the recieved object to the DOM
     * @param {Object | Objects[]} data The data to be rendered (e.g. recipe) 
     * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM 
     * @returns {undefined | string} A markup string is returned if render=false
     * @this {object} View instance
     * @author Anvar
     * @todo Finish implemantation
     */

     render(data, render = true) {
        if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const markup = this._generateMarkUp();

        if(!render) return markup;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update(data) {
        this._data = data;
        const newMarup = this._generateMarkUp();

        const newDOM = document.createRange().createContextualFragment(newMarup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const curElement = Array.from(this._parentElement.querySelectorAll('*'));

        // Update changed text
        newElements.forEach((newEl, i) => {
            const curEl = curElement[i];

            if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
                curEl.textContent = newEl.textContent;
            }

            if(!newEl.isEqualNode(curEl)) {
                Array.from(newEl.attributes).forEach(attr => 
                    curEl.setAttribute(attr.name, attr.value));
            }
        });
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }

    renderSpiner = function() {
        const markup = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
        `;
         this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };

    renderError(message = this._errorMessage) {
      const markup = `
      <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`

      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(message = this._message) {
      const markup = `
      <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`

      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}