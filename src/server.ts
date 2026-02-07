import Kernel from "./Kernel.js";

process.context = {};
process.contextTimeouts = {};

Kernel.run();
