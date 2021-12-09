const partials = [{
        "element_identifier": "header",
        "html_file_name": "header.html",
    },
    {
        "element_identifier": "footer",
        "html_file_name": "footer.html",
    },
    {
        "element_identifier": "#replace-scripts-target",
        "html_file_name": "scripts.html",
    },
];

const wwwrootFolder = '/wwwroot/'
let path = window.location.pathname;
path = path.substring(0, path.lastIndexOf('/') + 1);
path = path.replace(wwwrootFolder, '');

let splittedPath = path.substring(0, path.lastIndexOf('/')).split('/').filter(Boolean);

splittedPath = splittedPath.splice(0, 2);

document.addEventListener('DOMContentLoaded', async function () {
    partials.forEach(partialInfo => {
        const {
            element_identifier: elementName,
            html_file_name: fileName,
        } = partialInfo;

        const element = document.querySelector(elementName);
        let fileUrl = `assets/views/partials/${fileName}`;

        if (path) {
            fileUrl = fileUrl.replace(path, '');
        }

        fetch(fileUrl).then(res => {
            return res.text();
        }).then(function (html) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, 'text/html');

            console.log(doc.querySelectorAll('.nav-list>li>a'));

            // Make a copy of splitted path to remove found segment matches from as they are found. To prevent issues with duplicate matches
            let splittedPathCopy = splittedPath;
            doc.querySelectorAll('[href]').forEach(hrefElement => {
                if (hrefElement.host == window.location.host && hrefElement.href.includes(wwwrootFolder)) {
                    let linkSegmentsToRemove;
                    linkSegmentsToRemove = hrefElement.href.substring(0, hrefElement.href.lastIndexOf('/') + 1);
                    linkSegmentsToRemove = linkSegmentsToRemove.substring(linkSegmentsToRemove.indexOf(wwwrootFolder) + wwwrootFolder.length);
                    linkSegmentsToRemove = linkSegmentsToRemove.split('/').filter(Boolean);

                    splittedPath.forEach(linkSegment => {
                        if (splittedPathCopy.includes(linkSegment)) {
                            hrefElement.href = hrefElement.href.replace(linkSegment + '/', '');
                            // splittedPathCopy.filter(path => path !== linkSegment);
                        }
                    });
                }
            });

            doc.querySelectorAll('[src]').forEach(srcElement => {
                if (srcElement.src.includes(wwwrootFolder)) {
                    let linkSegmentsToRemove;
                    linkSegmentsToRemove = srcElement.src.substring(0, srcElement.src.lastIndexOf('/') + 1);
                    linkSegmentsToRemove = linkSegmentsToRemove.substring(linkSegmentsToRemove.indexOf(wwwrootFolder) + wwwrootFolder.length);
                    linkSegmentsToRemove = linkSegmentsToRemove.split('/').filter(Boolean);
                    splittedPath.forEach(linkSegment => {
                        if (splittedPathCopy.includes(linkSegment)) {
                            srcElement.src = srcElement.src.replace(linkSegment + '/', '');
                            // splittedPathCopy.filter(path => path !== linkSegment);
                        }
                    });
                }
            })

            if (partialInfo.element_identifier == '#replace-scripts-target') {
                doc.querySelectorAll(partialInfo.element_identifier + '>script').forEach(script => {
                    document.querySelector('head').appendChild(script);
                });
            } else {
                element.parentNode.replaceChild(doc.querySelector(partialInfo.element_identifier), element);
            }
        });
    });
});