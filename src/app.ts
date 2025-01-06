// Shay Mashiah - 318877263
// Omri Ivry - 314806357

import initApp from "./server";
const port = process.env.PORT;

initApp().then((app) => {
    app.listen(port, () => {
        console.log('Server is running on port 5000');
})});
