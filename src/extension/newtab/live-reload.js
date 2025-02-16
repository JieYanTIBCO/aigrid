(() => {
    const ws = new WebSocket('ws://localhost:35729');

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'reload') {
                console.log('🔄 Reloading page...');
                window.location.reload();
            }
        } catch (error) {
            console.error('Live reload error:', error);
        }
    };

    ws.onopen = () => {
        console.log('🔌 Live reload connected');
    };

    ws.onclose = () => {
        console.log('🔌 Live reload disconnected');
    };
})();
