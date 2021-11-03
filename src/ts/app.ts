export default class App {
  static init() {
    function a(b: number): number {
      return b ** 2;
    }

    const c: number = 5;

    console.log(a(c));
  }
}
