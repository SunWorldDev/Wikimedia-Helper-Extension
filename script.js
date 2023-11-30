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

    if (document.getElementById('title').value == "") {
        alert("Please enter a title!");
        return;
    }
    if (document.getElementById('code').value == "") {
        alert("Please enter a wiki code snippet!");
        return;
    }

    await saveData();

    closePopup();
}

async function saveData() {
    try {
        let title = document.getElementById('title').value;
        let code = document.getElementById('code').value;

        let data = await fetchData();

        // Ensure data is an object or create an empty object if needed
        if (typeof data !== 'object' || data === null) {
            data = {};
        }

        data[title] = code;

        chrome.storage.sync.set({ data: JSON.stringify(data) }, function() {
            console.log('Data saved successfully');
        });
    } catch (error) {
        console.error('Error saving data:', error);
    }
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


async function loadData() {
    const parent = document.getElementById("templates");
    parent.innerHTML = "";
    try {
        let data = await fetchData();

        for (const key in data) {
            let frame = document.createElement("div");
            frame.setAttribute("class", "frame");
            frame.setAttribute("data-code", data[key]);
            frame.innerHTML = "<h2>" + key + "</h2>"
            frame.addEventListener("click", (e) => {
                navigator.clipboard.writeText(e.currentTarget.getAttribute("data-code"));
            });
            parent.appendChild(frame);
        }
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
    }
}