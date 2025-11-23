const fias = (input, list) => {
    const address = document.querySelector(input);
    const listGroup = document.querySelector(list);
    const btnClose = document.querySelector('.droplist-close');

    // Вводим данные в адресную строку, появляется выпадающий список с подсказками
    address.addEventListener('input', (e) => {
        const value = e.target.value;
        const url = `https://fias-public-service.nalog.ru/api/spas/v2.0/GetAddressHint?search_string=${value}&address_type=1`;

        if (value) {
            listGroup.classList.remove('is-hidden');
            getAddress(url);
        }

    })

    // Кликаем по элементу в выпадающем списке, значения элемента  подставляется в адресную строку
    listGroup.addEventListener('click', (e) => {
        const addressFullName = e.target.innerHTML;
        address.value = addressFullName;
        listGroup.innerHTML = '';
        listGroup.classList.add('is-hidden');
    })

    // Кликаем на кнопку "Закрыть", выпадающее меню с подсказками закрывается
    btnClose.addEventListener('click', () => {
        listGroup.innerHTML = '';
        listGroup.classList.add('is-hidden');
    })

    // Получаем данные с сервера и добавляем их в выпадающий список сподсказками
    const getAddress = (url) => {
        fetch(encodeURI(url), {
            headers: {
            'accept': 'application/json',
            'master-token': '2b5796df-5f98-4400-bb14-9757bd10c907'
            }
        }).then(response => response.json())
        .then(commits => {
            const hints = commits.hints;
            listGroup.innerHTML = '';
            console.log(hints);
            hints.forEach(address => {
                const addressFullName = address.full_name;
                listGroup.insertAdjacentHTML('beforeend', `<span class="droplist-item">${addressFullName}</span>`);
            });

        });
    }
}

export default fias ;
export { fias };