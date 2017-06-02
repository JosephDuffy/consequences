import AddonsLoader from './models/AddonsLoader';

(async () => {
    const addons = await AddonsLoader.loadAddons();
    console.log(addons);
})();
