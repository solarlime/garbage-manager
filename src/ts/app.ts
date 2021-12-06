/* eslint-disable no-param-reassign */
import * as Masonry from 'masonry-layout';
import validator from 'validator';

export default class App {
  #body: Element;
  #field: HTMLTextAreaElement;
  #fieldButton: HTMLButtonElement;

  constructor() {
    this.#body = document.querySelector('body') as Element;
    this.#field = this.#body.querySelector('#field-area') as HTMLTextAreaElement;
    this.#fieldButton = this.#body.querySelector('#field-button') as HTMLButtonElement;

    this.#field.value = '';

    this.#init();
    this.#addListeners();
  }

  #init(): void {
    const spoilers: NodeListOf<Element> = this.#body.querySelectorAll('.item-delete-spoiler');
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
        if (target.matches('.item-delete-spoiler') || target.closest('ul')?.matches('.app-add-list')) {
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
  }
}
