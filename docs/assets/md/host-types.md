**Plain text**

```typescript
this.overlayIns = this._toppy
  .overlay(position)
  .host(`some plain text content`) // simple text
  .create();
```

**Using html**

```typescript
this.overlayIns = this._toppy
  .overlay(position)
  .host(`<div>any HTML content</div>`, { hasHTML: true }) // html
  .create();
```

**Using component**

```typescript
@Component({
  template: '<div>Hello</div>'
})
export class HelloComponent {}
```

```typescript
this.overlayIns = this._toppy
  .overlay(position)
  .host(HelloComponent) // host a component
  .create();
```

**Using TemplateRef**

```html
<ng-template #tpl>Hello world!</ng-template>
```

```typescript
@ViewChild('tpl') tpl:TemplateRef<any>;

this.overlayIns = this._toppy
  .overlay(position)
  .host(this.tpl) // template ref
  .create();
```
