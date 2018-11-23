```typescript
this.toppy
  .overlay(position, configuration)
  .host('hello')
  .create();
```

| property               | default             | supported values |
| ---------------------- | ------------------- | ---------------- |
| backdrop               | _false_             | boolean          |
| containerClass         | _'toppy-container'_ | string           |
| wrapperClass           | _'toppy-wrapper'_   | string           |
| backdropClass          | _'toppy-backdrop'_  | string           |
| bodyClassNameOnOpen    | _''_                | string           |
| dismissOnDocumentClick | _true_              | boolean          |
| parentElement          | _null_              | HTMLElement      |
| watchDocClick          | _true_              | boolean          |
| watchWindowResize      | _true_              | boolean          |
| windowResizeCallback   | _null_              | function         |
| docClickCallback       | _null_              | function         |
