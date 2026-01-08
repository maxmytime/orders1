import settings from '/js/config.js';

function getURL(settings) {
    const protocol = settings.protocol;
    const host = settings.host;
    const port = settings.port;
    const url = `${protocol}://${host}:${port}`;
    return url;
}


export async function setNewGUID(element) {

    console.log('getguid');
    const contragents = element.querySelectorAll('select[name="order-address-basis-legal-entity"]');
    console.log(contragents);

    for (const contragent of contragents) {
        console.log(contragent);
        if (!contragent.dataset.guid) {
            fetch(`${getURL(settings)}` + `/getnewguid`)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    contragent.dataset.guid = data.Data;
                })
        }
    }



    // try {
    //     const response = await fetch(`${getURL(settings)}` + `/getnewguid`);

    //     if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    //     const data = await response.json();
    //     console.log(data.Data);
    //     return data.Data;
    // } catch (error) {
    //     console.error('Fetch failed:', error);
    //     throw error;
    // }

}