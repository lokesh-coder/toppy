import { ComponentType } from './models';

export class ComponentInstance<T> {
  constructor(public component: T, public props = {}) {
    this.addProps(this.props);
  }
  destroy() {}
  addProps(props: object) {
    Object.keys(props).forEach(key => {
      this.component[key] = props[key];
    });
  }
  setProps() {}
  compIns() {}
}
