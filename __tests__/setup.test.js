// __tests__/setup.test.js
describe("Test Setup", () => {
  test("should pass basic test", () => {
    expect(2 + 2).toBe(4);
  });

  test("should have Jest globals available", () => {
    expect(jest).toBeDefined();
    expect(describe).toBeDefined();
    expect(test).toBeDefined();
    expect(expect).toBeDefined();
  });

  test("should have testing-library/jest-dom matchers", () => {
    const div = document.createElement("div");
    div.textContent = "Hello World";
    document.body.appendChild(div);

    expect(div).toBeInTheDocument();
    expect(div).toHaveTextContent("Hello World");
  });
});
