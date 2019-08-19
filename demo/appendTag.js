export function appendTag(tag, text, parentNode )
{   let t = document.createElement(tag);
    t.innerHTML = text;
    (parentNode || document.body ).appendChild(t);
}
