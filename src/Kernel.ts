import { CACHE_DRIVER } from "./Config/App.js";
import Context from "./Facades/Context.js";
import Websocket from "./Http/Websocket.js";
import CacheDriverService from "./Services/CacheDriverService.js"

function run() {
    const cache = CacheDriverService.getById(CACHE_DRIVER);
    Context.set('cache', cache);

    Websocket.init();
}

export default {
    run,
}
