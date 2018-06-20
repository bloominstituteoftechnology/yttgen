(function() {
	"use strict";

	function qs(s) {
		return document.querySelector(s);
	}

	function imgLoad(imageURL) {
		return new Promise((resolve, reject) => {
			let img = document.createElement('img');

			img.addEventListener('load', () => {
				resolve(img);
			});

			img.src = imageURL;
		});
	}

	function drawImage(img) {
		const canvas = qs('#canvas');

		canvas.width = img.width;
		canvas.height = img.height;

		const ctx = canvas.getContext('2d');

		ctx.drawImage(img, 0, 0);
	}

	function onDownloadClick() {
		const aTag = this;
		const canvas = qs('#canvas');

		aTag.href = canvas.toDataURL('image/png');
		//aTag.href = canvas.toDataURL('image/jpeg', 1.0); // 1.0 == max quality
		aTag.download = 'ytbg.png';
	}

	function onImagesLoaded(imgs) {
		drawImage(imgs[0]);

		if (!isFontAvailable("Helvetica")) {
			alert("Helvetica font not detected. Please make sure Helvetica is installed!");
		}

		qs('#download').addEventListener('click', onDownloadClick);
	}

	function onLoad() {
		Promise.all([
			imgLoad("img/lambda-yt-bg-red.jpg"),
		]).then((imgs) => {
			onImagesLoaded(imgs);
		});
	}

	window.addEventListener('DOMContentLoaded', onLoad);

}());

