"use strict"

import notifier from 'node-notifier';
import stream from 'stream';
import cheerio from 'cheerio';
import request from 'request';
import zlib from 'zlib';

function isDispo(content) {
	let $ = cheerio.load(content);
	if ($("tr.zone-dedicated-availability[data-ref='150sk10']").find('.out-of-stock').length == 0) {
		process.stdout.write('$');
		return Promise.resolve()
	} else {
		process.stdout.write('.');
		return Promise.reject();
	}
}

function sendNotif() {
	notifier.notify({
	  'title': 'kimsufi',
	  'message': 'GOGOGOGOGOGO !!',
	  'open' : 'https://www.kimsufi.com/fr/commande/kimsufi.xml?reference=150sk10&quantity=1'
	});
}

function getPage() {
	let options = {
		url: 'https://www.kimsufi.com/fr/index.xml',
		headers: {
			'Accept-Encoding': 'gzip'
		},
		gzip: true
	};
        
	request(options, (error, response, body) => {
		if (error) {
			process.stdout.write('?');
			setTimeout(getPage, 3000)
		}
		else
			isDispo(body).then(sendNotif, setTimeout(getPage, 3000));
	});
}

getPage()


