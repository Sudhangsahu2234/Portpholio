import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    // react-three-fiber drives its scene from `useFrame`, which runs on the
    // WebGL render loop rather than inside React's render pass. Mutating
    // uniforms there is the framework's documented pattern — routing it through
    // state would re-render React 60 times a second. The compiler's
    // immutability rule can't see that boundary, so it is off for the 3D layer
    // only.
    files: ["components/three/**/*.tsx"],
    rules: { "react-hooks/immutability": "off" },
  },
]);

export default eslintConfig;
