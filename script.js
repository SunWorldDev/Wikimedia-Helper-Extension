document.addEventListener("DOMContentLoaded", function() {

    loadData(); // Call loadData if not already loaded


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

        // Check if 'data' is already a string
        if (typeof data !== 'string') {
            data = JSON.stringify(data); // Stringify the data if it's not a string
        }

        await chrome.storage.sync.set({ data: data }, function() {
            console.log('Data saved successfully');
        });

        // Introduce a small delay before calling loadData
        setTimeout(() => {
            loadData();
        }, 100); // You can adjust the delay time if needed

    } catch (error) {
        console.error('Error saving data:', error);
    }
}



async function loadData() {
    const parent = document.getElementById("templates");
    parent.innerHTML = ""; // Clear the parent element before appending frames
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
            frame.addEventListener("contextmenu", async function(e) {
                e.preventDefault();

                let cTarget = e.currentTarget;

                const userConfirmation = window.confirm("Do you want to delete " + cTarget.children[0].innerHTML + "?");

                if (userConfirmation) {
                    let data = await fetchData();
                    delete data[cTarget.children[0].innerHTML];
                    console.log(cTarget.children[0].innerHTML);

                    await chrome.storage.sync.set({ data: JSON.stringify(data) }, function() {
                        console.log('deleted');
                        loadData(); // Move the loadData call here
                    });
                }
            });
            parent.appendChild(frame);
        }
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
    }
}




async function fetchData() {
    try {
        const result = await chrome.storage.sync.get(['data']);
        if (chrome.runtime.lastError) {
            console.error('Error getting data from storage:', chrome.runtime.lastError);
            return null;
        }

        // Log the result for debugging
        console.log('Storage result:', result);

        // Check if 'data' exists in the result
        if ('data' in result && typeof result.data !== 'undefined') {
            if (typeof result.data === 'string') {
                const parsedData = JSON.parse(result.data);
                console.log('Parsed data:', parsedData);
                return parsedData || {}; // Return an empty object if parsedData is falsy
            } else {
                console.log('Data is not a string:', result.data);
                return null; // Or handle this case accordingly
            }
        } else {
            console.log('No valid data found');
            return {}; // Return an empty object as a default value
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error for further inspection
    }
}