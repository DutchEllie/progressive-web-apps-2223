if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('serviceworker.js');
}

// document.querySelector('#show').addEventListener('click', () => {
//   const iconUrl = document.querySelector('select').selectedOptions[0].value;
//   let imgElement = document.createElement('img');
//   imgElement.src = iconUrl;
//   document.querySelector('#container').appendChild(imgElement);
// });

const onloadPageNum = 1;
const pageSize = 10;
let currentPage = 1;

// Initial value, gets changed in nextButton's EventListener
let maxPage = -1;

function setEventListeners() {
	const previousLink = document.querySelector(".guestbook-comments > a:first-of-type");
	const nextLink = document.querySelector(".guestbook-comments > a:nth-of-type(2)");
	
	previousLink.addEventListener("click", async(event) =>  {
		event.preventDefault();
		console.log("PAIN");
		
		let url = previousLink.getAttribute('href');
		await setComments(url);
		
		return false;
	}, false);
	
	nextLink.addEventListener("click", async(event) => {
		event.preventDefault();
		console.log("PAIN");
		
		let url = nextLink.getAttribute('href');
		await setComments(url);
		
		return false;
	}, false);
	
}
setEventListeners();

async function setComments(url) {
	let resp = await fetch(url, {
		headers: {
			callsource: "js"
		}
	});
	
	let data = await resp.text();
	
	const guestbookCommentsWrapper = document.querySelector('.guestbook-comments');
	guestbookCommentsWrapper.innerHTML = data;
	setEventListeners();
}

async function loadComments(pageSize, pageNumber) {
	let apiURL = "https://api.quenten.nl/api/testing/comment";
	let res = await fetch(apiURL);
	res2 = await res.json();
	
	// pageSize = 10
	// pageNumber = 2
	// lowerBound = pageSize * pageNumber - pageSize = 10
	let lowerBound = pageSize * pageNumber - pageSize;
	
	// pageSize = 10
	// pageNumber = 2
	// upperBound = pageSize * pageNumber - 1 = 19
	let upperBound = pageSize * pageNumber;
	return res2.slice(lowerBound, upperBound);
}