export const saveArchive = (data, param) => {
    console.log('saveArchive');
    if (param == 1) {
        sessionStorage.setItem('data', data);
    } else if (param == 2) {
        let oldData = JSON.parse(sessionStorage.getItem('data'));
        let newData = JSON.parse(data);

        newData.forEach(el => {
            oldData.push(el);
        })

        // console.log(oldData, newData);

        sessionStorage.setItem('data', JSON.stringify(oldData));
    } else if (param == 3) {
        sessionStorage.removeItem('data');
        sessionStorage.setItem('data', data);
    }
}

export const getArchive = () => {
    console.log(JSON.parse(sessionStorage.getItem('data')));
    return JSON.parse(sessionStorage.getItem('data'));
}