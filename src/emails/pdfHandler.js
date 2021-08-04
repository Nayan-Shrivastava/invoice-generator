const ejs = require('ejs');
const pdf = require('html-pdf');
const path = require('path');
const { sendInvoicePDF } = require('./account');

const pdfHandler = async (invoice) => {
	await ejs.renderFile(
		path.join(__dirname, '../views/', 'invoice-template.ejs'),
		{ invoice },
		async (err, data) => {
			if (err) {
				throw err;
			} else {
				let options = {
					height: '10.5in'
				};
				await pdf
					.create(data, options)
					.toBuffer(async function (err, buffer) {
						if (err) {
							throw err;
						} else {
							bufferedPdf = await buffer.toString('base64');
							sendInvoicePDF(
								invoice.email,
								invoice.name,
								bufferedPdf
							);
						}
					});
			}
		}
	);
};

// const pdfHandler = async (invoice) => {
// 	console.log(invoice);
// 	let options = {
// 		"height": "11.25in",
// 		"width": "8.5in",
// 		"header": {
// 			"height": "20mm"
// 		},
// 		"footer": {
// 			"height": "20mm",
// 		},
// 	};
// 	try {
// 		const data = await ejs.renderFile(path.join(__dirname, '../views/', "invoice-template.ejs"), { invoice })
// 		const buffer = await pdf.create(data, options).toBuffer();
// 		const bufferedPdf = await buffer.toString('base64');
// 		return bufferedPdf;
// 	} catch (e) {
// 		throw e;
// 	}

// }

module.exports = {
	pdfHandler
};
