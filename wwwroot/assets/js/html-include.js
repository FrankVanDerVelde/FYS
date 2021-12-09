const partials = [{
    "element_name": "header",
    "html_file_name": "header.html"

},
{
    "element_name": "footer",
    "html_file_name": "footer.html"

}]
document.addEventListener('DOMContentLoaded', async function () {
    partials.forEach(partialInfo => {
        const { element_name: elementName, html_file_name: fileName } = partialInfo;

        const element = document.querySelector(elementName);
        const fileUrl = `partials/${fileName}`;

        fetch(fileUrl).then(res => {
            return res.text();
        }).then(function (html) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, 'text/html');

            element.parentNode.replaceChild(doc.querySelector(partialInfo.element_name), element);
        });
    });
});