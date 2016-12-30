import ComponentController from '../components.controller';
import View from './task_list.view';
import Model from './task_list.model';

/**
 * Component controller
 */
export default class TaskList extends ComponentController {

  /**
   * Create component controller
   * @param {HTMLElement} container - Append to element
   */
  constructor(container) {
    super();

    this.states = {
      INIT: 'init',
      ALL_DONE: 'all_done',
      TASK_ADDED: 'task_added',
      COMMON: 'common',
      REMOVING: 'removing'
    };
    this.tasksTypes = {
      GLOBAL: 'global',
      DAILY: 'daily'
    };
    this.state = null;

    this.model = new Model(this.states, this.tasksTypes);
    this.view = new View(container, this.states, this.tasksTypes);

    // Fired when model get all data for components
    this.model.events.once('model:data_received', function(...data) {
      this.render(...data);
    }, this);

    this.model.events.on('model:state_changed', function(state) {
      if (this.state === state) return;

      console.log('Task list (comp) model state change - ', state); // TODO: remove this later
      this.setState(state);
    }, this);

    // Fired when model updated from dataService
    // TODO: Можно подпилить под этот ивент сортировку, сортировать по полю priority и кидать в ивент
    this.model.events.on('model:updated', function(data) {
      this.update(data);
    }, this.view);

    this.model.events.on('task_data', function(...params) {
      this.events.trigger(params[0], ...params.slice(1));
    }, this.view);
  }

  /**
   * Set component state. Fire events which listen by components
   * @param {string} state
   */
  setState(state) {
    if (!this.checkState(state)) return;

    this.state = state;
    this.view.setState(state);
  }

  /**
   * Check state existence
   * @param {string} state
   * @return {boolean} State existence flag
   */
  checkState(state) {
    const states = this.states;
    let existenceFlag = false;

    for (let prop in states) {
      if (states[prop] === state) existenceFlag = true;
    }

    return existenceFlag;
  }

  /**
   * Shows tasks buttons for removing
   */
  switchOnRemovingMode() {
    this.setState(this.states.REMOVING);
  }

  /**
   * Remove marked tasks
   */
  switchOffRemovingMode() {
    this.setState(this.states.COMMON);
  }

  /**
   * Switch on/off removing mode depends on current state
   */
  toggleRemovingMode() {
    if (this.state === this.states.REMOVING) {
      this.switchOffRemovingMode();
    } else {
      this.switchOnRemovingMode();
    }
  }

  /**
   * Add task data. Starts chain for adding task instance to collection.
   * @param {object} dataObject - Data object for task
   */
  addTask(dataObject) {
    this.model.addTask(dataObject);
  }

  /**
   * Update task by id
   * @param {string} id - Task id
   * @param {object} dataObject - Task raw data
   * @param {string} [type] - Task type (daily|global)
   */
  updateTask(id, dataObject, type) {
    this.model.updateTask(id, dataObject, type);
  }

  /**
   * Remove task by id
   * @param {string} id
   */
  removeTask(id) {
    this.model.removeTask(id);
  }

}
