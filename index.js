const Mercury = require('@postlight/mercury-parser');
const Epub = require('epub-gen');
const Tmp = require('tmp');

let url = 'https://newrepublic.com/article/156008/glass-buildings-kill-birds-climate-change';
Mercury.parse(url).then(result => {
    // Generating the article content
    let content =
        '<h1>' + result.title + '</h1>' +
        (result.excerpt !== null ? ('<h2>' + result.excerpt + '</h2>') : '') +
        (result.author !== null ? ('<p>By <b>' + result.author + '</b></p>') : '') +
        result.content;
    // Laying out the metadata
    let options = {
        title: result.title,
        author: result.author,
        tocTitle: '',
        content: [
            {
                data: content,
                beforeToc: true
            }
        ]
    };
    if (result.excerpt !== null) {
        options.title += ': ' + result.excerpt;
    }
    if (result.lead_image_url !== null) {
        options.cover = result.lead_image_url;
    }
    // Writing the EPUB file
    new Epub(options, result.title + '.epub').promise.then(
        () => console.log("Ebook Generated Successfully!"),
        err => console.error("Failed to generate Ebook because of ", err)
    );
});
