var useLocalStorage = false;
var indexedDBorLocalStorage = 'indexed';

function isOnline() {
    return window.navigator.onLine;
}

if (useLocalStorage === true) {
    window.addEventListener('offline', function (event) {
        document.getElementById('addComment').onclick = function () {
            let comment = document.getElementById('commentBody');
            // let comment = $.trim($("#commentBody").val());
            let author = currentName();
            let time = currentTime();
            let date = currentDate();

            if (isOnline() === false) {
                if (localStorage.getItem('appeal') === null) {
                    array = [comment.value, author, time, date];
                    localStorage.setItem('appeal', JSON.stringify([array]));
                } else {
                    array = JSON.parse(localStorage.getItem('appeal'));
                    array.push([comment.value, author, time, date]);
                    localStorage.removeItem('appeal');
                    localStorage.setItem('appeal', JSON.stringify(array));
                }
            }
            comment.value = "";
        };
    });

    window.addEventListener('online', function (event) {
        let comment = document.getElementById('commentBody');
        // let comment = $.trim($("#commentBody").val());
        if (localStorage.getItem('appeal') !== null) {
            let array = JSON.parse(localStorage.getItem('appeal'));
            for (var x = 0; x < array.length; x++) {
                var l_comment = array[x][0];
                var l_author = array[x][1];
                var l_time = array[x][2];
                var l_date = array[x][3];
                const div = document.createElement('div');
                div.innerHTML = `
                        <br>
                        <div class="row justify-content-center">
                            <div class="border border-dark rounded" style="margin: 0 7% 4% 0; height: 5%">
                                <p>` + l_author + ` <br> ` + l_time + ` <br>` + l_date + `</p>
                                <p></p>
                                <p></p>
                            </div>
                                <div class="border border-dark rounded col-xs-12 col-sm-12 col-md-8 col-lg-8" style="margin: 0 1% 0 1%">
                                <p>` + l_comment + `</p>
                            </div>
                        </div>
                        <br>
                        <hr>
                    `;
                document.getElementById('container').append(div);
                comment = "";
            }
        }
    });
}

document.getElementById('addComment').onclick = function () {
    var comment = document.getElementById('commentBody');
    // let comment = $.trim($("#commentBody").val());
    var id = guid();
    var author = currentName();
    var time = currentTime();
    var date = currentDate();

    if (localStorage === true) {
        if (isOnline() === false) {
            if (localStorage.getItem('appeal') === null) {
                array = [comment.value, author, time, date];
                console.log(array);
                localStorage.setItem('appeal', JSON.stringify([array]));
            } else {
                array = JSON.parse(localStorage.getItem('appeal'));
                array.push([comment.value, author, time, date]);
                localStorage.removeItem('appeal');
                localStorage.setItem('appeal', JSON.stringify(array));
            }
        }
    } else {
        let db;
        var commentsData = [{id: id, author: author, comment: comment, date: date, time: time}];
        var request = window.indexedDB.open("comment", 1);

        request.onerror = function (event) {
            console.log("error: ");
        };

        request.onsuccess = function (event) {
            db = request.result;
            console.log("success: " + db);
            addData()
        };

        function addData() {

            // open a read/write db transaction, ready for adding the data
            var transaction = db.transaction(["comments"], "readwrite");

            // report on the success of the transaction completing, when everything is done
            transaction.oncomplete = function (event) {
                console.log("Transaction completed");
            };

            transaction.onerror = function (event) {
                console.log("Transaction not opened due to error. Duplicate items not allowed");
            };

            // create an object store on the transaction
            var objectStore = transaction.objectStore("comments");

            // Make a request to add our newItem object to the object store
            var objectStoreRequest = objectStore.add(commentsData[i]);

            objectStoreRequest.onsuccess = function (event) {
                // report the success of our request
                console.log("Request successful");
            }
        }

        // const commentsData = [
        //     { id: id, author: author, comment: comment, date: date, time: time }
        // ];

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            var objectStore = db.createObjectStore("comments", {keyPath: "id", autoIncrement: true});

            objectStore.createIndex("author", "author", {unique: false});
            objectStore.createIndex("comment", "comment", {unique: false});
            objectStore.createIndex("date", "date", {unique: false});
            objectStore.createIndex("time", "time", {unique: false});

            // for (var i in commentsData) {
            //     objectStore.add(commentsData[i]);
            // }
        };

        request.onsuccess = function (event) {
            alert("Comment has been added to your database.");
            console.log(request.result)
        };

        request.onerror = function (event) {
            alert("Unable to add data.");
        };

        const div = document.createElement('div');
        div.innerHTML = `
                    <br>
                    <div class="row justify-content-center">
                        <div class="border border-dark rounded" style="margin: 0 7% 4% 0; height: 5%">
                            <p>` + author + ` <br> ` + time + ` <br>` + date + `</p>
                            <p></p>
                            <p></p>
                        </div>
                            <div class="border border-dark rounded col-xs-12 col-sm-12 col-md-8 col-lg-8" style="margin: 0 1% 0 1%">
                            <p>` + comment.value + `</p>
                        </div>
                    </div>
                    <br>
                    <hr>
                `;

        document.getElementById('container').appendChild(div);
        comment.value = "";
    }
};

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function currentName() {
    return prompt("Введіть своє ім'я:");
}

function currentTime() {
    let now = new Date();
    console.log(now.getHours() + ":" + now.getMinutes());
    return now.getHours() + ":" + now.getMinutes();
}

function currentDate() {
    let now = new Date();
    console.log(now.getDate() + "." + (now.getMonth() + 1) + "." + now.getFullYear());
    return now.getDate() + "." + (now.getMonth() + 1) + "." + now.getFullYear();
}