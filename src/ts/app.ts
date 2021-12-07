/* eslint-disable no-param-reassign */
import * as Masonry from 'masonry-layout';
import validator from 'validator';

export default class App {
  #body: Element;
  #field: HTMLTextAreaElement;
  #fieldButton: HTMLButtonElement;
  #clipInput: HTMLInputElement;

  constructor() {
    this.#body = document.querySelector('body') as Element;
    this.#field = this.#body.querySelector('#field-area') as HTMLTextAreaElement;
    this.#fieldButton = this.#body.querySelector('#field-button') as HTMLButtonElement;
    this.#clipInput = this.#body.querySelector('#clip-input') as HTMLInputElement;

    this.#field.value = '';

    this.#init();
    this.#addListeners();
  }

  #init(): void {
    const spoilers = this.#body.querySelectorAll('.item-delete-spoiler');
    spoilers
      .forEach((spoiler: Element): void => { (spoiler as HTMLInputElement).checked = false; });

    /**
     * A listener for creating a masonry layout
     */
    window.addEventListener('load', () => {
      const grid = this.#body.querySelector('.app-view-list') as Element;
      const masonry = new Masonry(grid, {
        gutter: 20,
        itemSelector: '.app-view-list-item',
        percentPosition: true,
        columnWidth: '.app-view-list-item',
      });

      /**
       * A listener for hiding spoilers:
       * if there's a click on the input area or on another spoiler
       */
      this.#body.addEventListener('click', (event: Event) => {
        const target = event.target as Element;
        if (target.matches('.item-delete-spoiler') || target.closest('.app-add')?.matches('.app-add-list')) {
          Array.from(spoilers)
            .filter((spoiler): Boolean => (spoiler !== target)
                && (spoiler as HTMLInputElement).checked)
            .forEach((spoiler): void => { (spoiler as HTMLInputElement).checked = false; });
          const timeout = setTimeout(() => {
            if (masonry !== undefined) {
              // @ts-ignore
              masonry.layout();
            }
            clearTimeout(timeout);
          }, 100);
        }
      });
    }, { once: true });
  }

  #addListeners(): void {
    /**
     * A listener for enabling and disabling a send button
     */
    this.#field.addEventListener('input', (): void => {
      this.#fieldButton.disabled = validator.isEmpty(this.#field.value.trim());
    });

    /**
     * A service function for calling a form via its name
     * @param forms
     * @param string
     */
    function formsString(forms: HTMLCollectionOf<HTMLFormElement>, string: string):
    HTMLFormElement | undefined {
      const index = Array.from(forms).findIndex((item) => item.id === string);
      return forms[index];
    }

    /**
     * A listener function for buttons' listeners
     * @param item
     */
    function buttonClickListener(item: string): void {
      const formData = new FormData(formsString(document.forms, item));
      console.log(...formData);
      // TODO: sending formData
    }

    this.#fieldButton.addEventListener('click', () => buttonClickListener('field'));
    this.#clipInput.addEventListener('input', () => buttonClickListener('clip'));
  }
}
