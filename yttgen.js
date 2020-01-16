// TODO
//
// * Using compositing, we can change the color of the icon image at runtime,
//   if we need more icon colors.
// * Dynamically position icon based on icon height
// * Shrink lines of text to fit the image
//

(function() {
	"use strict";

	const WIDTH = 1920; // px, size of final output image
	const HEIGHT = 1080; // px

	// Positions of the individual lines
	const SINGLE_LINE1_Y = (HEIGHT * 0.59570)|0;
	const DOUBLE_LINE1_Y = (HEIGHT * 0.53516)|0;
	const LINE2_Y = (HEIGHT * 0.68457)|0;
	const DATE_LINE_Y = (HEIGHT * 0.80273)|0;
	const ICON_CENTER_Y = (HEIGHT * 0.28613)|0; // For best results, icon should be 250 px height

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

	const DEFAULT_THEME = "Red";

	// List of themes
	const theme = {
		"Red": {
			"bgcolor": "#bb1333",
			"fgcolor": "white"
		},
		"Dark Blue": {
			"bgcolor": "#0c3c78",
			"fgcolor": "white"
		},
		"Blue": {
			"bgcolor": "#1a61b0",
			"fgcolor": "white"
		},
		"Light Blue": {
			"bgcolor": "#3ab5e5",
			"fgcolor": "white"
		},
		"Gray": {
			"bgcolor": "#55506d",
			"fgcolor": "white"
		},
	};

	const icon_fg_map = {  // URL to color
		"img/ls-icon-white.png": "white",
	};

	const fg_icon_map = { // color to img
		"white": null, // filled in when image loads
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

		function normalize(filename) {
			// Normalize filename
			filename = filename.toLowerCase();
			filename = filename.trim();
			filename = filename.replace(/-/g, '');
			filename = filename.replace(/\s/g, '-');
			filename = filename.replace(/[^-a-z0-9]/gi, '');
			filename = filename.replace(/-+/g, '-');

			return filename;
		}

		if (qs('#autogen').checked) {
			let desc1 = normalize(qs('#desc1').value);
			let desc2 = normalize(qs('#desc2').value);

			let filename = [desc1, desc2].filter(Boolean).join('-');


			if (filename === '') {
				qs('#filename').value = '';
			} else {
				qs('#filename').value = filename + '.png';
			}
		}
	}

	/**
	 * Autogenerate the YouTube title
	 * 
	 * Credit: Michael Redig
	 */
	function autoGenTitle() {
		const fields = [
			qs('#desc1').value,
			qs('#desc2').value,
			qs('#instname').value,
			qs('#date').value,
		];

		let outputFields = [];

		for (let f of fields) {
			f = f.trim();
			if (f) {
				outputFields.push(f);
			}
		}

		qs('#titlestring').value = outputFields.join(" - ");
	}


	/**
	 * Draw the specified image on the canvas
	 */
	function drawImage() {
		const canvas = qs('#canvas');

		const curTheme = qs('#theme').value;

		canvas.width = WIDTH;
		canvas.height = HEIGHT;

		const ctx = canvas.getContext('2d');

		// Draw the background
		ctx.fillStyle = theme[curTheme].bgcolor;
		ctx.fillRect(0, 0, canvas.width, canvas.height)

		// Draw the icon
		let fgcolor = theme[curTheme].fgcolor;
		let icon_img = fg_icon_map[fgcolor];

		let icon_x = (WIDTH - icon_img.width) >> 1; // integer div 2
		let icon_y = ICON_CENTER_Y - (icon_img.height >> 1); // integer div 2

		ctx.drawImage(icon_img, icon_x, icon_y);

		// Draw the description
		ctx.fillStyle = fgcolor;
		ctx.textAlign = 'center';

		const desc1 = qs('#desc1').value;
		const desc2 = qs('#desc2').value;

		ctx.font = 'bold 122px Helvetica,sans-serif';

		let desc1Y = desc2 === ''? SINGLE_LINE1_Y: DOUBLE_LINE1_Y;

		ctx.fillText(desc1, canvas.width / 2, desc1Y);
		ctx.fillText(desc2, canvas.width / 2, LINE2_Y);

		// Draw the instructor and date
		const instname = qs('#instname').value;
		const date = qs('#date').value;

		const namedate = `${instname} \u2022 ${date}`;  // 2022 is a bullet

		ctx.font = '82px Helvetica,sans-serif';

		ctx.fillText(namedate, canvas.width / 2, DATE_LINE_Y);
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
		// Set up the color-to-img map
		for (let i of imgs) {
			let src = i.getAttribute('src');
			let color = icon_fg_map[src];
			fg_icon_map[color] = i;
		}

		// Draw the entire image
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
			elem.addEventListener('keyup', autoGenTitle);
		}

		// See if we have to update the filename
		for (let id of ["#desc1", "#desc2"]) {
			const elem = qs(id);

			elem.addEventListener('keyup', autoGenFilename);
		}

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

		for (let i in icon_fg_map) {
			promises.push(imgLoad(i));
		}

		Promise.all(promises).then((imgs) => {
			onImagesLoaded(imgs);
		});

		// Restore all text fields from local storage
		const ls = window.localStorage;

  		for (let id of ["desc1", "desc2", "instname", "theme", "filename"]) {
			let val = ls.getItem(id);

			if (val) {
				// Handle the case where someone might have a discontinued theme
				// in local storage
				if (id == "theme") {
					if (!(val in theme)) {
						val = DEFAULT_THEME;
					}
				}

				qs('#' + id).value = val;
			}
		}

		qs('#autogen').checked = (ls.getItem("autogen") === 'true');

		// Set the date field
		const d = new Date();
		const dateStr = `${month[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
		qs('#date').value = dateStr;

		autoGenFilename();
		autoGenTitle();
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

