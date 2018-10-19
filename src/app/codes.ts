const code: any = {};

code.NPM_INSTALL = `> npm install toppy --save //or
> yarn add toppy
`;

code.INSTALL = `const position = new GlobalPosition();
const ref = this.toppy.overlay(position).host().create();
ref.open(); // use it anywhere`;

export { code };
