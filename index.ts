import Kernel from "./src/Kernel.js";

process.context = {};
process.contextTimeouts = {};

Kernel.run();
