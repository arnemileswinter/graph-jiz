/**
 * Use Mathjax to render an array of strings into a Math-Svg.
 * Each string in the array is put onto a newline.
 *
 * @param labels An array of strings that is to be rendered with MathJax on seperate lines.
 * @param fallback If provided, this string is rendered in case the labels array is empty.
 * @returns {string} Containing SVG of the rendered labels.
 */
export default (labels, fallback = "") => {
    const mathJax = window.MathJax;
    if(!mathJax) {
        throw new Error("Mathjax is not imported!");
    }

    const labelContent = labels.length === 0
        ? "\\textsf{ " + fallback + " }"
        : "\\begin{align*} "
        + labels.map(
            label => label.split('\n').map(line => "& \\textsf{ " + line + " } ").join("\\\\")
        ).join("\\\\")
        + "\\end{align*}";

    const svgElement = mathJax.tex2svg(labelContent).children[0];

    const svgWhiteBackground = document.createElement('style');
    svgWhiteBackground.innerHTML = "svg {background-color: white; position: fixed; }";

    svgElement.appendChild(svgWhiteBackground);

    return svgElement.outerHTML;
};
