/* eslint-disable no-param-reassign */
import Masonry from 'masonry-layout';

export default class App {
  static init() {
    const spoilers: NodeListOf<Element> = document.querySelectorAll('.item-delete-spoiler');
    spoilers
      .forEach((spoiler: Element): void => { (spoiler as HTMLInputElement).checked = false; });

    window.addEventListener('load', () => {
      const grid = document.querySelector('.app-view-list');
      const masonry = new Masonry(grid, {
        gutter: 20,
        itemSelector: '.app-view-list-item',
        percentPosition: true,
        columnWidth: '.app-view-list-item',
      });

      grid.addEventListener('click', (event: Event) => {
        const target = event.target as Element;
        if (target.matches('.item-delete-spoiler')) {
          Array.from(spoilers)
            .filter((spoiler): Boolean => (spoiler !== target)
                && ((spoiler as HTMLInputElement).checked === true))
            .forEach((spoiler): void => { (spoiler as HTMLInputElement).checked = false; });
          const timeout = setTimeout(() => {
            masonry.layout();
            clearTimeout(timeout);
          }, 100);
        }
      });
    }, { once: true });
  }
}
