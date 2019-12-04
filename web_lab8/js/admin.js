function isOnline() {
    return window.navigator.onLine;
}

document.getElementById('addNews').onclick = function () {
    var title = document.getElementById('titleBody');
    var text = document.getElementById('textBody');

    title.style.border = '1px solid black';
    text.style.border = '1px solid black';

    if (title.value === '' && text.value === '') {
        title.style.border = '2px solid red';
        text.style.border = '2px solid red';
        alert('Напишіть заголовок та текст до новини!');
        return false;
    } else if (title.value === '' && text.value !== '') {
        title.style.border = '2px solid red';
        text.style.border = '1px solid green';
        alert('Напишіть заголовок до новини!');
        return false;
    } else if (title.value !== '' && text.value === '') {
        title.style.border = '1px solid green';
        text.style.border = '2px solid red';
        alert('Напишіть текст до новини!');
        return false;
    } else {
        title.style.border = '1px solid green';
        text.style.border = '1px solid green';
        alert('Новина успішно додана!');

        if (isOnline() === false) {
            if (localStorage.getItem('news') === null) {
                let array = [title.value, text.value];
                localStorage.setItem('news', JSON.stringify([array]));
            } else {
                let array = JSON.parse(localStorage.getItem('news'));
                array.push([title.value, text.value]);
                localStorage.removeItem('news');
                localStorage.setItem('news', JSON.stringify(array));
            }
        }

    }
};

var loadFile = function (event) {
    var img = document.getElementById('output');
    img.src = URL.createObjectURL(event.target.files[0]);
};


