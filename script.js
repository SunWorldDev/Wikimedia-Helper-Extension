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

async function addFrame() {

    console.log(await saveData());

    nextSaveSlot++;

    closePopup();
}

async function saveData() {
    let title = document.getElementById('title').value;
    let code = document.getElementById('code').value;

    fetchData().then((data) => {
        daten = data;
    });

    // Ensure daten is an object or create an empty object if needed
    if (typeof daten !== 'object' || daten === null) {
        daten = {};
    }

    daten[title] = code;

    chrome.storage.sync.set({ data: JSON.stringify(daten) }, function() {
        console.log('Data saved successfully');
    });
}



async function fetchData() {
    try {
        const result = await chrome.storage.sync.get(['data']);
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
        }

        // Check if 'data' exists in the result
        if ('data' in result) {
            console.log(JSON.parse(result.data));
            return JSON.parse(result.data);
        } else {
            console.log('No data found');
            return null; // Or another default value
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return null; // Or handle the error accordingly
    }
}


function loadData() {}