
// https://www.w3schools.com/php/php_file_upload.asp
// https://www.codingnepalweb.com/file-upload-with-progress-bar-html-javascript/

const form = document.querySelector("form"),
      fileInput = document.querySelector(".file-input"),
      progressArea = document.querySelector(".progress-area"),
      uploadedArea = document.querySelector(".uploaded-area");

// form click event
form.addEventListener("click", () => fileInput.click());

fileInput.onchange = ({target}) => {
    let file = target.files[0]; //getting file [0] this means if user has selected multiple files then get first one only
    if (file) {
        let fileName = file.name; //getting file name
        if (fileName.length >= 12) { //if file name length is greater than 12 then split it and add ...
            let splitName = fileName.split('.');
            fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
        }
        uploadFile(fileName, file.name); //calling uploadFile with passing file name as an argument
    }
};

// file upload function
function uploadFile(name, filename) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "upload.php");

    xhr.upload.addEventListener("progress", ({loaded, total}) => {
        let fileLoaded = Math.floor((loaded / total) * 100);
        let fileTotal = Math.floor(total / 1000);
        let fileSize;

        if (fileTotal < 1024)
            fileSize = fileTotal + " KB";
        else
            fileSize = (loaded / (1024 * 1024)).toFixed(2) + " MB";

        let progressHTML = `<li class="row">
          <div class="content">
            <div class="details">
              <span class="name">${name} • Uploading</span>
              <span class="percent">${fileLoaded}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress" style="width: ${fileLoaded}%"></div>
            </div>
          </div>
        </li>`;

        uploadedArea.innerHTML = "";
        uploadedArea.classList.add("onprogress");
        progressArea.innerHTML = progressHTML;

        if (loaded == total) {
            const url = location.origin + "/files/" + encodeURI(filename);
            const f = "var inp=this; setTimeout(function(){inp.select();},10);";
            progressArea.innerHTML = "";
            let uploadedHTML = `<li class="row">
              <div class="content upload">
                <div class="details">
                  <span class="name">${name} • Uploaded</span>
                  <span class="size">${fileSize}</span><br>
                  <textarea class="url" readonly onfocus="${f}">${url}</textarea>
                  <a class="go" href="${url}">GO</a>
                  <br><canvas class="qr"></canvas>
                </div>
              </div>
            </li>`;
            uploadedArea.classList.remove("onprogress");
            uploadedArea.innerHTML = uploadedHTML;
            const qr = document.getElementsByClassName("qr")[0];
            QRCode.toCanvas(qr, url);
        }
    });

    let data = new FormData(form);
    xhr.send(data);
}
