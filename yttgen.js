(function() {
	"use strict";

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

		ctx.drawImage(img, 0, 0);
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
		drawImage(imgs[0]);

		if (!isFontAvailable("Helvetica")) {
			alert("Helvetica font not detected. Please make sure Helvetica is installed!");
		}

		qs('#download').addEventListener('click', onDownloadClick);
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

