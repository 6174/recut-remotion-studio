try {
  require("@remotion/renderer");
  require("@remotion/bundler");
  require("remotion");
  require("@remotion/player");
  require("react");
  require("vite");
  console.log("remotion-skeleton: ok");
  process.exit(0);
} catch (error) {
  console.error("remotion-skeleton: missing dependencies");
  console.error(String(error && error.message ? error.message : error));
  process.exit(1);
}
