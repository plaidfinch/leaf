const Mercury = require('@postlight/mercury-parser');
const Epub = require('epub-gen');
const yargs = require('yargs');

let customCss = `
.epub-author {
    color: #555;
}

.epub-link {
    margin-bottom: 30px;
}

.epub-link a {
    color: #666;
    font-size: 90%;
}

.toc-author {
    font-size: 90%;
    color: #555;
}

.toc-link {
    color: #999;
    font-size: 85%;
    display: block;
}

hr {
    border: 0;
    border-bottom: 1px solid #dedede;
    margin: 60px 10%;
}

#toc {
    display: none;
}
`;

const argv = yargs
    .option('url', {
        alias: 'u',
        description: 'A URL for the article to convert',
        type: 'url'
    })
    .option('output', {
        alias: 'o',
        description: 'The location for the output epub file',
        type: 'filepath'
    })
    .demandOption('url', 'Please provide a url')
    .demandOption('output', 'Please provide an output path')
    .help()
    .argv;

// The real work happens here
Mercury.parse(argv.url).then(result => {
    // Generating the article content
    let content =
        '<h1>' + result.title + '</h1>' +
        (result.author !== null ? ('<p>By <b>' + result.author + '</b></p>') : '') +
        result.content;
    // Laying out the metadata
    let options = {
        title: result.title,
        author: result.author,
        tocTitle: '',
        css: customCss,
        content: [
            {
                data: content,
                beforeToc: true
            }
        ]
    };
    if (result.lead_image_url !== null) {
        options.cover = result.lead_image_url;
    }
    // Writing the EPUB file
    new Epub(options, argv.output).promise.then(
        () => console.log("Ebook Generated Successfully!"),
        err => console.error("Failed to generate Ebook because of ", err)
    );
});
