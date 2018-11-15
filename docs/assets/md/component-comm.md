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
