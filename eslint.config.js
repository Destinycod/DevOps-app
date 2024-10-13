// eslint.config.js
export default [
    {
      files: ["**/*.js"], // Especifica los archivos que ESLint debe analizar
      languageOptions: {
        ecmaVersion: "latest", // Define la versión de ECMAScript
        sourceType: "module",  // O "script" si no estás usando módulos
      },
      rules: {
        // Añade tus reglas de ESLint aquí
        "no-unused-vars": "warn",
        "semi": ["error", "always"],
      },
    },
  ];
  