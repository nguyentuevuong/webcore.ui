// define message event for receive data from main thread
addEventListener('message', (msg) => {
    setTimeout(() => {
        // on postMessage method -> return data to message event in main thread
        postMessage([{
            id: 5000,
            name: 'Nguyễn Tuệ Vương',
            position: 'Technical leader'
        }]);
    }, 5000); // simulate large data (slow response)
});