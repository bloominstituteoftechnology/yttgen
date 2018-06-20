(function() {
	"use strict";

	const curImg = 0;

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

		ctx.font = 'bold 120px Helvetica,monospace';

		ctx.fillText(desc1, canvas.width / 2, 550);
		ctx.fillText(desc2, canvas.width / 2, 703);
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
	}

	/**
	 * Main
	 */
	window.addEventListener('DOMContentLoaded', onLoad);

}());

