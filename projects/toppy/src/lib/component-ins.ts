export class ComponentInstance {
  constructor(private _component, private _props = {}) {
    this._addProps(this._props);
  }
  getInstance() {
    return this._component;
  }
  private _addProps(props: object) {
    Object.keys(props).forEach(key => {
      this._component[key] = props[key];
    });
  }
}
