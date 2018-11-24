When you host a component, you can control the overlay through `CurrentOverlay` service. As of now, this service has only one method `close` to close the overlay from the host component. But, soon more API will be added to this service.

```typescript
// host component
@Component({
  template: '<div>Some text</div>'
})
export class HostComponent {
  constructor(private _overlay: CurrentOverlay) {}

  close() {
    this._overlay.close();
  }
}
```

You can also set properties to component when creating the overlay.

```typescript
this.overlayIns = this._toppy
  .overlay(position)
  .host(HelloComponent, { propName: 'toppy-test-prop' })
  .create();
```

Now automatically all props are attached to host component and you can access it like,

```typescript
// host component
@Component({
  template: '<div>Some text</div>'
})
export class HostComponent {
  propName; // else tslint will throw error
  constructor() {
    console.log(this.propName); // will return 'toppy-test-prop'
  }
}
```
