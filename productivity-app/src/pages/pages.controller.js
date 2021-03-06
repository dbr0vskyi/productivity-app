/**
 * Abstract class for page controller
 */
export default class PageController {

  /**
   * Create page controller
   */
  constructor() {
    this.view = null;
  }

  /**
   * Fire view method to render page
   */
  render() {
    this.view.render();
  }

  /**
   * Fire view method to destroy page
   */
  destroy() {
    this.view.destroy();
  }

  /**
   * Make push state and rise popstate event
   * @param {string} name - Page name
   */
  goToPage(name) {
    history.pushState(null, null, `#!/${name}`);
    history.go(0);
  }

}
