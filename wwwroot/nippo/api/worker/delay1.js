// define message event for receive data from main thread
addEventListener('message', (msg) => {
    setTimeout(() => {
        // on postMessage method -> return data to message event in main thread
        postMessage([{
            id: 1000,
            name: 'Nguyễn Tuệ Vương',
            position: 'Technical leader'
        }]);
    }, 1000); // simulate small data (quick response)
});