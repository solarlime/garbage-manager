/* eslint-disable no-param-reassign */
import * as Masonry from 'masonry-layout';
import validator from 'validator';
import * as uniqid from 'uniqid';
import { render, formsString } from './utils';
import { Data, Result } from './interfaces';

export default class App {
  readonly #body: HTMLBodyElement;
  readonly #list: HTMLUListElement;
  readonly #field: HTMLTextAreaElement;
  readonly #fieldButton: HTMLButtonElement;
  readonly #clipInput: HTMLInputElement;
  private readonly serverHost: string;

  constructor(serverHost: string) {
    this.serverHost = serverHost;
    this.#body = document.querySelector('body') as HTMLBodyElement;
    this.#list = this.#body.querySelector('.app-view-list') as HTMLUListElement;
    this.#field = this.#body.querySelector('#field-area') as HTMLTextAreaElement;
    this.#fieldButton = this.#body.querySelector('#field-button') as HTMLButtonElement;
    this.#clipInput = this.#body.querySelector('#clip-input') as HTMLInputElement;

    this.#field.value = '';

    window.addEventListener('DOMContentLoaded', () => {
      this.#fetch()
        .then(() => this.#init())
        .then((masonry) => {
          // @ts-ignore
          masonry.layout();
          this.#addListeners(masonry);
        })
        .catch((e) => alert(e));
    });
  }

  #fetch(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        fetch(`${this.serverHost}/garbage-manager/mongo/fetch/all/`)
          .then((res) => res.json())
          .then((result: Result) => {
            console.log(result);
            if (result.status === 'OK') {
              (result.data as Array<Data>).forEach((item) => {
                const newItem: HTMLLIElement = render(this.#list, item);
                (newItem.querySelector('.item-delete-spoiler') as HTMLInputElement).checked = false;
              });
              resolve();
            } else {
              reject(result.data);
            }
          })
          .catch((e) => reject(e));
      } catch (e) {
        reject(e);
      }
    });
  }

  #init(): Promise<Masonry> {
    return new Promise((resolve, reject) => {
      /**
       * A listener for creating a masonry layout
       */
      try {
        const masonry = new Masonry(this.#list, {
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
          const spoilers = this.#body.querySelectorAll('.item-delete-spoiler');
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

        resolve(masonry);
      } catch (e) {
        reject();
      }
    });
  }

  #addListeners(msnry: Masonry): void {
    /**
     * A listener for enabling and disabling a send button
     */
    this.#field.addEventListener('input', (): void => {
      this.#fieldButton.disabled = validator.isEmpty(this.#field.value.trim());
    });

    /**
     * A listener function for buttons' listeners
     * @param serverHost
     * @param list
     * @param input
     * @param masonry
     * @param item
     */
    async function buttonClickListener(
      serverHost: string,
      list: HTMLUListElement,
      input: HTMLTextAreaElement | HTMLInputElement,
      masonry: Masonry,
      item: string,
    ): Promise<void> {
      const formData = new FormData(formsString(document.forms, item));
      formData.set('id', uniqid());
      if (item === 'field') {
        formData.set('type', 'text');
      } else {
        formData.set('type', 'file');
      }
      console.log(...formData);
      try {
        const res = await fetch(`${serverHost}/garbage-manager/mongo/update/`, {
          method: 'POST',
          body: formData,
        });
        const result: Result = await res.json();
        // const result = {
        //   action: 'Add',
        //   status: 'OK',
        //   data: {
        //     id: uniqid(),
        //     content: 'Big big text\n\nThe next part of big big text\n- One\n- By one',
        //   },
        // };
        console.log(result);
        if (result.status === 'OK') {
          const newItem: HTMLLIElement = render(list, result.data as Data);
          input.value = '';
          // @ts-ignore
          masonry.appended(newItem);
          newItem.scrollIntoView();
        } else {
          alert(result);
        }
      } catch (e) {
        console.log(e);
      }
    }

    this.#fieldButton.addEventListener('click', () => buttonClickListener(this.serverHost, this.#list, this.#field, msnry, 'field'));
    this.#clipInput.addEventListener('input', () => buttonClickListener(this.serverHost, this.#list, this.#clipInput, msnry, 'clip'));
  }
}
