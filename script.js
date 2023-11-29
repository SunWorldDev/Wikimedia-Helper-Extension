document.addEventListener("DOMContentLoaded", function() {

    document.getElementById('close').addEventListener("click", (e) => {
        closePopup();
    });

    document.getElementById('add').addEventListener("click", (e) => {
        openPopup();
    });
});

function openPopup() {
    document.getElementById('popup').style.display = 'block';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}