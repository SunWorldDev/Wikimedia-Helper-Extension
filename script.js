let nextSaveSlot = 0;

document.addEventListener("DOMContentLoaded", function() {

    loadData();

    document.getElementById('close').addEventListener("click", (e) => {
        closePopup();
    });

    document.getElementById('add').addEventListener("click", (e) => {
        openPopup();
    });

    document.getElementById("addBtn").addEventListener("click", (e) => {
        addFrame();
    });

});

function openPopup() {
    document.getElementById('popup').style.display = 'block';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
    loadData();
}

function addFrame() {

    saveData()

    nextSaveSlot++;

    closePopup();
}

async function saveData() {
    let title = document.getElementById('title').value;
    let code = document.getElementById('code').value;

    let data = await getData();

    Object.defineProperty(data, title, {
        value: code
    });

    chrome.storage.sync.set({ data: data });
}

function getData() {
    chrome.storage.sync.get(['data'], function(result) {
        if (result.data) {
            return result.data;
        }
    });
    return {};
}

function loadData() {
    console.log(getData());
}