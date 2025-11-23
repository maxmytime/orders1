import settings from '/js/config.js';

export class ApiClient {
    constructor() {
        this.host = this.getURL(settings);
    }

    getURL(settings) {
        const protocol = settings.protocol;
        const host = settings.host;
        const port = settings.port;
        const url = `${protocol}://${host}:${port}`;
        return url;
    }

    async fetchGetData(baseUrl) {
        try {
            const response = await fetch(`${this.host}` + `${baseUrl}`);

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Fetch failed:', error);
            throw error;
        }
    }

    async fetchPostData(baseUrl, data) {
        try {
            const response = await fetch(`${this.host}` + `${baseUrl}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(data)
            })

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Fetch failed:', error);
            throw error;
        }


    }
}