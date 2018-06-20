(function() {
	"use strict";

	const curImg = 0;

	const month = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];

	/**
	 * Helper function for querySelector
	 */
	function qs(s) {
		return document.querySelector(s);
	}

	/**
	 * Load an image, promisified
	 */
	function imgLoad(imageURL) {
		return new Promise((resolve, reject) => {
			let img = document.createElement('img');

			img.addEventListener('load', () => {
				resolve(img);
			});

			img.src = imageURL;
		});
	}

	/**
	 * Draw the specified image on the canvas
	 */
	function drawImage(img) {
		const canvas = qs('#canvas');

		canvas.width = img.width;
		canvas.height = img.height;

		const ctx = canvas.getContext('2d');
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';

		// Draw the background
		ctx.drawImage(img, 0, 0);

		// Draw the description
		const desc1 = qs('#desc1').value;
		const desc2 = qs('#desc2').value;

		ctx.font = 'bold 120px Helvetica,sans-serif';

		ctx.fillText(desc1, canvas.width / 2, 550);
		ctx.fillText(desc2, canvas.width / 2, 703);

		// Draw the instructor and date
		const instname = qs('#instname').value;
		const date = qs('#date').value;

		const namedate = `${instname} \u2022 ${date}`

		ctx.font = '80px Helvetica,sans-serif';

		ctx.fillText(namedate, canvas.width / 2, 824);
	}

	/**
	 * Handle download button click
	 */
	function onDownloadClick() {
		const aTag = this;
		const canvas = qs('#canvas');

		aTag.href = canvas.toDataURL('image/png');
		//aTag.href = canvas.toDataURL('image/jpeg', 1.0); // 1.0 == max quality
		aTag.download = 'ytbg.png';
	}

	/**
	 * Called once all the images have loaded
	 */
	function onImagesLoaded(imgs) {
		drawImage(imgs[curImg]);

		if (!isFontAvailable("Helvetica")) {
			alert("Helvetica font not detected. Please make sure Helvetica is installed!");
		}

		// Add listener to download button
		qs('#download').addEventListener('click', onDownloadClick);

		// Add listeners to input fields
		for (let id of ["#desc1", "#desc2", "#instname", "#date"]) {
			const elem = qs(id);

			elem.addEventListener('keyup', () => drawImage(imgs[curImg]));
		}
	}

	/**
	 * Called when the DOM is ready
	 */
	function onLoad() {
		Promise.all([
			imgLoad("img/lambda-yt-bg-red.jpg"),
		]).then((imgs) => {
			onImagesLoaded(imgs);
		});

		// Restore all text fields from local storage
		const ls = window.localStorage;

		for (let id of ["desc1", "desc2", "instname"]) {
			const val = ls.getItem(id);

			if (val) {
				qs('#' + id).value = val;
			}
		}

		// Set the date field
		const d = new Date();
		const dateStr = `${month[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
		qs('#date').value = dateStr;
	}

	/**
	 * Main
	 */
	window.addEventListener('DOMContentLoaded', onLoad);

	window.addEventListener("beforeunload", function (event) {
		const ls = window.localStorage;

		// Save all text fields to local storage
		for (let id of ["desc1", "desc2", "instname"]) {
			ls.setItem(id, qs('#' + id).value);
		}
	});

}());

