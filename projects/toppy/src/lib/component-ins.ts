export class ComponentInstance {
  constructor(public component, public props = {}) {
    this._addProps(this.props);
  }
  destroy() {}
  private _addProps(props: object) {
    Object.keys(props).forEach(key => {
      this.component[key] = props[key];
    });
  }
  setProps() {}
  compIns() {}
}
