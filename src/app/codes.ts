const code: any = {};

code.NPM_INSTALL = `> npm install blink --save //or
> yarn add blink
`;

code.INSTALL = `const position = new GlobalPosition();
const ref = this.blink.overlay(position).host().create();
ref.open(); // use it anywhere`;

export { code };
