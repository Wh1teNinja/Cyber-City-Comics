let comicData;
let comicId;

const prevPage = () => {
  window.location.pathname = "/" + (parseInt(comicId) - 1);
};
const nextPage = () => {
  if (comicId !== parseInt(window.sessionStorage.getItem("lastId")))
    window.location.pathname = "/" + (parseInt(comicId) + 1);
};

const randomStrip = () => {
  window.location.pathname =
    "/" + Math.floor(Math.random() * window.sessionStorage.getItem("lastId") + 1);
};

window.onload = () => {
  // Fetches id of a last comic strip and storing it to session storage for the further use
  if (!window.sessionStorage.getItem("lastId")) {
    fetch(window.location.origin + "/comic-data/last", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        window.sessionStorage.setItem("lastId", data.num);
      });
  }

  // gets comic strip id from url
  comicId = window.location.pathname.split("/")[1];

  // if last then just go to home page
  if (comicId >= parseInt(window.sessionStorage.getItem("lastId"))) {
    window.location.pathname = "/";
  }

  
  let url =
    comicId === ""
      ? window.location.origin + "/comic-data/last"
      : window.location.origin + "/comic-data/" + comicId;
  // Fetches comic data from server and puts it on the page 
  fetch(url, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      comicId = data.num;
      comicData = data;
      let comicImg = document.getElementById("comic-strip");
      comicImg.src = comicData.img;
      comicImg.alt = comicData.alt;

      let comicTitle = document.getElementById("strip-title");
      comicTitle.innerHTML = comicData.title;

      let comicDate = document.getElementById("strip-date");
      comicDate.innerHTML =
        comicData.day + "/" + comicData.month + "/" + comicData.year;

      let comicNumber = document.getElementById("comic-number");
      comicNumber.innerHTML = comicId;

      let transcript = document.getElementById("transcript");
      let transcriptContent = comicData.transcript.split("\n");

      // transcript generation
      transcript.innerHTML = transcriptContent
        .map((line) => {
          if (line.startsWith("{{")) return `<p><b>${line.slice(2, -2)}</b></p>`;
          else if (line.startsWith("[["))
            return `<p><i>${line.slice(2, -2)}</i></p>`;
          else
            return `<p>${line.replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</p>`;
        })
        .filter((line) => line !== "<p></p>")
        .join("");

      // hides transcript header if it is empty
      if (transcript.innerHTML !== "") {
        let transcriptH2 = document.getElementById("transcript-h2");
        transcriptH2.className = "";
      }
    });
};
