let comicData;
let comicId;

const prevPage = () => {
  window.location.pathname = "/" + (parseInt(comicId) - 1);
};
const nextPage = () => {
  fetch(window.location.origin + "/comic-data/last", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      if (comicId !== data.num)
        window.location.pathname = "/" + (parseInt(comicId) + 1);
    });
};

const randomStrip = () => {
  window.location.pathname = "/" + Math.floor(Math.random() * window.sessionStorage.getItem("lastId"));
};

window.onload = () => {
  comicId = window.location.pathname.split("/")[1];
  let url = comicId
    ? window.location.origin + "/comic-data/" + comicId
    : window.location.origin + "/comic-data/last";
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
      let transcriptContent = comicData.transcript.split('\n');
      console.log(comicData.transcript);
      transcript.innerHTML = transcriptContent.map((line) => {
        if (line.startsWith("{{")) return `<p><b>${line.slice(2, -2)}</b></p>`
        else if (line.startsWith("[[")) return `<p><i>${line.slice(2, -2)}</i></p>`
        else return `<p>${line}</p>`}).filter(line => line !== "<p></p>").join("");
    });

  if (!window.sessionStorage.getItem("lastId")) {
    fetch(window.location.origin + "/comic-data/last", {
      method: "GET",
    })
    .then((res) => res.json())
    .then((data) => {
      window.sessionStorage.setItem("lastId", data.num);
    });
  }
};