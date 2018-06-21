(function() {
	"use strict";

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

	// Map image URLs to theme keys
	const imgURL_theme = {
		"img/lambda-yt-bg-black.jpg": "Black",
		"img/lambda-yt-bg-teal.jpg": "Teal",
		"img/lambda-yt-bg-red.jpg": "Red",
		"img/lambda-yt-bg-white.jpg": "White",
	};

	// List of themes
	const theme = {
		"Black": {
			"img": null,
			"fgcolor": "white"
		},
		"Teal": {
			"img": null,
			"fgcolor": "white"
		},
		"Red": {
			"img": null,
			"fgcolor": "white"
		},
		"White": {
			"img": null,
			"fgcolor": "black"
		}
	};

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
	 * Check to see if we need to update the autogen filename
	 */
	function autoGenFilename() {
		if (qs('#autogen').checked) {
			let filename = qs('#desc1').value;

			// Normalize filename
			filename = filename.toLowerCase();
			filename = filename.trim();
			filename = filename.replace(/-/g, '');
			filename = filename.replace(/\s/g, '-');
			filename = filename.replace(/[^-a-z0-9]/gi, '');
			filename = filename.replace(/-+/g, '-');

			if (filename === '') {
				qs('#filename').value = '';
			} else {
				qs('#filename').value = filename + '.png';
			}
		}
	}

	/**
	 * Draw the specified image on the canvas
	 */
	function drawImage() {
		const canvas = qs('#canvas');

		const curTheme = qs('#theme').value;

		const img = theme[curTheme].img;

		canvas.width = img.width;
		canvas.height = img.height;

		const ctx = canvas.getContext('2d');
		ctx.fillStyle = theme[curTheme].fgcolor;
		ctx.textAlign = 'center';

		// Draw the background
		ctx.drawImage(img, 0, 0);

		// Draw the description
		const desc1 = qs('#desc1').value;
		const desc2 = qs('#desc2').value;

		ctx.font = 'bold 122px Helvetica,sans-serif';

		let desc1Y = desc2 === ''? 610: 548;

		ctx.fillText(desc1, canvas.width / 2, desc1Y);
		ctx.fillText(desc2, canvas.width / 2, 701);

		// Draw the instructor and date
		const instname = qs('#instname').value;
		const date = qs('#date').value;

		const namedate = `${instname} \u2022 ${date}`

		ctx.font = '82px Helvetica,sans-serif';

		ctx.fillText(namedate, canvas.width / 2, 822);
	}

	/**
	 * Handle download button click
	 */
	function onDownloadClick() {
		const aTag = this;
		const canvas = qs('#canvas');

		aTag.href = canvas.toDataURL('image/png');
		//aTag.href = canvas.toDataURL('image/jpeg', 1.0); // 1.0 == max quality

		const filenameInput = qs('#filename');
		let filename = filenameInput.value;

		if (filename === '') {
			filename = filenameInput.getAttribute('placeholder');
		}

		aTag.download = filename;
	}

	/**
	 * Called once all the images have loaded
	 */
	function onImagesLoaded(imgs) {
		// Fill in the theme img mapping
		for (let i of imgs) {
			const url = i.getAttribute('src');
			const themeName = imgURL_theme[url];

			theme[themeName].img = i;
		}

		drawImage();

		// Show the main page, hide loading page
		qs('#mainpage').classList.remove('hidden');
		qs('#loading').classList.add('hidden');

		// Detect Helvetica

		if (!isFontAvailable("Helvetica")) {
			alert("Helvetica font not detected. Please make sure Helvetica is installed!");
		}

		// Add listener to download button
		qs('#download').addEventListener('click', onDownloadClick);

		// Add listeners to input fields
		for (let id of ["#desc1", "#desc2", "#instname", "#date"]) {
			const elem = qs(id);

			elem.addEventListener('keyup', drawImage);
		}

		// See if we have to update the filename
		qs('#desc1').addEventListener('keyup', autoGenFilename);

		// Add listener to select change
		qs('#theme').addEventListener('change', drawImage);

		// Add listener to select change
		qs('#autogen').addEventListener('change', autoGenFilename);
	}

	/**
	 * Called when the DOM is ready
	 */
	function onLoad() {
		const promises = [];

		for (let i in imgURL_theme) {
			promises.push(imgLoad(i));
		}

		Promise.all(promises).then((imgs) => {
			onImagesLoaded(imgs);
		});

		// Restore all text fields from local storage
		const ls = window.localStorage;

  		for (let id of ["desc1", "desc2", "instname", "theme", "filename"]) {
			const val = ls.getItem(id);

			if (val) {
				qs('#' + id).value = val;
			}
		}

		qs('#autogen').checked = (ls.getItem("autogen") === 'true');

		// Set the date field
		const d = new Date();
		const dateStr = `${month[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
		qs('#date').value = dateStr;

		autoGenFilename();
	}

	/**
	 * Main
	 */
	window.addEventListener('DOMContentLoaded', onLoad);

	window.addEventListener("beforeunload", function (event) {
		const ls = window.localStorage;

		// Save all text fields to local storage
		for (let id of ["desc1", "desc2", "instname", "theme", "filename"]) {
			ls.setItem(id, qs('#' + id).value);
		}

		// Save the checkbox
		ls.setItem("autogen", qs('#autogen').checked);
	});

}());

