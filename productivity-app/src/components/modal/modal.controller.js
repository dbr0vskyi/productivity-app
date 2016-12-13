import ComponentController from '../components.controller';
import View from './modal.view';
import Model from './modal.model';

/**
 * Component controller
 */
export default class Modal extends ComponentController {

  /**
   * Create component controller
   * @param {HTMLElement} container - Append to element
   * @param {object} [dataObject] - Data object
   */
  constructor(container, dataObject) {
    super();

    this.model = new Model(dataObject);
    this.view = new View(container);

    this.render(...this.model.getData()); // [dataFlag, dataObject]

    this.view.events.on('view:submit', function(dataObject) {
      this.model.update(dataObject);
    });

    this.view.events.on('view:remove', function() {
      this.events.trigger('modal:remove');
    }, this);

    this.view.events.on('view:cancel', function() {
      this.close();
    }, this);

    this.model.events.on('model:updated', function(dataObject) {
      this.events.trigger('modal:submit', dataObject);
    }, this);
  }

  /**
   * Close and destroy modal
   */
  close() {
    this.view.close();
    this.destroy();
  }

}